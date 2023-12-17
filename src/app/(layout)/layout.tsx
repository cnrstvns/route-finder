import Link from 'next/link';
import { Navbar } from '@/components/navigation/navbar';

type LayoutProps = {
	children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
	return (
		<body className="overscroll-none">
			<main>
				<div className="grid min-h-screen w-full lg:grid-cols-[250px_1fr]">
					<div className="hidden border-r bg-gray-50 lg:block">
						<div className="flex fixed w-[250px] h-screen flex-col gap-2">
							<div className="flex h-[60px] items-center border-b px-6">
								<Link
									className="flex items-center gap-2 font-semibold"
									href="#"
								>
									<span>RouteFinder</span>
								</Link>
							</div>
							<Navbar />
						</div>
					</div>
					<div className="flex flex-col">
						<div className="flex flex-1 flex-col gap-4 md:gap-8">
							{children}
						</div>
					</div>
				</div>
			</main>
		</body>
	);
}
