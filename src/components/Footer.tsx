import Link from "next/link";
import { MdEmail, MdLocalPhone } from "react-icons/md";
import Container from "./Container";

const Footer = () => {
  return (
    <footer className="gradient mt-14">
      <Container className="flex flex-wrap justify-between p-4 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl mb-2 text-white font-bold">About Us</h1>
          <span className="text-sm text-slate-200">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore quo
            commodi id et reiciendis minima molestiae recusandae nostrum,
            blanditiis nesciunt?
          </span>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl mb-2 text-white font-bold">
            Important links
          </h1>
          <div className="flex gap-1 flex-col text-slate-200">
            <Link href={"#"} className="text-sm hover:underline">
              Website 1
            </Link>
            <Link href={"#"} className="text-sm hover:underline">
              Website 2
            </Link>
            <Link href={"#"} className="text-sm hover:underline">
              Website 3
            </Link>
            <Link href={"#"} className="text-sm hover:underline">
              Website 4
            </Link>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="text-2xl mb-2 text-white font-bold">Contact Info</h1>
          <div className="text-zinc-200">
            <h2 className="text-lg">Address</h2>
            <span>address here</span>
          </div>
          <div className="flex gap-1 flex-col text-slate-200">
            <span className="flex gap-2 items-center">
              <MdEmail />
              example@email.com
            </span>
            <span className="flex gap-2 items-center">
              <MdLocalPhone /> +880170000000
            </span>
          </div>
        </div>
      </Container>
      <div className="w-full bg-primary-950 py-1">
        <Container>
          <span className="text-white text-sm">
            © Copyright 2024 , All Rights Reserved
          </span>
        </Container>
      </div>
    </footer>
  );
};

export default Footer;
