import type { Metadata } from "next";
import "./globals.css";
import { Starter, Card, Text } from "./ui";

export const metadata: Metadata = {
  title: "Next.js on Wasmer Edge",
  description: "A Next.js static export starter for Wasmer Edge",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <head><script type="module" src="/starter-ui.js" /></head>
      <body>
        <Starter><Card>
          {children}
          <Text slot="footer">Next.js starter for Wasmer Edge</Text>
        </Card></Starter>
      </body>
    </html>
  );
}
