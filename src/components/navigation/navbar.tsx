import { faHomeAlt } from '@fortawesome/pro-solid-svg-icons/faHomeAlt';
import { faPlane } from '@fortawesome/pro-solid-svg-icons/faPlane';
import { faSeatAirline } from '@fortawesome/pro-solid-svg-icons/faSeatAirline';
import { faTowerControl } from '@fortawesome/pro-solid-svg-icons/faTowerControl';
import { NavLink } from './nav-link';

export const routes = [
	{
		title: 'Home',
		href: '/home',
		icon: faHomeAlt,
	},
	{
		title: 'Aircraft',
		href: '/aircraft',
		icon: faPlane,
	},
	{
		title: 'Airlines',
		href: '/airlines',
		icon: faSeatAirline,
	},
	{
		title: 'Airports',
		href: '/airports',
		icon: faTowerControl,
	},
] as const;

const Navbar = () => {
	return (
		<div className="flex-1 overflow-auto py-2">
			<nav className="grid items-start px-4 text-sm font-medium">
				{routes.map((r) => (
					<NavLink key={r.href} href={r.href} title={r.title} icon={r.icon} />
				))}
			</nav>
		</div>
	);
};

export { Navbar };
