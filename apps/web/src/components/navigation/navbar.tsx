import { isAdmin } from '@/lib/is-admin';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBookmark } from '@fortawesome/pro-solid-svg-icons/faBookmark';
import { faHomeAlt } from '@fortawesome/pro-solid-svg-icons/faHomeAlt';
import { faMessage } from '@fortawesome/pro-solid-svg-icons/faMessage';
import { faPlane } from '@fortawesome/pro-solid-svg-icons/faPlane';
import { faSeatAirline } from '@fortawesome/pro-solid-svg-icons/faSeatAirline';
import { faTowerControl } from '@fortawesome/pro-solid-svg-icons/faTowerControl';
import { Feedback } from './feedback';
import { NavLink } from './nav-link';

type Route = {
  title: string;
  href: string;
  icon: IconProp;
};

export const routes: Route[] = [
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
  {
    title: 'Saved Routes',
    href: '/saved-routes',
    icon: faBookmark,
  },
] as const;

export const adminRoutes = [
  {
    title: 'Feedback',
    href: '/admin/feedback',
    icon: faMessage,
  },
  {
    title: 'Airlines',
    href: '/admin/airlines',
    icon: faSeatAirline,
  },
] as const;

const Navbar = async () => {
  const admin = await isAdmin();

  return (
    <div className="flex-1 overflow-auto py-2">
      <nav className="px-4 text-sm font-medium flex flex-col justify-between h-full">
        {routes.map((r) => (
          <NavLink key={r.href} href={r.href} title={r.title} icon={r.icon} />
        ))}
        {admin && (
          <div>
            <div className="text-sm font-medium my-1 text-neutral-500 dark:text-zinc-500">
              Admin
            </div>
            {adminRoutes.map((r) => (
              <NavLink
                key={r.href}
                href={r.href}
                title={r.title}
                icon={r.icon}
              />
            ))}
          </div>
        )}

        <div className="justify-end flex flex-col flex-1">
          <Feedback />
        </div>
      </nav>
    </div>
  );
};

export { Navbar };
