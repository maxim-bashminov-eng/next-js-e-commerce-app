import { Nav, NavLink } from "@/src/components/Nav";
import { ReactNode } from "react";

export default function CustomerAdminLayout({
    children
}: Readonly<{ children: ReactNode }>) {
    return (
        <>
            <Nav>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/products">Products</NavLink>
                <NavLink href="/orders">My Orders</NavLink>
            </Nav>
            <div className="container my-6">{ children }</div>
        </>
    );
}