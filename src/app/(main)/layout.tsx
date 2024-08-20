import './style.scss';

import { ReactNode } from 'react';
import Header from './_components/Header';
import Footer from './_components/Footer';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className='main-layout'>
      <Header />
      <div className='layout-body'>
        {children}
      </div>
      <Footer />
    </div>
  )
}