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
