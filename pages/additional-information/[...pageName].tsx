import React, {FC, ReactNode, useEffect, useState} from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Container from '@components/globals/Container';
import ArtworkSection from '@components/sections/artwork/ArtworkSection';
import OrderingPaymentsSection from '@components/sections/artwork/OrderingPaymentsSection';
import ShippingSection from '@components/sections/artwork/ShippingSection';
import TermsSection from '@components/sections/artwork/TermsSection';
import TestimonialsSection from '@components/sections/artwork/TestimonialsSection';
import OverviewArtworkSection from '@components/sections/artwork/OverviewArtworkSection';
import PageHeader from '@components/globals/PageHeader';
import {NextSeo} from 'next-seo';
import {metaConstants, tabsList, tabUrls} from '@utils/Constants';
import PromotionalBlogs from '@components/sections/artwork/PromotionalBlogs';
import {http} from 'services/axios.service';
import {Blog} from '@utils/type';
import {useRouter} from 'next/router';
import getConfig from 'next/config';

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

interface ArtworkProps {
  allBlogs: Blog[];
}

function CustomTabPanel(props: TabPanelProps) {
  const {children, value, index, ...other} = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <div>{children}</div>}
    </div>
  );
}

const config = getConfig();

const Artwork: FC<ArtworkProps> = ({allBlogs}) => {
  const router = useRouter();

  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (router.query.pageName?.[0]) {
      let index = tabUrls.indexOf(router.query.pageName?.[0]);
      if (index === -1) {
        setValue(0);
      } else {
        setValue(index);
      }
    } else {
      setValue(0);
    }
  }, [router]);

  const sections = [
    {index: 0, component: <OverviewArtworkSection setTabValue={setValue} />},
    {index: 1, component: <ArtworkSection />},
    {index: 2, component: <OrderingPaymentsSection />},
    {index: 3, component: <ShippingSection />},
    {index: 4, component: <TermsSection />},
    {index: 5, component: <TestimonialsSection />},
    {index: 6, component: <PromotionalBlogs allBlogs={allBlogs} />}
  ];

  return (
    <>
      <NextSeo
        title={`${value === 0 ? 'Additional Information' : tabsList[value]} | ${
          metaConstants.SITE_NAME
        }`}
        canonical={`${config.publicRuntimeConfig.FE_URL}additional-information/${tabUrls[value]}`}
      />
      <PageHeader pageTitle={`Additional Information | ${tabsList[value]}`} />
      <section className="bg-grey">
        <div className="bg-white border-t border-b py-4">
          <Container>
            <Tabs
              value={value}
              onChange={(_, newValue) => {
                // setValue(newValue);
                router.push(
                  `/additional-information/${tabUrls[newValue]
                    .toLowerCase()
                    .replace(/\s+/g, '_')}`
                );
              }}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              className="tabs-styles"
            >
              {tabsList.map(tabItem => (
                <Tab
                  key={tabItem}
                  label={tabItem}
                  className="text-base font-poppins font-medium capitalize"
                />
              ))}
            </Tabs>
          </Container>
        </div>
        <div>
          {sections.map((section, idx) => (
            <CustomTabPanel key={idx} value={value} index={section.index}>
              {section.component}
            </CustomTabPanel>
          ))}
        </div>
      </section>
    </>
  );
};

export const getServerSideProps = async () => {
  try {
    const {data} = await http.get(`/blog/all`);
    const allBlogs = data.payload;
    return {props: {allBlogs}};
  } catch (error) {
    return {props: {allBlogs: []}};
  }
};

export default Artwork;
