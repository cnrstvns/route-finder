import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { isAdmin } from '@/lib/is-admin';

type LayoutProps = {
	children: ReactNode;
};

export default async function Layout({ children }: LayoutProps) {
	const admin = isAdmin();
	if (!admin) redirect('/home');

	return children;
}
