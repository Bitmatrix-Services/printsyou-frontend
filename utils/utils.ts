export const getProductDescription = (productDescription: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = productDescription;

  const liElements = tempDiv.querySelector('ul')?.querySelectorAll('li');

  const textArray: string[] = [];

  liElements?.forEach(li => {
    if (li.textContent) textArray.push(li.textContent.trim());
  });

  return textArray;
};

export const getProductPriceGridTable = (productDescription: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = productDescription;

  const heading = tempDiv.querySelector('p');
  const priceTable = tempDiv.querySelector('table');

  return {heading, priceTable};
};

export const getCateoryTitleAndDescription = (cateoryDescription: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = cateoryDescription;

  const title = tempDiv.querySelector('h1')?.textContent;
  const pElements = tempDiv.querySelectorAll('p');

  const descriptionList: string[] = [];

  pElements?.forEach(p => {
    if (p.textContent) descriptionList.push(p.textContent.trim());
  });

  return {title, descriptionList};
};

export const getMinMaxRange = (input: string[]) => {
  const regex = /^\$([0-9.]+)+(\sto\s)\$([0-9.]+)+$/;
  return input.map((value: string) => {
    let minValue: number = 0;
    let maxValue: number = -1;
    if (~value.toLowerCase().indexOf('under'))
      maxValue = +value.toLowerCase().replaceAll('under $', '');
    else if (~value.toLowerCase().indexOf('over')) {
      minValue = 50;
      maxValue = Number.MAX_SAFE_INTEGER;
    } else {
      const matchValue = value.match(regex);
      if (matchValue) {
        minValue = +matchValue[1];
        maxValue = +matchValue[3];
      }
    }

    if (maxValue === -1)
      throw Error('Invalid calculations of min and max values');

    return {
      minValue: minValue,
      maxValue: maxValue
    };
  });
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
