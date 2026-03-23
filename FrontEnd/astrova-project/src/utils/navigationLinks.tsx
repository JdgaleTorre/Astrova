export const NAVIGATION_LINKS = [
  { path: '/', label: 'Home' },
  { path: '/apod', label: 'APOD' },
  { path: '/neo', label: 'Asteroids' },
  { path: '/epic', label: 'EPIC' },
  { path: '/library', label: 'Nasa Library' },
  { path: '/saved', label: 'Saved' },
];

import { Calendar, Orbit, Globe, BookImage } from 'lucide-react';

export const FEATURED_LINKS = [
  {
    path: '/apod',
    label: 'APOD',
    description: "Discover the cosmos through NASA's daily featured images",
    icon: <Calendar className="text-cyan h-6 w-6" />,
    color: 'cyan',
  },
  {
    path: '/neo',
    label: 'Asteroids',
    description: 'Track asteroids approaching Earth',
    icon: <Orbit className="h-6 w-6 text-orange-400" />,
    color: 'amber',
  },
  {
    path: '/epic',
    label: 'EPIC',
    description: 'Full-disc Earth imagery from the DSCOVR spacecraft',
    icon: <Globe className="text-mars-red h-6 w-6" />,
    color: 'mars-red',
  },
  {
    path: '/library',
    label: 'NASA Library',
    description: 'Discover our intergalactic multimedia collections',
    icon: <BookImage className="text-cyan h-6 w-6" />,
    color: 'cyan',
  },
  // {
  //   path: '/saved',
  //   label: 'Saved Items',
  //   description: 'Your bookmarked NASA images and videos',
  //   icon: <Bookmark className="text-cyan h-6 w-6" />,
  //   color: 'cyan',
  // },
];
