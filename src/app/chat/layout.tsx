import type { Metadata } from "next";
import { Kode_Mono } from "next/font/google";

const inter = Kode_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Chats | Novu Chat",
  description: "Stay connected with your friends and family",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
