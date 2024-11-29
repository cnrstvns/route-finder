import { isAdmin } from '@/lib/is-admin';
import { Feedback } from './feedback';
import { NavLink } from './nav-link';
import { routes, adminRoutes } from './routes';

export const Navbar = async () => {
  const admin = await isAdmin();

  return (
    <div className="flex-1 overflow-auto py-2">
      <nav className="px-4 text-sm font-medium flex flex-col justify-between h-full space-y-0.5">
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