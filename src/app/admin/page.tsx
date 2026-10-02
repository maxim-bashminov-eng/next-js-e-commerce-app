import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import db from "@/src/db/db";
import { formatCurrency, formatNumber } from "@/src/lib/formatters";
import { ReactNode } from "react";

async function getSalesData() {
    const data = await db.order.aggregate({
        _sum: { pricePaidInCents: true },
        _count: true
    });

    return {
        total: (data._sum.pricePaidInCents || 0) / 100,
        numberOfSales: data._count
    };
}

async function getCustomerData() {
    const [total, numOfUsers] = await Promise.all([
        db.order.aggregate({
            _sum: { pricePaidInCents: true }
        }),
        db.user.count()
    ]);

    return {
        avgSalesPerUser: numOfUsers === 0 ? 0 : ((total._sum.pricePaidInCents || 0)  / numOfUsers / 100),
        numOfUsers
    };
}

async function getProductData() {
    return await Promise.all([
        db.product.count({ where: { isAvailableForPurchase: true } }),
        db.product.count({ where: { isAvailableForPurchase: true } })
    ]);
}

export default async function AdminDashboard() {
    const [salesData, customerData, productData] = await Promise.all([getSalesData(), getCustomerData(), getProductData()]);
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DashboardCard 
                title="Sales" 
                description={`${formatNumber(salesData.numberOfSales)} Orders`} 
                content={formatCurrency(salesData.total)} 
            />
            <DashboardCard 
                title="Customers" 
                description={formatNumber(customerData.numOfUsers)} 
                content={`${formatCurrency(customerData.avgSalesPerUser)} Average Value}`} 
            />
            
            <DashboardCard 
                title="Active Products" 
                description={`${formatNumber(productData[0])} Inactive`} 
                content={`${formatNumber(productData[1])} Active`} 
            />
            </div>
        );
}

type DashboardCardProps = {
    title: string;
    description: string | number;
    content: ReactNode | string;
};

function DashboardCard({title, description, content}: DashboardCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{ title }</CardTitle>
                <CardDescription>{ description }</CardDescription>
            </CardHeader>
            <CardContent>
                { content }
            </CardContent>
        </Card>
    );
}