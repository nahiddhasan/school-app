import Footer from "@/components/Footer";
import Navbar from "@/components/navbar/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-white text-black">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
