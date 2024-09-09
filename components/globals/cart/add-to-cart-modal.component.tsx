'use client';
import React, {ChangeEvent, FC, useEffect, useMemo, useRef, useState} from 'react';
import {Modal, ModalDialog} from '@mui/joy';
import Image from 'next/image';
import {useFormik} from 'formik';
import {InferType, number, object, ref, string} from 'yup';
import axios, {AxiosResponse} from 'axios';
import {CartRoot, File as CartItemFile} from '../../../store/slices/cart/cart';
import {v4 as uuidv4} from 'uuid';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {selectCartState, setCartState, setCartStateForModal} from '../../../store/slices/cart/cart.slice';
import {
  CustomProduct,
  FormDescription,
  FormHeading,
  UploadedFileType
} from '@components/globals/cart/update-cart-modal.component';
import {LinearProgressWithLabel} from '@components/globals/linear-progress-with-label.component';
import {PriceGrids} from '@components/home/product/product.types';
import ModalClose from '@mui/joy/ModalClose';
import {IoBagCheckOutline, IoClose} from 'react-icons/io5';
import {MdOutlineFileDownload} from 'react-icons/md';

export const cartModalSchema = object({
  imprintColor: string().notRequired(),
  itemColor: string().required('Item Color is required'),
  size: string().notRequired(),
  itemQty: number()
    .transform((_, value) => (value === '' ? 0 : +value))
    .required()
    .positive()
    .min(ref('minQty'), 'Specified Qty must be greater than Min Qty'),
  selectedPriceType: string().notRequired()
});

export type LocalCartState = InferType<typeof cartModalSchema>;

export const AddToCartModal: FC = () => {
  const dispatch = useAppDispatch();
  const ref = useRef<HTMLFormElement>(null);
  const cartState = useAppSelector(selectCartState);

  const formik = useFormik<LocalCartState>({
    initialValues: {
      itemQty: 0,
      imprintColor: undefined,
      itemColor: '',
      size: undefined,
      selectedPriceType: null
    },
    validationSchema: cartModalSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: () => {
      handleAddToCart();
    }
  });

  const [artWorkFiles, setArtWorkFiles] = useState<CartItemFile[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [product, setProduct] = useState<CustomProduct>({
    id: '',
    sku: '',
    productName: '',
    priceGrids: [],
    sortedPrices: [],
    groupedByPricing: {},
    priceTypeExists: false
  });
  const [addToCartError, setAddToCartError] = useState<boolean>(false);
  const [priceTypes, setPriceTypes] = useState<string[]>([]);

  useEffect(() => {
    const strings: string[] = [];
    product.priceGrids.forEach(item => {
      if (strings.indexOf(item.priceType) === -1 && item.priceType !== null) {
        strings.push(item.priceType);
      }
    });
    setPriceTypes(strings);
    if (strings.length > 0) {
      formik.setFieldValue('selectedPriceType', cartState.selectedItem ? cartState.selectedItem.priceType : strings[0]);
    }
  }, [product.priceGrids, cartState.selectedItem]);

  useEffect(() => {
    const selectedCartItem = cartState.selectedItem;
    // if cart item already exists => updating item
    if (selectedCartItem) {
      setArtWorkFiles(selectedCartItem.files);
      formik.setValues({
        itemQty: selectedCartItem.qtyRequested,
        itemColor: selectedCartItem.spec[0]?.fieldValue,
        imprintColor: selectedCartItem.spec[1]?.fieldValue ?? '',
        size: selectedCartItem.spec[2]?.fieldValue ?? '',
        selectedPriceType: selectedCartItem.priceType
      });
    }
    if (cartState.selectedProduct) {
      // adding a new item to the cart
      const priceTypeExists = cartState.selectedProduct.priceGrids.some((item: {priceType: any}) => item.priceType);
      const priceTypesGroups: Record<string, PriceGrids[]> = {};
      if (priceTypeExists) {
        cartState.selectedProduct.priceGrids.forEach((item: PriceGrids) => {
          if (!(item.priceType in priceTypesGroups)) {
            priceTypesGroups[item.priceType] = [];
          }
          priceTypesGroups[item.priceType].push(item);
        });

        Object.keys(priceTypesGroups).forEach(itemKey => {
          priceTypesGroups[itemKey] = priceTypesGroups[itemKey].sort((a, b) => a.countFrom - b.countFrom);
        });
      }

      const productState = {
        id: cartState.selectedProduct.id,
        sku: cartState.selectedProduct.sku,
        productName: cartState.selectedProduct.productName,
        priceGrids: cartState.selectedProduct.priceGrids,
        sortedPrices: [...cartState.selectedProduct.priceGrids].sort((a, b) => a.countFrom - b.countFrom),
        groupedByPricing: priceTypesGroups,
        priceTypeExists
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

    const priceGridsFinalSelected = product.priceTypeExists
      ? product.groupedByPricing[formik.values.selectedPriceType as string]
      : product.sortedPrices;

    const priceGrid = priceGridsFinalSelected.find(
      (grid, index) =>
        quantity >= grid.countFrom &&
        (index === priceGridsFinalSelected.length - 1 || quantity < priceGridsFinalSelected[index + 1].countFrom)
    );

    return priceGrid ? (priceGrid.salePrice > 0 ? priceGrid.salePrice : priceGrid.price) : 0;
  }, [formik.values.itemQty, formik.values.selectedPriceType, product, priceTypes]);

  const handleCartModalClose = () => {
    formik.resetForm();
    setArtWorkFiles([]);
    dispatch(
      setCartStateForModal({
        open: false,
        selectedItem: null,
        selectedProduct: null,
        cartMode: 'new'
      })
    );
    setAddToCartError(false);
  };

  const handleFileUpload = async (file: File) => {
    let data = {
      type: 'CART',
      fileName: file.name,
      id: getCartId()
    };

    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/s3/signedUrl`, {params: data});
      await axios.put(res.data.payload.url, file, {
        onUploadProgress: event => {
          const percent = Math.floor((event.loaded / (event.total as number)) * 100);
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
        const uploadedFile = uploadedFileResponse?.data.payload as UploadedFileType;

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
      priceType: formik.values.selectedPriceType,
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

    cartData.specs = cartData.specs
      .filter(spec => spec.fieldValue !== '' && spec.fieldValue !== null && spec.fieldValue !== undefined)
      .map(spec => ({
        fieldName: spec.fieldName,
        fieldValue: spec.fieldValue
      }));

    if (cartState.cartMode === 'update' && cartState.selectedItem) {
      axios
        .put(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/update-item?cartId=${cartId}&cartItemId=${cartState.selectedItem.id}`,
          cartData
        )
        .then(() => axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/${cartId}`))
        .then((response: AxiosResponse) => {
          dispatch(setCartState(response.data.payload as CartRoot));
          handleCartModalClose();
        })
        .catch(() => {
          setAddToCartError(true);
        });
    } else {
      axios
        .post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/add?cartId=${cartId}`, cartData)
        .then(() => axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/cart/${cartId}`))
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
    <Modal open={cartState.open} onClose={handleCartModalClose}>
      <ModalDialog
        sx={{
          maxHeight: '80vh',
          overflowY: 'auto'
        }}
      >
        <ModalClose />

        <form ref={ref} onSubmit={formik.handleSubmit}>
          <div className="lg:px-8 pb-4">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-1">
              <figure>
                <div className="max-w-fit">
                  <h6 className="mb-2 text-sm font-semibold text-body">
                    ITEM#: <span className="text-primary-500">{product.sku}</span>
                  </h6>
                  <h3
                    className="text-xl font-bold capitalize sm:text-2xl md:text-3xl my-4"
                    dangerouslySetInnerHTML={{
                      __html: product.productName
                    }}
                  ></h3>
                </div>
              </figure>
              <figure>
                <div>
                  <div className="flex justify-between">
                    <FormHeading text="Quantity" />
                    <FormHeading text="Sub Total" />
                  </div>
                  <div className="flex justify-between space-x-4 w-full">
                    <div className="flex justify-between items-center gap-4">
                      {Object.keys(priceTypes).length > 0 ? (
                        <div className="flex items-center gap-2">
                          <label className="font-semibold text-xs" htmlFor="price-type">
                            Item Type
                          </label>

                          <select
                            name="selectedPriceType"
                            id="price-type"
                            className="block placeholder:text-[#303541] border w-fit h-14 pl-2 pr-2 rounded-sm text-sm focus:outline-none"
                            value={formik.values.selectedPriceType as string}
                            onChange={formik.handleChange}
                          >
                            {priceTypes.map(row => (
                              <option key={row} value={row}>
                                {row}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null}
                      <input
                        type="number"
                        placeholder="Quantity"
                        className="flex-1 block placeholder:text-[#303541] border w-full h-14 pl-4 pr-6 rounded-sm text-sm focus:outline-none"
                        value={formik.values.itemQty}
                        name="itemQty"
                        onChange={formik.handleChange}
                        onBlur={() => formik.validateField('itemQty')}
                      />
                    </div>
                    <div className="ml-5 flex items-center">x $ {calculatedPrice}</div>
                    <div className="flex items-center flex-1 justify-end">
                      {formik.values.itemQty < product.sortedPrices[0].countFrom ? (
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
                      *Final total including shipping and any additional charges will be sent with the artwork proof
                      after the order is placed.
                    </div>
                  </div>
                  <div>
                    <FormHeading text="Product Details" />
                    <div className="grid md:grid-cols-2 gap-6 ">
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
                          value={formik.values.imprintColor ?? ''}
                          onChange={formik.handleChange}
                        />
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          className="block peer px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 border bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none focus:ring-0 focus:border-secondary-500"
                          placeholder="Size"
                          name="size"
                          value={formik.values.size ?? ''}
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
                  <ul>
                    {artWorkFiles.map((file, index) => (
                      <li key={index} className="flex items-center pt-4 rounded-lg">
                        <div className="w-12 h-12 flex-shrink-0 overflow-hidden ">
                          <Image
                            className="object-cover w-full h-full rounded-sm"
                            width={100}
                            height={100}
                            src={`${process.env.ASSETS_SERVER_URL}${file.fileKey}`}
                            alt={file.filename}
                          />
                        </div>
                        <div className="flex-grow pl-4">
                          <span className="text-sm lg:text-base font-semibold break-all">{file.filename}</span>
                        </div>
                        <IoClose
                          onClick={e => {
                            handleFileRemove(index);
                            e.stopPropagation();
                          }}
                          className="text-red-600 w-6 h-6 cursor-pointer"
                        />
                      </li>
                    ))}
                  </ul>
                  {progress > 0 ? <LinearProgressWithLabel progress={progress} /> : null}
                </div>
                {formik.errors['itemQty'] ? <div className="text-red-500 pt-4">{formik.errors['itemQty']}</div> : null}
                {formik.errors['itemColor'] ? (
                  <div className="text-red-500 pt-4">{formik.errors['itemColor']}</div>
                ) : null}

                {addToCartError ? <div className="text-red-500 pt-4">Failed To Add</div> : null}
                <div className="flex flex-col md:flex-row pt-4 gap-4">
                  <label
                    htmlFor="fileInput"
                    className="py-2 px-6 flex items-center justify-center cursor-pointer rounded-md border-2 border-primary-500 text-primary-500 w-full lg:w-auto capitalize"
                  >
                    <input
                      id="fileInput"
                      type="file"
                      name="fileInput"
                      multiple
                      onChange={e => handleFileChange(e)}
                      hidden
                    />
                    Upload design <MdOutlineFileDownload className="w-6 h-6 ml-3" />
                  </label>
                  <button
                    type="submit"
                    className="py-2 px-6 flex items-center justify-center rounded-md bg-primary-500 text-white w-full lg:w-auto capitalize"
                  >
                    {cartState.cartMode === 'update' ? 'Update Cart Item' : 'Add to Cart'}
                    <IoBagCheckOutline className="w-6 h-6 ml-3" />
                  </button>
                </div>
              </figure>
            </div>
          </div>
        </form>
      </ModalDialog>
    </Modal>
  ) : null;
};
