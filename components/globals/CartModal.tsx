import {ChangeEvent, FC, useEffect, useState} from 'react';
import Image from 'next/image';
import {Dialog} from '@mui/material';
import sanitizeHtml from 'sanitize-html';
import CloseIcon from '@mui/icons-material/Close';

import {Product} from '@store/slices/product/product';
import {useAppDispatch, useAppSelector} from '@store/hooks';
import {
  addtocart,
  selectCartModalOpen,
  setIsCartModalOpen
} from '@store/slices/cart/cart.slice';
import FormHeading from '@components/Form/FormHeading';
import FormDescription from '@components/Form/FormDescription';
import TootipBlack from '@components/globals/TootipBlack';
//   import PriceGrid from '@components/globals/PriceGrid';
import {CartItem} from '@store/slices/cart/cart';

interface AddToCartModalProps {
  product: Product;
  addToCartText: string;
  shouldDisplayDatails?: boolean;
}
interface File {
  fileName: string;
  fileType: string;
  fileUrl: string;
}

const title = [
  'Please type the color/s of the item you are ordering.  If the item does not have a color code, or it is a full color item, you may enter N/A.',
  'This is not a mandatory field. If the item has different Imprint Colors, please enter the colors/s that you are ordering. If the item only comes in one color, you may leave this field blank.',
  'This is not a mandatory field. If the item has different sizes, please enter the size/s that you are ordering. If the item only comes in one size, you may leave this field blank.'
];

const CartModal: FC<AddToCartModalProps> = ({
  product,
  addToCartText,
  shouldDisplayDatails = true
}) => {
  const [itemsQuantity, setItemsQuantity] = useState<number>(0);
  const [minQuantityError, setMinQuantityError] = useState('');
  const [specifications, setSpecicification] = useState([
    {
      fieldName: 'Item Color',
      fieldValue: ''
    },
    {
      fieldName: 'Imprint Colors',
      fieldValue: ''
    },
    {
      fieldName: 'Size',
      fieldValue: ''
    }
  ]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.cartItems);
  const isCartModalOpen = useAppSelector(selectCartModalOpen);

  useEffect(() => {
    const cartItemsFromLocalStorage = JSON.parse(
      localStorage.getItem('cartItems') || '[]'
    );
    cartItemsFromLocalStorage.forEach((cartItem: CartItem) => {
      dispatch(addtocart(cartItem));
    });
  }, [dispatch]);

  useEffect(() => {
    const specificProduct = cartItems.find(
      item => item.product.id === product.id
    );

    if (specificProduct && specificProduct.itemsQuantity) {
      setItemsQuantity(specificProduct.itemsQuantity);
    } else {
      setItemsQuantity(0);
    }

    if (specificProduct && specificProduct.specifications) {
      specificProduct.specifications.forEach(spec => {
        handleSpecificationChange(spec.fieldName, spec.fieldValue);
      });
    } else {
      setSpecicification(prevSpecs =>
        prevSpecs.map(spec => ({...spec, fieldValue: ''}))
      );
    }

    if (specificProduct && specificProduct.artWorkFiles) {
      setUploadedFiles([...specificProduct.artWorkFiles]);
    } else {
      setUploadedFiles([]);
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems, product, isCartModalOpen]);

  const sortedPriceGrids = [...product.priceGrids].sort(
    (a, b) => a.countFrom - b.countFrom
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(e.target.value);
    if (!isNaN(inputValue) || inputValue >= sortedPriceGrids[0].countFrom) {
      setMinQuantityError('');
      setItemsQuantity(inputValue);
    } else {
      setMinQuantityError(
        'Please enter a valid number greater than or equal to the minimum quantity'
      );
    }
  };

  const calculatePriceForQuantity = (quantity: number) => {
    if (quantity === 0 || !product?.priceGrids || !sortedPriceGrids) {
      return 0;
    }

    const priceGrid = sortedPriceGrids.find(
      (grid, index) =>
        quantity >= grid.countFrom &&
        (index === sortedPriceGrids.length - 1 ||
          quantity < sortedPriceGrids[index + 1].countFrom)
    );

    return priceGrid
      ? priceGrid.salePrice > 0
        ? priceGrid.salePrice
        : priceGrid.price
      : 0;
  };

  const totalPrice = (
    itemsQuantity * calculatePriceForQuantity(itemsQuantity)
  ).toFixed(2);

  const handleSpecificationChange = (fieldName: string, value: string) => {
    setSpecicification(prevSpecifications =>
      prevSpecifications.map(spec => {
        if (spec.fieldName === fieldName) {
          return {...spec, fieldValue: value};
        }
        return spec;
      })
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const fileArray = Array.from(selectedFiles);
      const newFiles = fileArray.map(file => ({
        fileName: file.name,
        fileType: file.type.split('/').pop() || '',
        fileUrl: URL.createObjectURL(file)
      }));
      setUploadedFiles(prevUploadedFiles => [
        ...prevUploadedFiles,
        ...newFiles
      ]);
    }
  };

  /*  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target?.files;
  
      if (selectedFiles && selectedFiles.length > 0) {
        const fileArray = Array.from(selectedFiles);
  
        const newFiles = fileArray.map(async file => {
          return new Promise<File>(resolve => {
            const reader = new FileReader();
            reader.onload = event => {
              const base64Data = (event?.target?.result || '') as string;
              resolve({
                fileName: file.name,
                fileType: file.type.split('/').pop() || '',
                fileUrl: base64Data
              });
            };
            reader.readAsDataURL(file);
          });
        });
  
        Promise.all(newFiles).then(files => {
          setUploadedFiles((prevUploadedFiles: File[]) => [
            ...prevUploadedFiles,
            ...files
          ]);
        });
      }
    };  */

  const handleFileRemove = (index: number) => {
    setUploadedFiles(prevUploadedFiles => {
      const updatedFiles = [...prevUploadedFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const handleAddToCart = () => {
    if (itemsQuantity >= sortedPriceGrids[0].countFrom) {
      dispatch(
        addtocart({
          product,
          itemsQuantity,
          calculatePriceForQuantity: calculatePriceForQuantity(itemsQuantity),
          totalPrice,
          specifications: specifications,
          artWorkFiles: uploadedFiles
        })
      );
      setMinQuantityError('');
      dispatch(setIsCartModalOpen(false));
    }
    if (itemsQuantity < sortedPriceGrids[0].countFrom) {
      setMinQuantityError(
        `Please add Min Qty is ${sortedPriceGrids[0].countFrom} to add item into cart`
      );
      if (isCartModalOpen) {
        dispatch(setIsCartModalOpen(true));
      }
    }
  };

  const handleCartModalClose = () => {
    const specificProduct = cartItems.find(
      item => item.product.id === product.id
    );

    if (isCartModalOpen && !specificProduct) {
      dispatch(setIsCartModalOpen(false));
      resetModal();
    } else {
      if (isCartModalOpen) {
        dispatch(setIsCartModalOpen(false));
      }
    }
  };

  const resetModal = () => {
    setItemsQuantity(0);
    setMinQuantityError('');
    setSpecicification([
      {
        fieldName: 'Item Color',
        fieldValue: ''
      },
      {
        fieldName: 'Imprint Colors',
        fieldValue: ''
      },
      {
        fieldName: 'Size',
        fieldValue: ''
      }
    ]);
    setUploadedFiles([]);
  };

  return (
    <div>
      <Dialog
        open={isCartModalOpen}
        onClose={handleCartModalClose}
        classes={{
          paper: shouldDisplayDatails
            ? 'rounded-none min-w-[95%] xl:min-w-[62.5rem]'
            : 'rounded-none min-w-[45%] xl:min-w-[45rem]'
        }}
        disableScrollLock
        disableRestoreFocus
      >
        <>
          {shouldDisplayDatails && (
            <div className="p-3 mb-3 text-end">
              <button type="button" onClick={handleCartModalClose}>
                <CloseIcon />
              </button>
            </div>
          )}
          <div className="px-8 pb-4">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
              {shouldDisplayDatails && (
                <figure>
                  <div className="max-w-fit">
                    <h6 className="mb-2 text-sm font-semibold text-body">
                      ITEM#:{' '}
                      <span className="text-primary-500">{product?.sku}</span>
                    </h6>
                    <h3
                      className="text-xl font-bold capitalize sm:text-2xl md:text-3xl my-4"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(product?.productName)
                      }}
                    ></h3>
                  </div>
                  {/* <PriceGrid product={product} /> */}
                </figure>
              )}
              <figure>
                <div>
                  <div className="flex justify-between">
                    <FormHeading text="Quantity:" />
                    <FormHeading text="Sub Total:" />
                  </div>
                  <div className="flex justify-between space-x-4 w-full">
                    <div className="flex items-center flex-1">
                      <input
                        type="text"
                        placeholder="Quantity"
                        className="block placeholder:text-[#303541] border w-full h-14 pl-4 pr-6 rounded-sm text-sm focus:outline-none"
                        value={String(itemsQuantity)}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="ml-5 flex items-center">
                      x $ {calculatePriceForQuantity(itemsQuantity)}
                    </div>
                    <div className="flex items-center flex-1 justify-end">
                      {itemsQuantity < sortedPriceGrids[0].countFrom ? (
                        <h2 className="text-red-500 text-lg lg:text-2xl font-bold flex justify-end items-center">
                          Min Qty is {sortedPriceGrids[0].countFrom}
                        </h2>
                      ) : (
                        <h2 className="text-primary-500 text-2xl font-bold flex justify-end items-center">
                          ${totalPrice}
                        </h2>
                      )}
                    </div>
                  </div>
                  <div
                    className={
                      shouldDisplayDatails
                        ? 'flex flex-col md:flex-row gap-2 justify-between mt-4'
                        : 'flex flex-col gap-2 mt-4'
                    }
                  >
                    <div className="text-red-500 text-xs font-semibold">
                      Min Qty is {sortedPriceGrids[0].countFrom}
                    </div>
                    <div className="text-xs">
                      *Final total including shipping and any additional charges
                      will be sent with the artwork proof after the order is
                      placed.
                    </div>
                  </div>

                  <div>
                    <FormHeading text="Product Details" />
                    <div className="grid md:grid-cols-2 gap-6 mt-6">
                      {specifications.map((spec, index) => (
                        <div key={spec.fieldName}>
                          <TootipBlack title={title[index]}>
                            <div className="relative">
                              <input
                                type="text"
                                className={`block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 border bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-secondary-500 ${
                                  false && 'border-red-500'
                                } peer`}
                                placeholder={spec.fieldName}
                                value={spec.fieldValue}
                                onChange={e =>
                                  handleSpecificationChange(
                                    spec.fieldName,
                                    e.target.value
                                  )
                                }
                              />
                              <label
                                className={`absolute text-sm ${
                                  false ? 'text-red-500' : 'text-gray-500'
                                } duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-secondary-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-[55%] peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1`}
                              >
                                {spec.fieldName}
                                {spec.fieldName === 'Item Color' && (
                                  <span className="text-red-500">*</span>
                                )}
                              </label>
                            </div>
                          </TootipBlack>
                        </div>
                      ))}
                    </div>
                  </div>
                  <FormHeading text="Artwork files" />
                  <FormDescription
                    textArray={[
                      `Click the "Add Files" button to locate the artwork on your computer. Your artwork will automatically begin to upload. We can accept any artwork format you send us. However, we prefer vector format. This is usually .ai or .eps`,
                      `We will send a digital artwork proof for approval once the order is received.`
                    ]}
                  />
                  <label className="w-fit flex group text-sm font-bold bg-secondary-500 hover:bg-primary-500 text-white cursor-pointer">
                    <span className="group-hover:bg-primary-600 bg-secondary-600 text-center px-5 py-5">
                      <Image
                        height={15}
                        width={15}
                        src="/assets/icon-upload-white.png"
                        alt="..."
                      />
                    </span>
                    <span className="pr-5 pl-3 py-5">ADD FILES...</span>
                    <input
                      type="file"
                      name="fileInput"
                      multiple
                      onChange={e => handleFileChange(e)}
                      style={{display: 'none'}}
                    />
                  </label>
                  <ul>
                    {uploadedFiles.map((file, index) => (
                      <li
                        key={index}
                        className="flex items-center pt-4 rounded-lg"
                      >
                        <div className="w-12 h-12 flex-shrink-0 overflow-hidden ">
                          <Image
                            src={file.fileUrl}
                            width={100}
                            height={100}
                            alt={file.fileName}
                            className="object-cover w-full h-full rounded-sm"
                          />
                        </div>
                        <div className="flex-grow pl-4">
                          <span className="text-sm lg:text-base font-semibold break-all">
                            {file.fileName}
                          </span>
                        </div>
                        <CloseIcon
                          onClick={() => handleFileRemove(index)}
                          className="text-red-600 w-6 h-6 cursor-pointer"
                        />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-red-700 pt-4">{minQuantityError}</div>
                <div className="flex flex-col pt-4 ">
                  <div
                    className="block w-full text-center uppercase py-5 px-8 text-white bg-primary-500 hover:bg-body border border-[#eaeaec] text-sm font-bold cursor-pointer"
                    onClick={handleAddToCart}
                  >
                    {addToCartText}
                  </div>
                </div>
              </figure>
            </div>
          </div>
        </>
      </Dialog>
    </div>
  );
};

export default CartModal;
