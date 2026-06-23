import type { Metadata } from "next";
import {
  UnifrakturMaguntia,
  Playfair_Display,
  IM_Fell_English,
} from "next/font/google";
import "./globals.css";

const unifraktur = UnifrakturMaguntia({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-unifraktur",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const fell = IM_Fell_English({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-fell",
});

export const metadata: Metadata = {
  title: "Follow Property — NCR Realty Report",
  description:
    "The independent voice of NCR real estate — Delhi, Gurgaon and Noida property news, rates and analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${unifraktur.variable} ${playfair.variable} ${fell.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
