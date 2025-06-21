import { Inter } from "next/font/google";
import "./globals.css";
import Provider from "./Provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "BesharamList | You have been BesharamListed",
  description: "You have been BesharamListed!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Provider>
            <Toaster />
            {children}
          </Provider>
        </AuthProvider>
      </body>
    </html>
  );
}