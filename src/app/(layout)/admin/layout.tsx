import { isAdmin } from '@/lib/is-admin';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const admin = isAdmin();
  if (!admin) redirect('/home');

  return children;
}
