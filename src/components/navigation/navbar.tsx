import { NavLink } from './nav-link';
import { faPlane } from '@fortawesome/pro-solid-svg-icons/faPlane';
import { faHomeAlt } from '@fortawesome/pro-solid-svg-icons/faHomeAlt';
import { faSeatAirline } from '@fortawesome/pro-solid-svg-icons/faSeatAirline';

const Navbar = () => {
  return (
    <div className="flex-1 overflow-auto py-2">
      <nav className="grid items-start px-4 text-sm font-medium">
        <NavLink href="/" title="Home" icon={faHomeAlt} />
        <NavLink href="/aircraft" title="Aircraft" icon={faPlane} />
        <NavLink href="/airlines" title="Airlines" icon={faSeatAirline} />
      </nav>
    </div>
  );
};

export { Navbar };
