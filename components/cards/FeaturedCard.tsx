import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Dialog from "@mui/material/Dialog";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dynamic from "next/dynamic";
import lgZoom from "lightgallery/plugins/zoom";

// icons
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import CloseIcon from "@mui/icons-material/Close";

const LightGallery = dynamic(() => import("lightgallery/react"), {
  ssr: false,
});

const imageUrls = [
  "https://www.identity-links.com/img/ucart/images/pimage/147330/001.jpg",
  "https://www.identity-links.com/img/ucart/images/p_photo1665689014/147330/popup.jpg",
  "https://www.identity-links.com/img/ucart/images/p_photo1665689015/147330/popup.jpg",
  "https://www.identity-links.com/img/ucart/images/p_photo1665689016/147330/popup.jpg",
  "https://www.identity-links.com/img/ucart/images/p_photo1665689017/147330/popup.jpg",
];

export const FeaturedCard = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="tp-product group relative bg-white border border-[#edeff2]">
        <div className="p-6">
          <Link href="#!" className="block relative h-48 w-48 mx-auto group">
            <button
              onClick={handleOpen}
              type="button"
              className="h-[3.125rem] w-[3.125rem] bg-primary-500 hover:bg-body text-white bg-center bg-no-repeat transition-all duration-300 absolute z-20 top-0 left-0 opacity-0 group-hover:opacity-100"
              style={{
                backgroundImage: 'url("/assets/icon-search-white.png")',
                backgroundSize: "24px auto",
              }}
            />

            <Image
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              fill
              className="object-contain"
              src="https://www.identity-links.com/img/ucart/images/pimage/147330/main.jpg"
              alt="..."
            />
          </Link>
          <Link href="#!" className="block mt-4 text-xl font-extrabold">
            PopGrip Wood POPSockets
          </Link>
        </div>
        <div className="border-t border-[#edeff2] flex">
          <div className="py-2 flex-1 flex gap-3 items-center px-6 group-hover:bg-primary-500 group-hover:text-white">
            <div className="as-low text-xs font-semibold mr-auto">
              AS LOW AS
            </div>
            <div className="prive-value flex items-end gap-1">
              <div className="deno font-semibold text-xl">$</div>
              <div className="value font-semibold text-3xl font-oswald">
                <span className="sale">11.65</span>
              </div>
            </div>
          </div>
          <Link
            href="#!"
            className="h-16 w-16 flex items-center justify-center bg-white group-hover:bg-black group-hover:border-black group-hover:text-white border-l border-[#edeff2]"
          >
            <ShoppingBagIcon className="h-7 w-7" />
          </Link>
        </div>
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: "rounded-none min-w-[95%] xl:min-w-[62.5rem]" }}
      >
        <div className="p-3 mb-3 text-end">
          <button type="button" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="px-8 pb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <figure>
              <div className="max-w-sm">
                <h6 className="mb-2 text-sm font-semibold text-body">
                  ITEM#: <span className="text-primary-500">POP113</span>
                </h6>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold capitalize">
                  Promotional PopGrip Wood POPSockets
                </h3>
              </div>
              <div className="mt-4 overflow-auto">
                <table className="w-full">
                  <tbody>
                    <tr className="one">
                      <td className="headcell">50</td>
                      <td className="headcell">100</td>
                      <td className="headcell">500</td>
                      <td className="headcell">1000</td>
                    </tr>
                    <tr className="two">
                      <td className="pricecell">
                        <div className="prive-value flex items-end gap-1">
                          <div className="deno font-semibold text-xl">$</div>
                          <div className="value font-semibold text-3xl font-oswald">
                            <span className="sale">11.65</span>
                          </div>
                        </div>
                      </td>
                      <td className="pricecell">
                        <div className="prive-value flex items-end gap-1">
                          <div className="deno font-semibold text-xl">$</div>
                          <div className="value font-semibold text-3xl font-oswald">
                            <span className="sale">11.82</span>
                          </div>
                        </div>
                      </td>
                      <td className="pricecell">
                        <div className="prive-value flex items-end gap-1">
                          <div className="deno font-semibold text-xl">$</div>
                          <div className="value font-semibold text-3xl font-oswald">
                            <span className="sale">11.73</span>
                          </div>
                        </div>
                      </td>
                      <td className="pricecell">
                        <div className="prive-value flex items-end gap-1">
                          <div className="deno font-semibold text-xl">$</div>
                          <div className="value font-semibold text-3xl font-oswald">
                            <span className="sale">11.65</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 p-4 w-full bg-greyLight rounded-xl">
                <ul className="text-xs text-mute3 font-bold product-card__categories">
                  <li>
                    <span className="pt-[2px] block">
                      Please add <span className="text-red-500">$30.00</span>{" "}
                      Setup Fee
                    </span>
                  </li>
                  <li>
                    <span className="pt-[2px] block">
                      Please add <span className="text-red-500">$95.00</span>{" "}
                      Full Color Set Up Fee
                    </span>
                  </li>
                  <li>
                    <span className="pt-[2px] block">
                      Please add <span className="text-red-500">$0.65</span>{" "}
                      Full Color Imprint
                    </span>
                  </li>
                  <li>
                    <span className="pt-[2px] block">
                      Please add <span className="text-red-500">$0.25</span>{" "}
                      Additional Spot Color Imprint
                    </span>
                  </li>
                </ul>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link
                  href="#!"
                  className="block w-full text-center py-5 px-8 text-white bg-primary-500 hover:bg-body border border-[#eaeaec] text-sm font-bold"
                >
                  PLACE ORDER
                </Link>
                <Link
                  href="#!"
                  className="block w-full text-center py-5 px-8 text-body bg-white hover:bg-body hover:text-white border border-[#eaeaec] text-sm font-bold"
                >
                  REQUEST MORE INFO
                </Link>
              </div>
            </figure>
            <figure className="order-first lg:order-last">
              <div>
                <LightGallery mode="lg-fade" plugins={[lgZoom]}>
                  <a className="cursor-pointer" data-src={imageUrls[0]}>
                    <span className="block relative aspect-square">
                      <Image
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        fill
                        className="object-contain"
                        src={imageUrls[0]}
                        alt={`big image`}
                      />
                    </span>
                  </a>
                </LightGallery>
              </div>
              <div className="gallery-container">
                <LightGallery mode="lg-fade" plugins={[lgZoom]}>
                  {imageUrls.map((imageUrl, index) => (
                    <a
                      key={index}
                      className="gallery-item cursor-pointer min-w-[6.25rem] w-[6.25rem] h-[6.25rem]"
                      data-src={imageUrl}
                    >
                      <span className="block relative aspect-square border border-[#eceef1]">
                        <Image
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          fill
                          className="object-contain"
                          src={imageUrl}
                          alt={`gallery-image-${index}`}
                        />
                      </span>
                    </a>
                  ))}
                </LightGallery>
              </div>
            </figure>
          </div>
          {/*  Accordion */}
          <div className="mt-6">
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <h4 className="text-xl font-bold capitalize">Description</h4>
              </AccordionSummary>
              <AccordionDetails>
                <div>
                  <ul className="text-sm space-y-1 pl-5 list-disc marker:text-[#febe40] marker:text-lg">
                    <li>
                      Get on the latest trend bandwagon with our custom printed
                      PopGrip Wood&nbsp;POPSockets!
                    </li>
                    <li>
                      Our PopGrip Wood sticks flat to the back of your phone,
                      tablet or case with its easy to rinse and repositional
                      gel.&nbsp;
                    </li>
                    <li>
                      Once extended, the&nbsp;PopGrip Wood becomes a media stand
                      for your device, a photo or texting grip, or simply lower
                      it for a video chat.
                    </li>
                    <li>
                      This item can be used on the back of any brand
                      phone.&nbsp;
                    </li>
                    <li>
                      Available in Bamboo and Rosewood, the unique wood finish
                      lends perfectly to a classic laser engraving
                    </li>
                    <li>
                      Custom PopGrip Backer Cards available at an addition cost.
                      Call for additional pricing.{" "}
                    </li>
                  </ul>
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <h4 className="text-xl font-bold capitalize">
                  Additional Information
                </h4>
              </AccordionSummary>
              <AccordionDetails>
                <div className="overflow-auto">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="label">
                          <b className="brown">Approximate Size: </b>
                        </td>
                        <td>
                          Expanded: 1.53&quot; x 1.53&quot; x 0.9&quot; <br />
                          Collapsed: 1.53&quot; x 1.53&quot; x 0.26&quot;
                        </td>
                      </tr>
                      <tr>
                        <td className="label">
                          <b className="brown">Colors Available: </b>
                        </td>
                        <td>Bamboo, Rosewood</td>
                      </tr>

                      <tr>
                        <td className="label">
                          <b className="brown">Imprint Area: </b>
                        </td>
                        <td>1.3&quot; Diameter</td>
                      </tr>
                      <tr>
                        <td className="label">
                          <b className="brown">Price Includes: </b>
                        </td>
                        <td>One Location Laser Engrave</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </div>
      </Dialog>
    </>
  );
};
