"use client"
import Sidebar from "@/components/Sidebar/page";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/logo.png";
import Image from 'next/image'
import { Summary } from "@/components/Summary/page";

export default function Dashboard() {
    return (  
        <div className="flex">
            <Sidebar />
            <div className="min-h-screen flex-1 ml-[240px]">
                <div className="flex flex-col justify-center items-center">
                    <Image src={logo} alt="Logo" width={108.5} height={30} />
                    <ThemeToggle />
                    <Summary />
                </div>
            </div>
        </div>
    );
}
