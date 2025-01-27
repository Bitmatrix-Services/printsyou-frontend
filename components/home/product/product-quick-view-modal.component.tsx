'use client';
import * as React from 'react';
import {Dispatch, FC, Fragment, SetStateAction, useEffect, useState} from 'react';
import Modal from '@mui/joy/Modal';
import ModalClose from '@mui/joy/ModalClose';
import AccordionGroup from '@mui/joy/AccordionGroup';
import ModalDialog from '@mui/joy/ModalDialog';
import {IoIosAdd} from 'react-icons/io';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary, {accordionSummaryClasses} from '@mui/joy/AccordionSummary';
import {Product, ProductImage} from '@components/home/product/product.types';
import {ProductImageComponent} from '@components/home/product/product-image-section.component';
import {ProductDescriptionComponent} from '@components/home/product/product-description-section.component';
import sanitizeHtml from 'sanitize-html';
import {getProductDetailsById} from '@components/home/product/product-apis';
import {CircularLoader} from '@components/globals/circular-loader.component';

interface IProductQuickViewModal {
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  productId: string;
}

export const ProductQuickViewModal: FC<IProductQuickViewModal> = ({open, onClose, productId}) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (productId) {
      getProductDetail();
    }
  }, [productId]);

  useEffect(() => {
    if (product && product?.productImages?.length > 0) {
      setImages(product.productImages);
    }
  }, [product?.productImages]);

  const getProductDetail = async () => {
    const res = await getProductDetailsById(productId);

    if (res?.payload) {
      setProduct(res.payload);
    }
  };

  return (
    <Modal open={open} onClose={() => onClose(false)}>
      <ModalDialog
        sx={{
          height: 'auto',
          width: '90%',
          maxWidth: '75rem',
          margin: 'auto',
          overflowY: 'auto',
          '@media (max-width: 600px)': {
            width: '95%',
            maxWidth: '90%'
          }
        }}
      >
        <ModalClose />
        {/* Left Column */}
        {product ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 mb-4">
              <ProductDescriptionComponent setImages={setImages} images={images} product={product} />
              <ProductImageComponent productImages={images} productName={product.productName} />
            </div>

            <div className=" space-y-2">
              <AccordionGroup
                sx={{
                  maxWidth: '100%',
                  [`& .${accordionSummaryClasses.indicator}`]: {
                    transition: '0.2s'
                  },
                  [`& [aria-expanded="true"] .${accordionSummaryClasses.indicator}`]: {
                    transform: 'rotate(45deg)'
                  }
                }}
              >
                <Accordion>
                  <AccordionSummary className="py-2 font-bold" indicator={<IoIosAdd className="h-7 w-7" />}>
                    Description
                  </AccordionSummary>
                  <AccordionDetails>
                    <div
                      className="product-description"
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(product.productDescription)
                      }}
                    ></div>
                  </AccordionDetails>
                </Accordion>
                <Accordion>
                  <AccordionSummary className="py-2 font-bold" indicator={<IoIosAdd className="h-7 w-7" />}>
                    Additional Information
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {product.additionalFieldProductValues?.map(item => (
                        <Fragment key={item.fieldName}>
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <h6 className="text-[13px] font-bold my-2">{item.fieldName}</h6>
                              {item.fieldValue.includes('<table') ? (
                                <span
                                  className="font-normal text-md text-base description-table"
                                  dangerouslySetInnerHTML={{
                                    __html: item.fieldValue
                                  }}
                                ></span>
                              ) : item.fieldValue ? (
                                <li
                                  className="text-[13px] font-light text-mute2"
                                  dangerouslySetInnerHTML={{
                                    __html: item.fieldValue
                                  }}
                                />
                              ) : (
                                <li className="font-normal text-md text-base text-mute">N/A</li>
                              )}
                            </div>
                            <div className="flex flex-col w-4">
                              <div className="flex-1 bg-mute4/10 h-full w-[2px]" />
                            </div>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </AccordionDetails>
                </Accordion>
              </AccordionGroup>
            </div>
          </>
        ) : (
          <div className="min-h-[42rem] w-full flex justify-center items-center">
            <CircularLoader />
          </div>
        )}
      </ModalDialog>
    </Modal>
  );
};
