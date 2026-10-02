"use client"

import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import Image from "next/image";
import { formatCurrency } from "@/src/lib/formatters";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { useState, type SubmitEvent } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

type CheckoutFormProps = {
    clientSecret: string;
    product: {
        imagePath: string;
        name: string;
        priceInCents: number;
        description: string;
    };
};
export default function CheckoutForm({product, clientSecret}: CheckoutFormProps) {
    return (
        <>  
            <div className="max-w-5xl w-full mx-auto space-y-8">
                <div className="flex gap-4 items-center"></div>
                    <div className="video-aspect flex-shrink-0 w-1/3 relative">
                        <Image 
                            src={product.imagePath} 
                            fill 
                            alt={product.name}
                            className="object-cover" 
                        />
                    </div>
                    <div className="text-lg">
                        {formatCurrency(product.priceInCents / 100)}
                    </div>
                    <h1 className="text-2xl font-bold">{product.name}</h1>
                    <div className="line-clamp-3 text-muted-foreground">
                        {product.description}
                    </div>
                </div>
            <Elements options={{clientSecret}} stripe={stripePromise}>
                <Form priceInCents={product.priceInCents} />
            </Elements>
        </>
    );
}

function Form({ priceInCents }: { priceInCents: number }) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);

    function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        if (stripe == null || elements == null) return;

        setIsLoading(true);

        stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/stripe/purchase-success`,
            },
        });
    }

    return (<form onSubmit={handleSubmit}>
        <Card>
            <CardHeader>
                <CardTitle>Checkout</CardTitle>
                <CardDescription className="text-destructive">Error</CardDescription>
            </CardHeader>
            <CardContent>
                <PaymentElement options={{ layout: "tabs" }} />
            </CardContent>
            <CardFooter>
                <Button
                    className="w-full"
                    size="lg"
                    disabled={!stripe || !elements || isLoading}
                >
                    {isLoading ?
                        "Purchasing" :
                        `Purchase - ${formatCurrency(priceInCents / 100)}`}
                </Button>
            </CardFooter>
        </Card>
    </form>);
}