export const metaConstants = {
  SITE_NAME: 'Prints You',
  DESCRIPTION:
    'Custom Printed Promotional Products with your logo or custom imprinted message. Thousands of promotional items to choose from. Logo merch for trade shows, conventions, or hand outs. Promotional swag for the office or home.'
};

export const statesList = [
  'Alabama',
  'Alaska',
  'Arizona',
  'Arkansas',
  'California',
  'Colorado',
  'Connecticut',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Idaho',
  'Illinois',
  'Indiana',
  'Iowa',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Maine',
  'Maryland',
  'Massachusetts',
  'Michigan',
  'Minnesota',
  'Mississippi',
  'Missouri',
  'Montana',
  'Nebraska',
  'Nevada',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'New York',
  'North Carolina',
  'North Dakota',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Vermont',
  'Virginia',
  'Washington',
  'West Virginia',
  'Wisconsin',
  'Wyoming'
];

export const shippingFormFields = [
  {name: 'shippingFullName', placeholder: 'Name', label: 'Name'},
  {name: 'shippingCompany', placeholder: 'Company', label: 'Company'},
  {name: 'shippingAddressLineOne', placeholder: 'Address', label: 'Address'},
  {
    name: 'shippingAddressLineTwo',
    placeholder: 'Address 2',
    label: 'Address 2'
  },
  {name: 'shippingCity', placeholder: 'City', label: 'City'},
  {name: 'shippingState', placeholder: 'State', label: 'State'},
  {name: 'shippingZipcode', placeholder: 'Zip Code', label: 'Zip Code'},
  {name: 'shippingPhoneNumber', placeholder: 'Phone', label: 'Phone'}
];

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
