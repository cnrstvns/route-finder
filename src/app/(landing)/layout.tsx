import { Inter } from 'next/font/google';
import { ReactNode } from 'react';

const inter = Inter({ weight: 'variable', subsets: ['latin'] });

export default function Layout({ children }: { children: ReactNode }) {
  return <div className={inter.className}>{children}</div>;
}
