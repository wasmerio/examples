import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Next.js on Wasmer Edge",
  description: "A Next.js static export starter for Wasmer Edge",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        <main>
          {children}
          <footer>Next.js starter for Wasmer Edge</footer>
        </main>
      </body>
    </html>
  );
}
