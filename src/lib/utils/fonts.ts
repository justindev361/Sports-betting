import { Poppins, Archivo, Archivo_Black, Bebas_Neue } from 'next/font/google';


export const poppins = Poppins({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'block',
  subsets: ['latin'],
});

export const archivo = Archivo({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'block',
  subsets: ['latin']
});

export const archivoBlack = Archivo_Black({
  weight: '400',
  display: 'block',
  subsets: ['latin'],
});

export const bebasNeue = Bebas_Neue({
  weight: '400',
  display: 'block',
  subsets: ['latin'],
});
