"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import donationsImg from "@/assets/Donations.png";
import charityImg from "@/assets/Charity.png";
import { Button } from "@/components/button";
import Link from "next/link";
import { useState, useRef } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

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
