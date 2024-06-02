import React, {ChangeEvent, FC, useEffect, useMemo, useState} from 'react';
import Dialog from '@mui/material/Dialog';
import {useAppDispatch, useAppSelector} from '@store/hooks';
import {
  selectCartRootState,
  selectCartState,
  setCartState,
  setCartStateForModal
} from '@store/slices/cart/cart.slice';
import CloseIcon from '@mui/icons-material/Close';
import sanitizeHtml from 'sanitize-html';
import FormHeading from '@components/Form/FormHeading';
import FormDescription from '@components/Form/FormDescription';
import Image from 'next/image';
import LinearProgressWithLabel from '@components/globals/LinearProgressWithLabel';
import getConfig from 'next/config';
import {useFormik} from 'formik';
import {InferType, number, object, ref, string} from 'yup';
import {PriceGrids} from '@store/slices/product/product';
import {http} from '../services/axios.service';
import axios, {AxiosResponse} from 'axios';
import {CartRoot, File as CartItemFile} from '@store/slices/cart/cart';
import {v4 as uuidv4} from 'uuid';

const config = getConfig();

interface CustomProduct {
  id: string;
  sku: string;
  productName: string;
  priceGrids: PriceGrids[];
  sortedPrices: PriceGrids[];
}

interface UploadedFileType {
  url: string;
  objectKey: string;
}

export const cartModalSchema = object({
  imprintColor: string(),
  itemColor: string().required('Item Color is required'),
  size: string(),
  itemQty: number()
    .transform((_, value) => (value === '' ? 0 : +value))
    .required()
    .positive()
    .min(ref('minQty'), 'Specified Qty must be greater than Min Qty')
});

export type LocalCartState = InferType<typeof cartModalSchema>;

export const UpdateCartComponent: FC = () => {
  const dispatch = useAppDispatch();
  const cartRoot = useAppSelector(selectCartRootState);
  const cartState = useAppSelector(selectCartState);

  const formik = useFormik<LocalCartState>({
    initialValues: {
      itemQty: 0,
      imprintColor: undefined,
      itemColor: '',
      size: undefined
    },
    validationSchema: cartModalSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: data => {
      console.log({data});
    }
  });

  const [artWorkFiles, setArtWorkFiles] = useState<CartItemFile[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [product, setProduct] = useState<CustomProduct>({
    id: '',
    sku: '',
    productName: '',
    priceGrids: [],
    sortedPrices: []
  });
  const [addToCartError, setAddToCartError] = useState<boolean>(false);

  useEffect(() => {
    const selectedCartItem = cartState.selectedItem;
    if (selectedCartItem) {
      setArtWorkFiles(selectedCartItem.files);
      formik.setValues({
        itemQty: selectedCartItem.qtyRequested,
        itemColor: selectedCartItem.spec[0].fieldValue,
        imprintColor: selectedCartItem.spec[1].fieldValue,
        size: selectedCartItem.spec[2].fieldValue
      });
    }
    if (cartState.selectedProduct) {
      const productState = {
        id: cartState.selectedProduct.id,
        sku: cartState.selectedProduct.sku,
        productName: cartState.selectedProduct.productName,
        priceGrids: cartState.selectedProduct.priceGrids,
        sortedPrices: [...cartState.selectedProduct.priceGrids].sort(
          (a, b) => a.countFrom - b.countFrom
        )
      };
      setProduct(productState);
      formik.setFieldValue('minQty', productState.sortedPrices[0].countFrom);
    }
  }, [cartState.open]);

  const calculatedPrice = useMemo(() => {
    const quantity = formik.values.itemQty;
    if (quantity === 0 || !product?.priceGrids || !product.sortedPrices) {
      return 0;
    }

    const priceGrid = product.sortedPrices.find(
      (grid, index) =>
        quantity >= grid.countFrom &&
        (index === product.sortedPrices.length - 1 ||
          quantity < product.sortedPrices[index + 1].countFrom)
    );

    return priceGrid
      ? priceGrid.salePrice > 0
        ? priceGrid.salePrice
        : priceGrid.price
      : 0;
  }, [formik.values.itemQty]);

  const handleCartModalClose = () => {
    formik.resetForm();
    dispatch(
      setCartStateForModal({
        open: false,
        selectedItem: null,
        selectedProduct: null,
        cartMode: 'new'
      })
    );
  };

  const handleFileUpload = async (file: File) => {
    let data = {
      type: 'CART',
      fileName: file.name,
      id: getCartId()
    };

    try {
      const res = await http.get('/s3/signedUrl', {params: data});
      await axios.put(res.data.payload.url, file, {
        onUploadProgress: event => {
          const percent = Math.floor(
            (event.loaded / (event.total as number)) * 100
          );
          setProgress(percent);
          if (percent === 100) {
            setTimeout(() => setProgress(0), 2000);
          }
        }
      });
      return res;
    } catch (error) {
      setProgress(0);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles && selectedFiles.length > 0) {
      try {
        const uploadedFileResponse = await handleFileUpload(selectedFiles[0]);
        const uploadedFile = uploadedFileResponse?.data
          .payload as UploadedFileType;

        if (uploadedFile?.url && uploadedFile?.objectKey) {
          const newFile = {
            filename: selectedFiles[0].name,
            fileType: selectedFiles[0].type.split('/').pop() || '',
            fileKey: uploadedFile.objectKey
          };

          setArtWorkFiles(prevArtWorkFiles => [...prevArtWorkFiles, newFile]);
        }
      } catch (error) {
        console.error('Error handling file upload:', error);
      } finally {
        setProgress(0);
      }
    }
  };

  const handleFileRemove = (index: number) => {
    setArtWorkFiles(prevArtWorkFiles => {
      const updatedFiles = [...prevArtWorkFiles];
      updatedFiles.splice(index, 1);
      return updatedFiles;
    });
  };

  const getCartId = () => {
    let cartId;
    try {
      cartId = localStorage.getItem('cartId');
      if (!cartId) {
        cartId = uuidv4();
        localStorage.setItem('cartId', cartId);
      }
      return cartId;
    } catch (error) {}
  };

  const handleAddToCart = () => {
    setAddToCartError(false);
    const cartId = getCartId();
    const cartData = {
      productId: product.id,
      qtyRequested: formik.values.itemQty,
      specs: [
        {
          fieldName: 'Item Color',
          fieldValue: formik.values.itemColor
        },
        {
          fieldName: 'Imprint Colors',
          fieldValue: formik.values.imprintColor
        },
        {
          fieldName: 'Size',
          fieldValue: formik.values.size
        }
      ],
      files: artWorkFiles
    };
    if (cartState.cartMode === 'update' && cartState.selectedItem) {
      http
        .put(
          `/cart/update-item?cartId=${cartId}&cartItemId=${cartState.selectedItem.id}`,
          cartData
        )
        .then(() => http.get(`/cart/${cartId}`))
        .then((response: AxiosResponse) => {
          dispatch(setCartState(response.data.payload as CartRoot));
          handleCartModalClose();
        })
        .catch(() => {
          setAddToCartError(true);
        });
    } else {
      http
        .post(`/cart/add?cartId=${cartId}`, cartData)
        .then(() => http.get(`/cart/${cartId}`))
        .then((response: AxiosResponse) => {
          dispatch(setCartState(response.data.payload as CartRoot));
          handleCartModalClose();
        })
        .catch(() => {
          setAddToCartError(true);
        });
    }
  };

  return product.sku ? (
    <Dialog
      open={cartState.open}
      onClose={handleCartModalClose}
      classes={{
        paper: 'rounded-none min-w-[95%] xl:min-w-[62.5rem]'
      }}
      sx={{'& .MuiBackdrop-root': {backgroundColor: 'lightgray'}}}
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="p-3 mb-3 text-end">
          <button type="button" onClick={handleCartModalClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="px-8 pb-4">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
            <figure>
              <div className="max-w-fit">
                <h6 className="mb-2 text-sm font-semibold text-body">
                  ITEM#: <span className="text-primary-500">{product.sku}</span>
                </h6>
                <h3
                  className="text-xl font-bold capitalize sm:text-2xl md:text-3xl my-4"
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(product.productName)
                  }}
                ></h3>
              </div>
            </figure>
            <figure>
              <div>
                <div className="flex justify-between">
                  <FormHeading text="Quantity:" />
                  <FormHeading text="Sub Total:" />
                </div>
                <div className="flex justify-between space-x-4 w-full">
                  <div className="flex items-center flex-1">
                    <input
                      type="number"
                      placeholder="Quantity"
                      className="block placeholder:text-[#303541] border w-full h-14 pl-4 pr-6 rounded-sm text-sm focus:outline-none"
                      value={formik.values.itemQty}
                      name="itemQty"
                      onChange={formik.handleChange}
                      onBlur={() => formik.validateField('itemQty')}
                    />
                  </div>
                  <div className="ml-5 flex items-center">
                    x $ {calculatedPrice}
                  </div>
                  <div className="flex items-center flex-1 justify-end">
                    {formik.values.itemQty <
                    product.sortedPrices[0].countFrom ? (
                      <h2 className="text-red-500 text-lg lg:text-2xl font-bold flex justify-end items-center">
                        Min Qty is {product.sortedPrices[0].countFrom}
                      </h2>
                    ) : (
                      <h2 className="text-primary-500 text-2xl font-bold flex justify-end items-center">
                        ${(formik.values.itemQty * calculatedPrice).toFixed(2)}
                      </h2>
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-2 justify-between mt-4">
                  {formik.errors['itemQty'] ? (
                    <div className="text-red-500 text-xs font-semibold">
                      Min Qty is {product.sortedPrices[0].countFrom}
                    </div>
                  ) : null}
                  <div className="text-xs">
                    *Final total including shipping and any additional charges
                    will be sent with the artwork proof after the order is
                    placed.
                  </div>
                </div>
                <div>
                  <FormHeading text="Product Details" />
                  <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div className="relative">
                      <input
                        type="text"
                        className={`block peer px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 border bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-secondary-500 ${
                          formik.errors['itemColor'] ? 'border-red-500' : ''
                        }`}
                        placeholder="Item Color"
                        name="itemColor"
                        value={formik.values.itemColor}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        className="block peer px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 border bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-secondary-500"
                        placeholder="Imprint Color"
                        name="imprintColor"
                        value={formik.values.imprintColor}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        className="block peer px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 border bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-secondary-500"
                        placeholder="Size"
                        name="size"
                        value={formik.values.size}
                        onChange={formik.handleChange}
                      />
                    </div>
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
                      alt="artwork upload"
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
                  {artWorkFiles.map((file, index) => (
                    <li
                      key={index}
                      className="flex items-center pt-4 rounded-lg"
                    >
                      <div className="w-12 h-12 flex-shrink-0 overflow-hidden ">
                        <Image
                          className="object-cover w-full h-full rounded-sm"
                          width={100}
                          height={100}
                          src={`${config.publicRuntimeConfig.ASSETS_SERVER_URL}${file.fileKey}`}
                          alt={file.filename}
                        />
                      </div>
                      <div className="flex-grow pl-4">
                        <span className="text-sm lg:text-base font-semibold break-all">
                          {file.filename}
                        </span>
                      </div>
                      <CloseIcon
                        onClick={e => {
                          handleFileRemove(index);
                          e.stopPropagation();
                        }}
                        className="text-red-600 w-6 h-6 cursor-pointer"
                      />
                    </li>
                  ))}
                </ul>
                {progress > 0 ? (
                  <LinearProgressWithLabel progress={progress} />
                ) : null}
              </div>
              {formik.errors['itemQty'] ? (
                <div className="text-red-500 pt-4">
                  {formik.errors['itemQty']}
                </div>
              ) : null}
              {formik.errors['itemColor'] ? (
                <div className="text-red-500 pt-4">
                  {formik.errors['itemColor']}
                </div>
              ) : null}

              {addToCartError ? (
                <div className="text-red-500 pt-4">Failed To Add</div>
              ) : null}
              <div className="flex flex-col pt-4 ">
                <div
                  className="block w-full text-center uppercase py-5 px-8 text-white bg-primary-500 hover:bg-body border border-[#eaeaec] text-sm font-bold cursor-pointer"
                  onClick={() => handleAddToCart()}
                >
                  {cartState.cartMode === 'update'
                    ? 'Update Cart Item'
                    : 'Add to Cart'}
                </div>
              </div>
            </figure>
          </div>
        </div>
      </form>
    </Dialog>
  ) : null;
};
