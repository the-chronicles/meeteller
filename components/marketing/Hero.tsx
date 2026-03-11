"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";

export default function Home() {
  return (
    <section className="relative w-full overflow-hidden bg-black px-4 pt-32 pb-40 text-center md:pt-40 md:pb-52 min-h-175 md:min-h-212.5">
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ShaderGradientCanvas
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
          }}
        >
          <ShaderGradient
            animate="on"
            axesHelper="off"
            bgColor1="#000000"
            bgColor2="#000000"
            brightness={0.4}
            cAzimuthAngle={170}
            cDistance={4.4}
            cPolarAngle={70}
            cameraZoom={1}
            color1="#282828"
            color2="#5b09c4"
            color3="#000000"
            destination="onCanvas"
            embedMode="off"
            envPreset="lobby"
            format="gif"
            fov={30}
            frameRate={10}
            gizmoHelper="hide"
            grain="off"
            lightType="3d"
            pixelDensity={1}
            positionX={0}
            positionY={0.9}
            positionZ={-0.3}
            range="disabled"
            rangeEnd={0}
            rangeStart={0}
            reflection={0.1}
            rotationX={45}
            rotationY={0}
            rotationZ={0}
            shader="defaults"
            type="waterPlane"
            uAmplitude={0.1}
            uDensity={0.6}
            uFrequency={0}
            uSpeed={0.1}
            uStrength={3.4}
            uTime={0}
            wireframe={false}
            zoomOut={false}
          />
        </ShaderGradientCanvas>

        {/* optional dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* MAIN CONTENT */}
      <motion.div
        className="relative z-10 mx-auto mt-10 flex max-w-3xl flex-col items-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <h1 className="font-helvetica mb-10 text-3xl font-bold text-white md:text-8xl">
            Clarity <span className="text-[#8c8b8b]">in Chaos</span>
          </h1>
        </motion.div>

        <motion.p
          className="max-w-2xl text-xl font-light text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          Turn minutes of talking into actionable insights. Get crystal-clear
          summaries, highlighted action points, and prioritized tasks.
        </motion.p>

        <motion.div
          className="mt-8 flex justify-center gap-4"
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
          >
            <Button
              asChild
              size="lg"
              className="bg-[#5b09c4] text-white hover:bg-[#5b09c4]/80"
            >
              <Link href="/signup">Get Into Clarity →</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* FLOATING CARD */}
      <motion.div
        className="absolute bottom-0 left-1/2 z-20 flex w-full -translate-x-1/2 translate-y-1/3 justify-center md:translate-y-1/2"
        animate={{ y: [0, -15, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-full max-w-350 px-4">
          <Image
            src="/Test.png"
            alt="preview"
            width={2000}
            height={1200}
            className="w-full rounded-2xl shadow-2xl"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, white 75%, transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, white 75%, transparent 100%)",
            }}
          />
        </div>
      </motion.div>
    </section>
  );
}