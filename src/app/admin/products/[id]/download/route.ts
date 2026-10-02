import db from "@/src/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const product = await db.product.findUnique({
        where: { id },
        select: {
            name: true,
            filePath: true
        }
    });

    if (!product) {
        return notFound();
    }

    const { size } = await fs.stat(product.filePath);
    const file = await fs.readFile(product.filePath);
    const extention = product.filePath.split(".").pop();

    return new NextResponse(file, {
        headers: {
            "Content-Disposition": `attachment; filename="${product.name}.${extention}"`,
            "Content-Length": size.toString()
        }
    });
}