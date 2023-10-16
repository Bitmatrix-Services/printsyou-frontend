import React, {ReactNode, SyntheticEvent, useState} from 'react';
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

interface TabPanelProps {
  children?: ReactNode;
  index: number;
  value: number;
}

const tabsList = [
  'Overview',
  'Artwork',
  'Ordering & Payments',
  'Shipping',
  'Terms & Conditions',
  'Testimonials'
];

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

export default function Artwork() {
  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <main>
      <PageHeader pageTitle="Additional information" />
      <section className="bg-grey">
        <div className="bg-white border-t border-b py-4">
          <Container>
            <Tabs
              value={value}
              onChange={handleChange}
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
          <CustomTabPanel value={value} index={0}>
            <OverviewArtworkSection setTabValue={setValue} />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <ArtworkSection />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <OrderingPaymentsSection />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <ShippingSection />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={4}>
            <TermsSection />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={5}>
            <TestimonialsSection />
          </CustomTabPanel>
        </div>
      </section>
    </main>
  );
}
