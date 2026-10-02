"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/src/components/ui/button";
import { formatCurrency } from "@/src/lib/formatters";
import { useActionState, useState } from "react";
import { addProduct, updateProduct } from "../_actions/products";
import { useFormStatus } from "react-dom";
import { Product } from "@/src/generated/prisma/client";

export default function ProductForm({ product }: { product?: Product | null }) {
    const [priceInCents, setPriceInCents] = useState<number>(product?.priceInCents ?? 0);
    const [error, action] = useActionState(product ? updateProduct.bind(null, product.id) : addProduct, {});

    return <form className="space-y-8" action={action}>
        <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input type="text" id="name" name="name" defaultValue={product?.name || ""} required />
            {error.name && <div className="red-destructive">{error.name}</div>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="priceInCents">Price In Cents</Label>
            <Input 
                type="numbers" 
                id="priceInCents"
                name="priceInCents"
                required 
                value={priceInCents} 
                onChange={e => setPriceInCents(Number(e.target.value))}
            />
            <div className="text-muted-forward">{formatCurrency((priceInCents || 0) / 100)}</div>
            {error.priceInCents && <div className="red-destructive">{error.priceInCents}</div>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={product?.description || ""} required />
            {error.description && <div className="red-destructive">{error.description}</div>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input type="file" id="file" name="file" required />
            {error.file && <div className="red-destructive">{error.file}</div>}
            {product && <div className="text-muted-foreground">{product.filePath}</div>}
        </div>
        <div className="space-y-2">
            <Label htmlFor="image">Image</Label>
            <Input type="file" id="image" name="image" required />
            {product && <img src={product.imagePath} alt="Product Image" height="300" width="300" />}
            {error.image && <div className="red-destructive">{error.image}</div>}
        </div>
        <SubmitButton />
    </form>
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={ pending }>{ pending ? "Saving..." : "Save" }</Button>;
}