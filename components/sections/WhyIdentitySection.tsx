import React from "react";
import IdentityCard from "../cards/IdentityCard";
import Container from "../globals/Container";
import Link from "next/link";

const identityitems = [
  {
    image: "/assets/icon-identity-links-1.png",
    heading: "In-House embroidery and art department",
  },
  {
    image: "/assets/icon-identity-links-2.png",
    heading: "Exclusive promotional products",
  },
  {
    image: "/assets/icon-identity-links-3.png",
    heading: "35 years in the business",
  },
  {
    image: "/assets/icon-identity-links-4.png",
    heading: "Trained Product Service Specialists",
  },
  {
    image: "/assets/icon-identity-links-5.png",
    heading: "Offices in Chicago, Miami, Houston and Denver",
  },
  {
    image: "/assets/icon-identity-links-6.png",
    heading: "35 years in the business",
  },
];

const WhyIdentitySection = () => {
  return (
    <section className="w-full bg-secondary bg-center bg-wave xl:flex justify-center items-center pt-20 pb-24">
      <Container>
        <div className="lg:flex justify-center items-center gap-12 text-center lg:text-left">
          <div className="text-white lg:max-w-md xl:text-left lg:text-center mb-20 lg:mb-0">
            <h1 className="text-3xl md:text-4xl mb-10">
              Why <span className="font-bold">Identity Links?</span>
            </h1>
            <div className="text-base text-light space-y-8">
              <p>
                Welcome to the Identity Links website. My name is Mark Siegel,
                President of Identity-Links, and always just a phone call away.
                We&apos;re a family business dedicated to converting customers
                into long term clients.
              </p>
              <p>
                Please take a look at the following reasons why I encourage you
                to trust us with your order.
              </p>
            </div>

            <div className="mt-16">
              <Link
                href="!#"
                className="py-6 px-20 text-xs tracking-[3.5px] font-bold btn-outline-2"
              >
                READ MORE
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {identityitems.map((items, index) => {
              return (
                <IdentityCard
                  key={index}
                  image={items.image}
                  heading={items.heading}
                />
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default WhyIdentitySection;
