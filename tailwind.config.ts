import type {Config} from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        oswald: 'Oswald, sans-serif',
        poppins: 'Poppins, sans-serif'
      },
      colors: {
        primary: {
          DEFAULT: '#FEBE40',
          50: '#FFFCF7',
          100: '#FFF5E2',
          200: '#FFE7BA',
          300: '#FEDA91',
          400: '#FECC69',
          500: '#FEBE40',
          600: '#FEAB08',
          700: '#CD8801',
          800: '#956301',
          900: '#5D3E00',
          950: '#412B00'
        },
        secondary: '#323a4d',
        mute: '#818794',
        mute2: '#787b82',
        mute3: '#686d79',
        greyLight: '#FFFFFF',
        grey: '#F8F6F7',
        light: '#d0d5df',
        body: '#303541'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        wave: 'url(/assets/bg-wave.png)',
        'black-top':
          'url(/assets/bg-line-top-banner.jpg) left top repeat-x #303541'
      }
    }
  },
  plugins: []
};
export default config;
