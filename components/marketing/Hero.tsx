"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
// import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

// const ShaderGradientComponent = ShaderGradient as any;

const platforms = [
  { name: "Google Meet", logo: "/integrations/google-meet-seeklogo.svg" },
  { name: "Zoom", logo: "/integrations/zoom-seeklogo-2.svg" },
  // { name: "Slack", logo: "/integrations/slacked.png" },
  { name: "Microsoft Teams", logo: "/integrations/microsoft-teams-logo-2.png" },
];

export default function Home() {
  return (
    <section className="relative min-h-175 w-full overflow-hidden bg-black px-4 pt-32 pb-40 text-center md:min-h-180 md:pt-40 md:pb-52">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {/* <ShaderGradientCanvas
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
        >
          <ShaderGradientComponent
            animate="on"
            axesHelper="off"
            brightness={0.3}
            cAzimuthAngle={170}
            cDistance={3.9}
            cPolarAngle={70}
            cameraZoom={1}
            color1="#282828"
            color2="#5b09c4"
            color3="#00000"
            destination="onCanvas"
            embedMode="off"
            envPreset="city"
            format="gif"
            fov={45}
            frameRate={10}
            gizmoHelper="hide"
            grain="off"
            lightType="3d"
            pixelDensity={0.1}
            positionX={0}
            positionY={0.9}
            positionZ={-0.3}
            range="disabled"
            rangeEnd={40}
            rangeStart={0}
            reflection={0.1}
            rotationX={45}
            rotationY={0}
            rotationZ={0}
            shader="defaults"
            type="waterPlane"
            uAmplitude={0}
            uDensity={1}
            uFrequency={0}
            uSpeed={0.1}
            uStrength={1.9}
            uTime={0}
            wireframe={false}
          />
        </ShaderGradientCanvas> */}

        {/* optional dark overlay for readability */}
        {/* <div className="absolute inset-0 bg-black/30" /> */}
        <div className="absolute inset-0 bg-white" />
      </div>

      {/* MAIN CONTENT */}
      <motion.div
        className="relative z-10 mx-auto mt-15 flex max-w-7xl flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="font-dm-sans mb-3 text-3xl font-bold text-black md:text-[150px]">
            Clarity First
          </h1>
        </motion.div>

        <motion.p
          className="max-w-2xl text-[18px] font-light text-[#8c8b8b]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          Your Meeting Assistant that captures every conversation, organizes
          what matters, and delivers exactly what you need—when you need it.
        </motion.p>

        <motion.h1
          className="mt-20 max-w-2xl text-[18px] font-light text-[#8c8b8b]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          Works with
          <div className="flex">
            <div className="flex min-w-max items-center gap-6 py-4">
              {platforms.map((platform, index) => {
                return (
                  <div
                    key={`${platform.name}-${index}`}
                    className="flex min-w-45 items-center justify-center gap-3 transition-transform duration-300 hover:scale-105"
                  >
                    <Image
                      src={platform.logo}
                      alt={platform.name}
                      width={64}
                      height={64}
                      className="h-auto w-40 object-contain"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </motion.h1>

        <motion.div
          className="mt-20 flex justify-center gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.2 },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            className="flex flex-col gap-4 md:flex-row md:gap-4"
          >
            <Button
              asChild
              size="lg"
              className="bg-[#5b09c4] text-white hover:bg-[#5b09c4]/80"
            >
              <Link href="/signup">Try Meeteller →</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="border border-[#5b09c4] bg-white text-[#5b09c4] hover:bg-[#5b09c4] hover:text-white"
            >
              <Link href="/signup">Download Extension →</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
