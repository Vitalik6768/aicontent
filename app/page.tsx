"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import { TypeAnimation } from "react-type-animation";

export default function Home() {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className="flex items-center gap-24 h-full flex-col md:flex-row relative bg-gray-900 text-white min-h-screen">
      <Image src="/orbital.png" alt="" className="absolute bottom-0 left-0 opacity-5 animate-rotateOrbital -z-10" width={500} height={500} />

      <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-[128px] bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent md:text-[64px]">AI HUB</h1>
        <h2 className="text-2xl font-semibold">Become The Next Level Prompt Engineer</h2>
        {/* <h3 className="font-light max-w-[70%] md:max-w-full">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Placeat sint
          dolorem doloribus, architecto dolor.
        </h3> */}
        <Link href="/dashboard" className="px-6 py-3 mt-5 bg-blue-600 text-white rounded-xl text-sm hover:bg-white hover:text-blue-600 transition">
          Get Started
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center h-full">
        <div className="flex items-center justify-center bg-[#140e2d] rounded-[50px] w-[80%] h-[50%] relative">
          <div className="absolute inset-0 overflow-hidden rounded-[50px]">
            <div className="bg-[url('/bg.png')] opacity-20 w-[200%] h-full bg-auto bg-no-repeat animate-slideBg"></div>
          </div>

          <Image src="/bot.png" alt="AI bot illustration" className="w-full h-full object-contain animate-botAnimate" width={500} height={500} />

          <div className="absolute -bottom-8 -right-12 flex items-center gap-2.5 p-5 bg-[#2c2937] rounded-md hidden md:flex">
            <Image src={typingStatus === "human1" ? "/human1.jpeg" : typingStatus === "human2" ? "/human2.jpeg" : "/bot.png"} alt="" width={32} height={32} className="rounded-full object-cover" />

            <TypeAnimation
              sequence={[
                "Human:i am making 1000000000k in 1 week since i am become prompt Engineer",
                2000,
                () => setTypingStatus("bot"),
                "Bot:to much work :(",
                2000,
                () => setTypingStatus("human2"),
                "Human2:life is to easy :)",
                2000,
                () => setTypingStatus("bot"),
                "Bot:stop please!!",
                2000,
                () => setTypingStatus("human1"),
              ]}
              wrapper="span"
              repeat={Infinity}
              cursor={true}
              omitDeletionAnimation={true}
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-5">
        <Image src="/logo.png" alt="Logo" width={16} height={16} />
        <div className="flex gap-2.5 text-gray-500 text-xs">
          <Link href="/">Terms of Service</Link>
          <span>|</span>
          <Link href="/">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}