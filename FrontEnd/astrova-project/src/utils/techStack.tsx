import {
  Monitor,
  Server,
  Rocket,
  Box,
  Cpu,
  Database,
  Globe,
  Router,
} from 'lucide-react';
import { FaReact, FaCss3Alt } from 'react-icons/fa';
import { SiTypescript, SiVite, SiExpress, SiAxios } from 'react-icons/si';

export const TECH_STACK = [
  {
    category: 'Frontend',
    icon: <Monitor className="h-8 w-8" />,
    items: [
      {
        name: 'React',
        url: 'https://react.dev/',
        description: 'UI framework',
        Icon: FaReact,
      },
      {
        name: 'TypeScript',
        url: 'https://www.typescriptlang.org/',
        description: 'Type safety',
        Icon: SiTypescript,
      },
      {
        name: 'Vite',
        url: 'https://vite.dev/',
        description: 'Build tool',
        Icon: SiVite,
      },
      {
        name: 'Tailwind CSS',
        url: 'https://tailwindcss.com/',
        description: 'Styling',
        Icon: FaCss3Alt,
      },
      {
        name: 'TanStack Router',
        url: 'https://tanstack.com/router',
        description: 'Routing',
        Icon: Router,
      },
      {
        name: 'TanStack Query',
        url: 'https://tanstack.com/query',
        description: 'Data fetching',
        Icon: Router,
      },
      {
        name: 'Lucide React',
        url: 'https://lucide.dev/',
        description: 'Icons',
        Icon: Box,
      },
    ],
  },
  {
    category: 'Backend',
    icon: <Server className="h-8 w-8" />,
    items: [
      {
        name: 'Express.js',
        url: 'https://expressjs.com/',
        description: 'Web framework',
        Icon: SiExpress,
      },
      {
        name: 'TypeScript',
        url: 'https://www.typescriptlang.org/',
        description: 'Type safety',
        Icon: SiTypescript,
      },
      {
        name: 'Axios',
        url: 'https://axios-http.com/',
        description: 'HTTP client',
        Icon: SiAxios,
      },
      {
        name: 'Cors',
        url: 'https://github.com/expressjs/cors',
        description: 'Cross-origin resource sharing',
        Icon: Globe,
      },
    ],
  },
  {
    category: 'NASA APIs',
    icon: <Rocket className="h-8 w-8" />,
    items: [
      {
        name: 'APOD API',
        url: 'https://api.nasa.gov/',
        description: 'Daily astronomy picture',
        Icon: Cpu,
      },
      {
        name: 'NeoWs API',
        url: 'https://api.nasa.gov/',
        description: 'Near-Earth objects',
        Icon: Database,
      },
      {
        name: 'EPIC API',
        url: 'https://epic.gsfc.nasa.gov/',
        description: 'Earth imagery',
        Icon: Globe,
      },
      {
        name: 'Images API',
        url: 'https://images.nasa.gov/',
        description: 'Media library',
        Icon: Box,
      },
    ],
  },
];
