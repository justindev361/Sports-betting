import './style.scss';

import { pages } from "@/lib/constants/ui";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: pages.mybets.title,
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}