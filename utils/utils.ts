import axios from 'axios';
import {AdditionalFieldProductValues, productColors} from '@components/home/product/product.types';
import chroma from 'chroma-js';
import {v4 as uuidv4} from 'uuid';

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

export const colorNameToHex = (colorName: string): productColors | null => {
  try {
    const colorHex = chroma(colorName).hex();
    return {
      id: uuidv4(),
      colorName,
      colorHex
    };
  } catch (e) {
    return null;
  }
};

export const extractColorsArray = (additionalFields: AdditionalFieldProductValues[]): string[] => {
  let colorArray: string[] = [];

  let colorsHtml = additionalFields.find(
    item => item.fieldName.toLowerCase() === 'colors available' || item.fieldName.toLowerCase() === 'color available'
  )?.fieldValue;

  if (colorsHtml) {
    const colors = containsHTML(colorsHtml) ? colorsHtml?.replace(/<\/?[^>]+(>|$)/g, '') : colorsHtml;
    if (colors) {
      colorArray = colors
        .replace(' or ', ', ')
        .replace('.', '')
        .split(', ')
        .map(color => color.replace(/\s+/g, '').trim());
    }
  }
  return colorArray;
};

export const containsHTML = (input: string): boolean => {
  const htmlTagPattern = /<[^>]*>/;
  return htmlTagPattern.test(input);
};

export const scrollIntoProductsView = () => {
  const paginationElem = document.getElementById('product-card-container');

  if (paginationElem) {
    setTimeout(() => {
      const yOffset = -180;
      const yPosition = paginationElem.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: yPosition, behavior: 'smooth'});
    }, 100);
  }
};

export const isValidHex = (hex: string) => {
  const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
  return hexRegex.test(hex);
};

export const getColorsWithHex = (color: productColors) => {
  if (color.colorHex && isValidHex(color.colorHex)) return color;
  else if (color.colorHex && !color.colorHex.startsWith('#') && isValidHex(`#${color.colorHex}`))
    return {
      id: color.id,
      colorName: color.colorName,
      colorHex: `#${color.colorHex}`,
      coloredProductImage: color?.coloredProductImage
    };
  else {
    const colorFromName = colorNameToHex(color?.colorName);
    if (colorFromName?.colorHex && isValidHex(colorFromName.colorHex)) {
      return {
        ...colorFromName,
        colorHex: colorFromName.colorHex,
        coloredProductImage: color?.coloredProductImage
      };
    } else {
      return null;
    }
  }
};

export const getContrastColor = (bgColor: string) => {
  const hex = bgColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186 ? '#000000' : '#FFFFFF';
};