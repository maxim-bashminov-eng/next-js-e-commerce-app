import db from "@/src/db/db";
import { PageHeader } from "../../../_components/PageHeader";
import ProductForm from "../../../_components/ProductForm";

export default async function EditProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params
    const product = await db.product.findUnique({
        where: { id: id }
    });

    return (
        <>
            <PageHeader>Edit Product</PageHeader>
            <ProductForm product={product} />
        </>
    );
}