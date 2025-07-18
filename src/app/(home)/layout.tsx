import { ReactNode } from "react";
import Footer from "./_components/Footer";
import Navbar from "./_components/Navbar";

const HomeLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default HomeLayout;
