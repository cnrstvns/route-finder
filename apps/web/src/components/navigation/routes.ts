import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBookmark } from '@fortawesome/pro-solid-svg-icons/faBookmark';
import { faHomeAlt } from '@fortawesome/pro-solid-svg-icons/faHomeAlt';
import { faMessage } from '@fortawesome/pro-solid-svg-icons/faMessage';
import { faPlane } from '@fortawesome/pro-solid-svg-icons/faPlane';
import { faSeatAirline } from '@fortawesome/pro-solid-svg-icons/faSeatAirline';
import { faTowerControl } from '@fortawesome/pro-solid-svg-icons/faTowerControl';

export type Route = {
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
