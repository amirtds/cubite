import { Inter } from "next/font/google";
import AuthProvider from "@/app/(dashboard)/auth/Provider";
import "../globals.css";
import Navbar from "../components/Navbar";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" data-theme="forest">
      <body className="max-w-screen-2xl items-center mx-auto">
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
