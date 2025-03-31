import { ThemeToggle } from "../components/ThemeToggle";
import logo from "../assets/logo.png";
import Image from 'next/image'
import Footer from "@/components/Footer/page";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="flex flex-col justify-center items-center">
      <Image src={logo} alt="Logo" width={108.5} height={30} />
      <ThemeToggle />
      <Footer />
      </div>
    </div>
  );
}
