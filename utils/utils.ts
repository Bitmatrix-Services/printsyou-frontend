export const getProductImage = (productImages: string[] | undefined) => {
  return productImages && productImages[0]
    ? productImages[0]
    : '/assets/logo.png';
};

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
