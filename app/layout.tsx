import "@/app/globals.css";
import { EventsProvider } from "@/context/EventProvider";
import { ThemeProvider } from "@/context/ThemeProvider";
import localFont from "next/font/local";


const helvetica = localFont({
  src: [
    {
      path: "../public/fonts/Helvetica.ttf",
      weight: "400",
      style: "regular",
    },
    {
      path: "../public/fonts/helvetica-light-587ebe5a59211.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Helvetica-Bold.ttf",
      weight: "500",
      style: "bold",
    },
  ],
  variable: "--font-helvetica",
  display: "swap",
});

const sora = localFont({
  src: [
    {
      path: "../public/fonts/Sora-Light.ttf",
      weight: "300",
      style: "regular",
    },
    {
      path: "../public/fonts/Sora-Regular.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Sora-Medium.ttf",
      weight: "500",
      style: "bold",
    },
    {
      path: "../public/fonts/Sora-Bold.ttf",
      weight: "700",
      style: "bold",
    },
  ],
  variable: "--font-sora",
  display: "swap",
});



export const metadata = {
  title: "Meeteller — AI Meeting Assistant",
  description: "Transcribe, summarize, and automate your meetings.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${helvetica.variable} ${sora.variable} font-sans`}>
      <body className="bg-white text-gray-900">
        <ThemeProvider>
          <EventsProvider>{children}</EventsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
