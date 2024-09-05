import {AdditionalFieldProductValues} from '@components/home/product/product.types';
import {Sortable} from '../store/slices/notification/notification.slice';

export const metaConstants = {
  SITE_NAME: 'Prints You',
  DESCRIPTION:
    'Discover top-quality custom printed promotional products at PrintsYou.com. Choose from thousands of items to showcase your logo or message. Perfect for trade shows, conventions, office swag, or home use. Elevate your brand with unique promotional merchandise today!'
};

export const breakpoints = {
  320: {
    slidesPerView: 2,
    spaceBetween: 10
  },

  600: {
    slidesPerView: 2,
    spaceBetween: 10
  },

  800: {
    slidesPerView: 3,
    spaceBetween: 20
  },

  1024: {
    slidesPerView: 4,
    spaceBetween: 20
  },
  1200: {
    slidesPerView: 5,
    spaceBetween: 20
  }
};

export const aosGlobalSetting: any = {
  disable: false, // accepts following values: 'phone', 'tablet', 'mobile', boolean, expression or function
  startEvent: 'DOMContentLoaded', // name of the event dispatched on the document, that AOS should initialize on
  initClassName: 'aos-init', // class applied after initialization
  animatedClassName: 'aos-animate', // class applied on animation
  useClassNames: false, // if true, will add content of `data-aos` as classes on scroll
  disableMutationObserver: false, // disables automatic mutations' detections (advanced)
  debounceDelay: 50, // the delay on debounce used while resizing window (advanced)
  throttleDelay: 99, // the delay on throttle used while scrolling the page (advanced)

  offset: 120,
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 400, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom' // defines which position of the element regarding to window should trigger the animation

  // More settings...
};

export const shippingFormFields = [
  {
    name: 'shippingAddress.fullName',
    label: 'Name',
    required: true
  },
  {
    name: 'shippingAddress.company',
    label: 'Company',
    required: false
  },
  {
    name: 'shippingAddress.addressLineOne',
    label: 'Address',
    required: true
  },
  {
    name: 'shippingAddress.addressLineTwo',
    label: 'Address 2',
    required: false
  },
  {
    name: 'shippingAddress.city',
    label: 'City',
    required: true
  },
  {
    name: 'shippingAddress.state',
    label: 'State',
    required: true
  },
  {
    name: 'shippingAddress.zipCode',
    label: 'Zip Code',
    required: true
  },
  {
    name: 'shippingAddress.phoneNumber',
    label: 'Phone',
    required: true
  }
];

export const statesList = [
  {name: 'Other', value: 'NONE'},
  {name: 'Alabama', value: 'AL'},
  {name: 'Alaska', value: 'AK'},
  {name: 'Alberta', value: 'AB'},
  {name: 'Arizona', value: 'AZ'},
  {name: 'Arkansas', value: 'AR'},
  {name: 'British Columbia', value: 'BC'},
  {name: 'California', value: 'CA'},
  {name: 'Colorado', value: 'CO'},
  {name: 'Connecticut', value: 'CT'},
  {name: 'Delaware', value: 'DE'},
  {name: 'District of Columbia', value: 'DC'},
  {name: 'Florida', value: 'FL'},
  {name: 'Georgia', value: 'GA'},
  {name: 'Hawaii', value: 'HI'},
  {name: 'Idaho', value: 'ID'},
  {name: 'Illinois', value: 'IL'},
  {name: 'Indiana', value: 'IN'},
  {name: 'Iowa', value: 'IA'},
  {name: 'Kansas', value: 'KS'},
  {name: 'Kentucky', value: 'KY'},
  {name: 'Louisiana', value: 'LA'},
  {name: 'Maine', value: 'ME'},
  {name: 'Manitoba', value: 'MB'},
  {name: 'Maryland', value: 'MD'},
  {name: 'Massachusetts', value: 'MA'},
  {name: 'Michigan', value: 'MI'},
  {name: 'Minnesota', value: 'MN'},
  {name: 'Mississippi', value: 'MS'},
  {name: 'Missouri', value: 'MO'},
  {name: 'Montana', value: 'MT'},
  {name: 'Nebraska', value: 'NE'},
  {name: 'Nevada', value: 'NV'},
  {name: 'New Brunswick', value: 'NB'},
  {name: 'New Hampshire', value: 'NH'},
  {name: 'New Jersey', value: 'NJ'},
  {name: 'New Mexico', value: 'NM'},
  {name: 'New York', value: 'NY'},
  {name: 'Newfoundland and Labrador', value: 'NL'},
  {name: 'North Carolina', value: 'NC'},
  {name: 'North Dakota', value: 'ND'},
  {name: 'Northwest Territories', value: 'NT'},
  {name: 'Nova Scotia', value: 'NS'},
  {name: 'Nunavut', value: 'NU'},
  {name: 'Ohio', value: 'OH'},
  {name: 'Oklahoma', value: 'OK'},
  {name: 'Ontario', value: 'ON'},
  {name: 'Oregon', value: 'OR'},
  {name: 'Pennsylvania', value: 'PA'},
  {name: 'Prince Edward Island', value: 'PE'},
  {name: 'Puerto Rico', value: 'PR'},
  {name: 'Quebec', value: 'QC'},
  {name: 'Rhode Island', value: 'RI'},
  {name: 'Saskatchewan', value: 'SK'},
  {name: 'South Carolina', value: 'SC'},
  {name: 'South Dakota', value: 'SD'},
  {name: 'Tennessee', value: 'TN'},
  {name: 'Texas', value: 'TX'},
  {name: 'Utah', value: 'UT'},
  {name: 'Vermont', value: 'VT'},
  {name: 'Virginia', value: 'VA'},
  {name: 'Washington', value: 'WA'},
  {name: 'West Virginia', value: 'WV'},
  {name: 'Wisconsin', value: 'WI'},
  {name: 'Wyoming', value: 'WY'},
  {name: 'Yukon', value: 'YT'}
];

export const allowableSearchParams = [
  'keywords',
  'page',
  'minPrice',
  'maxPrice',
  'colors',
  'category',
  'filter',
  'size',
  'tag'
];

export const colorNameToHex = (colorName: string): string => {
  const tempElement = document.createElement('div');
  tempElement.style.color = colorName;
  document.body.appendChild(tempElement);

  const computedColor = getComputedStyle(tempElement).color;

  document.body.removeChild(tempElement);

  const rgbToHex = (rgb: string): string => {
    const matches = rgb.match(/\d+/g);
    if (!matches) return '';
    return `#${matches.map(x => Number(x).toString(16).padStart(2, '0')).join('')}`;
  };

  return rgbToHex(computedColor);
};

export const extractColors = (additionalFields: AdditionalFieldProductValues[]): string[] => {
  let colorArray: string[] = [];

  let colors = additionalFields.find(
    item => item.fieldName === 'COLORS AVAILABLE' || item.fieldName === 'COLOR AVAILABLE'
  )?.fieldValue;

  // parsing if colors string is HTML element
  if (colors) {
    const temp = document.createElement('div');
    temp.innerHTML = colors;

    if (temp.firstChild && temp.firstChild.nodeType === 1) {
      colors = temp.textContent || '';
    }
  }

  console.log('colors', colors);

  if (colors) {
    colorArray = colors
      .replace(' or ', ', ')
      .replace('.', '')
      .split(', ')
      .map(color => color.replace(/\s+/g, '').trim());
  }
  return colorArray;
};

export const sortSortable = <T extends Sortable>(list: T[]): T[] => {
  return list.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
};
