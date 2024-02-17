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
          DEFAULT: '#FFCE05',
          50: '#FFF2BD',
          100: '#FFEEA8',
          200: '#FFE67F',
          300: '#FFDE57',
          400: '#FFD62E',
          500: '#FFCE05',
          600: '#CCA400',
          700: '#947700',
          800: '#5C4A00',
          900: '#241D00',
          950: '#080600'
        },
        secondary: {
          DEFAULT: '#0095DA',
          50: '#93DDFF',
          100: '#7ED6FF',
          200: '#55C9FF',
          300: '#2DBCFF',
          400: '#04AFFF',
          500: '#0095DA',
          600: '#006FA2',
          700: '#00486A',
          800: '#002232',
          900: '#000000',
          950: '#000000'
        },
        headingColor: '#333',
        mute: '#787878',
        mute2: '#787b82',
        mute3: '#686d79',
        greyLight: '#FFFFFF',
        grey: '#FAFAFA',
        light: '#d0d5df',
        body: '#2A344D'
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
