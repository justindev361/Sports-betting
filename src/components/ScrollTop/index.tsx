'use client'

import { useEffect, useState } from 'react';
import './style.scss';

import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';

export default function ScrollTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const scrollListener = () => setVisible(window.scrollY > 200);
    window.addEventListener('scroll', scrollListener);
    return () => removeEventListener('scroll', scrollListener);
  }, []);

  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  return (
    <button className='scroll-top' data-visible={visible} onClick={scrollTop}>
      <ArrowUpwardRoundedIcon />
    </button>
  )
}