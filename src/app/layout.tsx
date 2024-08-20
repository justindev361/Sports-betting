import "./app.scss";
import "./globals.css";

import "react-toastify/dist/ReactToastify.css";
import "react-loading-skeleton/dist/skeleton.css";

import "@fortawesome/fontawesome-svg-core/styles.css";

import Web3ModalProvider from "@/wallet-connect/Web3ModalProvider";

import type { Metadata } from "next";
import { appTitle, getNode } from "@/lib/constants/ui";
import { config } from "@fortawesome/fontawesome-svg-core";
import { AppContextProvider } from "@/lib/providers/AppContextProvider";
import { poppins } from "@/lib/utils/fonts";
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

config.autoAddCss = false;

export const metadata: Metadata = {
  title: appTitle,
  description: "Sport Betting Platform",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const node = getNode();
  return (
    <html lang="en" data-theme="dark">
      <body className={poppins.className}>
        <Web3ModalProvider>
          <AppContextProvider>
            {children}
            <ToastContainer theme="dark" autoClose={2000} hideProgressBar />
          </AppContextProvider>
        </Web3ModalProvider>
      </body>
    </html>
  );
}
