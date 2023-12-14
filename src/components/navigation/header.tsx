import { ReactNode } from 'react';

type HeaderProps = {
	children: ReactNode;
};

const Header = ({ children }: HeaderProps) => {
	return (
		<div className="w-full fixed top-0 z-50 flex items-center px-4 bg-gray-50 h-[60px] border-b">
			{children}
		</div>
	);
};

export { Header };
