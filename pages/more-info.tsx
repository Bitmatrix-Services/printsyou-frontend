import React from 'react';
import Container from '@components/globals/Container';
import Image from 'next/image';

const data = {
  title: 'Promotional PopGrip Wood POPSockets',
  itemNumber: 'POP113',
  instruction: '',
  imageUrl: '/assets/list.jpg'
};

const MoreInfo = () => {
  return (
    <>
      <Container>
        <div className="px-8 pb-8 pt-10">
          <h2
            className={`text-3xl lg:text-4xl font-normal text-left md:mr-auto`}
          >
            <span className="text-[#303541] font-semibold">Request </span>
            <span className="text-[#303541] font-extrabold">More Info</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
            <div className="flex flex-col md:flex-row pt-3 gap-8 border-t-2">
              <div className="order-first ">
                <div className="md:pt-8">
                  <Image
                    sizes=""
                    style={{position: 'relative'}}
                    layout="resposive"
                    width={156}
                    height={156}
                    className="object-contain "
                    src={data.imageUrl}
                    alt="..."
                  />
                </div>
              </div>
              <div className=" pt-8">
                <div className="mb-8">
                  <h3 className="text-3xl mt-5 mb-8  font-semibold capitalize">
                    {data.title}
                  </h3>
                  <h6 className="text-sm font-semibold text-body">
                    ITEM#:{' '}
                    <span className="text-primary-500">{data.itemNumber}</span>
                  </h6>
                </div>

                <div className="mt-2 p-4 w-full bg-[#f6f7f8] rounded-xl">
                  <ul className="text-xs text-mute3 font-bold product-card__categories">
                    <li>
                      <span className="pt-[2px] block">
                        Please add <span className="text-red-500">$30.00</span>{' '}
                        Setup Fee
                      </span>
                    </li>
                    <li>
                      <span className="pt-[2px] block">
                        Please add <span className="text-red-500">$95.00</span>{' '}
                        Full Color Set Up Fee
                      </span>
                    </li>
                    <li>
                      <span className="pt-[2px] block">
                        Please add <span className="text-red-500">$0.65</span>{' '}
                        Full Color Imprint
                      </span>
                    </li>
                    <li>
                      <span className="pt-[2px] block">
                        Please add <span className="text-red-500">$0.25</span>{' '}
                        Additional Spot Color Imprint
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1">
              <div className="xs:flex md:grid ">
                <div className="w-full">
                  <input
                    className="block border w-full h-14 pl-4 rounded-sm text-sm focus:outline-none"
                    name="name"
                    placeholder="Full Name"
                    type="text"
                    required
                  />
                  <div className="flex flex-col md:flex-row justify-between md:space-x-4">
                    <input
                      className="block border my-6 w-full h-14 pl-4 pr-16 rounded-sm text-sm focus:outline-none"
                      type="text"
                      name="email"
                      placeholder="Email"
                    />
                    <input
                      className="block border mb-6 md:mb-0 md:my-6 w-full h-14 pl-4 pr-16 rounded-sm text-sm focus:outline-none"
                      type="text"
                      name="phone"
                      placeholder="Phone"
                    />
                  </div>
                  <input
                    className="block border w-full h-14 pl-4 pr-16 rounded-sm text-sm focus:outline-none"
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    required
                  />
                  <div className="my-6">
                    <textarea
                      className="p-4 block border w-full h-[200px] focus:outline-none resize-none"
                      placeholder="Message"
                      name="message"
                    />
                  </div>
                  <button className="w-fit hidden md:block py-6 px-32 text-sm  font-bold  bg-primary-500 hover:bg-body text-white">
                    SUBMIT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default MoreInfo;
