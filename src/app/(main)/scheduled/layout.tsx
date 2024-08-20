import ScrollTop from '@/components/ScrollTop';
import './style.scss';

import { pages } from "@/lib/constants/ui";
import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: pages.scheduled.title
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ScrollTop />
    </>
  );
}