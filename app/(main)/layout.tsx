import Navbar from "@/components/ui/Navbar";
import { ShopCartProvider } from "@/context/ShopCartContext";
import ShopCartDrawer from "@/components/shop/ShopCartDrawer";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ShopCartProvider>
            <Navbar />
            <ShopCartDrawer />
            {children}
        </ShopCartProvider>
    );
}
