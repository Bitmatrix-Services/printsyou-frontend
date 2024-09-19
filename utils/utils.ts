import axios from 'axios';
export const getMinMaxRange = (input: string[]) => {
  const regex = /^\$([0-9.]+)+(\sto\s)\$([0-9.]+)+$/;
  return input.map((value: string) => {
    let minValue: number = 0;
    let maxValue: number = -1;
    if (~value.toLowerCase().indexOf('under')) maxValue = +value.toLowerCase().replaceAll('under $', '');
    else if (~value.toLowerCase().indexOf('over')) {
      minValue = 50;
      maxValue = 9999;
    } else {
      const matchValue = value.match(regex);
      if (matchValue) {
        minValue = +matchValue[1];
        maxValue = +matchValue[3];
      }
    }

    if (maxValue === -1) throw Error('Invalid calculations of min and max values');

    return {
      minValue: minValue,
      maxValue: maxValue
    };
  });
};

export const deepFind = (obj: Record<string, any>, path: string): {message: string} => {
  const paths = path.split('.');
  let current = structuredClone(obj);

  for (let i = 0; i < paths.length; ++i) {
    if (current[paths[i]] == undefined) {
      return {message: ''};
    } else {
      current = current[paths[i]];
    }
  }
  return current as any;
};

export const convertDateFormat = (timestamp: number): string => {
  const date = new Date(timestamp);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month} ${day}, ${year}`;
};

export const getSitemapStuff = async (sitemapPath: string, queryParams: Record<string, string> = {}) => {
  const apiKey = process.env.API_KEY;
  const apikeySecret = process.env.API_KEY_SECRET;

  return (
    await axios.get(`https://api.printsyou.com/sitemap/${sitemapPath}`, {
      headers: {
        'X-API-KEY': apiKey,
        'X-API-SECRET': apikeySecret
      },
      params: queryParams
    })
  ).data.payload;
};

export const formatString = (str: string, ...args: any[]) => str.replace(/{(\d+)}/g, (_, index) => args[index] || '');