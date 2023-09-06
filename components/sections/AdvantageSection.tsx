import React from "react";
import Container from "../globals/Container";
import Link from "next/link";
import Image from "next/image";

const AdvantageSection = () => {
  return (
    <section className="bg-greyLight py-8 lg:py-20">
      <Container>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
          <h2 className="text-3xl lg:text-4xl font-normal capitalize text-center md:text-left md:mr-auto">
            The <strong className="font-extrabold">Identity-Links</strong>{" "}
            Advantage
          </h2>
          <Link
            className="hidden md:block py-6 px-20 text-xs tracking-[3.5px] font-bold btn-outline-1"
            href="!#"
          >
            VIEW MORE
          </Link>
        </div>
        {/* == */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <ul className="space-y-6">
            <li>
              <div className="text-base text-mute2 space-y-4">
                <p>
                  With over 40 years of experience, the Identity Links family
                  has proven time and again that we should be your first and
                  only choice for promotional products.
                </p>
                <p>
                  <strong className="text-body font-semibold">
                    Our customers trust us because we provide these advantages
                    over the competition:
                  </strong>
                </p>
              </div>
            </li>
            <li>
              <div className="box-bottom-link bg-white p-6 border border-[#e8eaee] border-t-2 border-t-[#fec34f] after:bg-[#fec34f]">
                <div className="mb-6 flex items-center gap-3">
                  <h4 className="text-xl md:text-2xl font-bold capitalize mr-auto line-clamp-1">
                    Family Owned
                  </h4>
                  <div className="h-12 w-12 relative">
                    <Image
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                      fill
                      src="/assets/icon-family-owned.png"
                      alt="..."
                    />
                  </div>
                </div>
                <div className="space-y-3 text-mute2">
                  <p>
                    Think bigger means better? Not at Identity Links. As a
                    family-owned company, everyone takes pride in our excellent
                    customer service and competitive pricing. In fact, our sales
                    representatives do not receive a commission, which means
                    that we can give you the most competitive promotional items
                    pricing in the industry!
                  </p>
                  <p>
                    When you choose Identity Links as your promotional products
                    source, you will get a personal dedicated sales
                    representative who will help you with all of your orders.
                    Whether you are ordering 100 pieces or 10,000 pieces, you
                    will get the same personalized attention that you deserve.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="box-bottom-link bg-white p-6 border border-[#e8eaee] border-t-2 border-t-[#cbdc5a] after:bg-[#cbdc5a]">
                <div className="mb-6 flex items-center gap-3">
                  <h4 className="text-xl md:text-2xl font-bold capitalize mr-auto line-clamp-1">
                    Product Selection
                  </h4>
                  <div className="h-12 w-12 relative">
                    <Image
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain"
                      fill
                      src="/assets/icon-product-selection.png"
                      alt="..."
                    />
                  </div>
                </div>
                <div className="space-y-3 text-mute2">
                  <p>
                    No matter what type of marketing campaign you are planning,
                    we have the promotional goods you need to make it
                    successful. With over 32,000 promotional products to choose
                    from on the Identity Links website, it is easy to find not
                    just one but several products that best represent your
                    company and customers.
                  </p>
                  <p>
                    Not sure where to start? Just ask one of our experienced
                    sales associates. From corporate apparel and executive gifts
                    to trade show swag and seminar tools, we have just the
                    promotional item you have been searching for. Don&apos;t
                    hesitate to ask for a free sample before you place your
                    order!
                  </p>
                </div>
              </div>
            </li>
          </ul>
          <div>
            <ul className="space-y-6">
              <li>
                <div className="box-bottom-link bg-white p-6 border border-[#e8eaee] border-t-2 border-t-[#8cd3ef] after:bg-[#8cd3ef]">
                  <div className="mb-6 flex items-center gap-3">
                    <h4 className="text-xl md:text-2xl font-bold capitalize mr-auto line-clamp-1">
                      Service and Reliability
                    </h4>
                    <div className="h-12 w-12 relative">
                      <Image
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                        fill
                        src="/assets/icon-service-and-reliability.png"
                        alt="..."
                      />
                    </div>
                  </div>
                  <div className="space-y-3 text-mute2">
                    <p>
                      When it comes to promotional products, our customers trust
                      Identity Links for providing them with the products they
                      need, when they need them, at a cost that will not break
                      your budget. We offer hundreds of items that can be rush
                      ordered, some of which can be printed and shipped out on
                      the same day! Once you place an order with us you can rest
                      assured that it will arrive on time. In fact, we offer a
                      100% money-back guarantee if your order does not arrive by
                      the date you have selected. Our staff works around the
                      clock when necessary to ensure that your order is placed
                      correctly and will arrive when you need it.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="box-bottom-link bg-white p-6 border border-[#e8eaee] border-t-2 border-t-[#e3482c] after:bg-[#e3482c]">
                  <div className="mb-6 flex items-center gap-3">
                    <h4 className="text-xl md:text-2xl font-bold capitalize mr-auto line-clamp-1">
                      Customer Satisfaction
                    </h4>
                    <div className="h-12 w-12 relative">
                      <Image
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain"
                        fill
                        src="/assets/icon-customer-satisfaction.png"
                        alt="..."
                      />
                    </div>
                  </div>
                  <div className="space-y-3 text-mute2">
                    <p>
                      Sure, we can rave all day about how great we are, but we
                      prefer to let our customers do the talking for us. Check
                      out{" "}
                      <Link
                        href="/"
                        className="text-body font-semibold hover:text-primary-500"
                      >
                        our testimonials page
                      </Link>{" "}
                      to see what satisfied customers have written about their
                      experience with Identity Links
                    </p>
                    <p>
                      While we are doing a little bragging, we should probably
                      go ahead and tell you that Identity Links has been honored
                      with multiple awards, including the Gold Pyramid Award and
                      the ASI Award for Top 40 Fastest Growing Distributor.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="text-base text-mute2 space-y-4">
                  <p>
                    With over 40 years of experience, the Identity Links family
                    has proven time and again that we should be your first and
                    only choice for promotional products.
                  </p>
                  <p>
                    <strong className="text-body font-semibold">
                      Thank you for considering Identity Links as your go-to
                      provider for premiere promotional products.
                    </strong>
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 mb-6 md:hidden text-center">
          <Link
            className="py-6 px-20 text-xs tracking-[3.5px] font-bold btn-outline-1"
            href="!#"
          >
            VIEW MORE
          </Link>
        </div>
      </Container>
    </section>
  );
};

export default AdvantageSection;
