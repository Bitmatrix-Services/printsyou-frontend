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
      lineHeight: {
        'extra-loose': '1.3'
      },
      screens: {
        tablet: {raw: '(min-width: 760px) and (max-width: 860px)'}
      },
      colors: {
        primary: {
          DEFAULT: 'rgba(219,4,129,0.5)',
          50: 'rgba(219,4,129,0.1)',
          100: 'rgba(219,4,129,0.15)',
          200: 'rgba(219,4,129,0.25)',
          300: 'rgba(219,4,129,0.35)',
          400: 'rgba(219,4,129,0.46)',
          500: '#DB0481',
          600: 'rgba(219,4,129,0.65)',
          700: '#DB0481',
          800: '#b9016c',
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
        contactButtonColor: '#219EBC',
        headingColor: '#333',
        subHeading: '#373636',
        mute: '#74768F',
        mute2: '#5F6C72',
        mute3: '#686d79',
        mute4: '#9A9C9D',
        mute5: '#F2F4F5',
        lightGray: '#EEF1F7',
        grey: '#FAFAFA',
        light: '#d0d5df'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        wave: 'url(/assets/bg-wave.png)',
        'black-top': 'url(/assets/bg-line-top-banner.jpg) left top repeat-x #303541'
      },
      boxShadow: {
        category: '0px 4px 4px 0px #00000040',
        pricingTableShadow: '0px 1px 2px 0px rgba(142, 150, 185, 0.25)'
      }
    }
  },
  plugins: []
};
export default config;
