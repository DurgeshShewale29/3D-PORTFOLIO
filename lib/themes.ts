export const THEME_CHANGE_EVENT = 'themechange';

export interface ThemeInfo {
  name: string;
  theme: string;
  icon: string;
  publisher: string;
}

export const THEMES: ThemeInfo[] = [
  {
    name: 'Durgesh Dark 🌸',
    theme: 'durgesh-dark',
    icon: '/themes/github-dark.png',
    publisher: 'Durgesh Shewale',
  },
  {
    name: 'Kyoto Sakura 🌸',
    theme: 'kyoto-sakura',
    icon: '/themes/dracula.png',
    publisher: 'Yash Sonavane',
  },
  {
    name: 'Tokyo Night',
    theme: 'tokyo-night',
    icon: '/themes/night-owl.png',
    publisher: 'enkia',
  },
  {
    name: 'GitHub Dark',
    theme: 'github-dark',
    icon: '/themes/github-dark.png',
    publisher: 'GitHub',
  },
  {
    name: 'Dracula',
    theme: 'dracula',
    icon: '/themes/dracula.png',
    publisher: 'Dracula Theme',
  },
  {
    name: 'Nord',
    theme: 'nord',
    icon: '/themes/nord.png',
    publisher: 'arcticicestudio',
  },
];

export const THEME_KEYS = THEMES.map(t => t.theme) as [string, ...string[]];
