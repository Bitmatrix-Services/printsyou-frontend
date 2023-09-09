import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@components/globals/Container';
import ArtworkSection from '@components/sections/about/ArtworkSection';
import OrderingPaymentsSection from '@components/sections/about/OrderingPaymentsSection';
import ShippingSection from '@components/sections/about/ShippingSection';
import TermsSection from '@components/sections/about/TermsSection';
import TestimonialsSection from '@components/sections/about/TestimonialsSection';
import OverviewArtworkSection from '@components/sections/about/OverviewArtworkSection';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
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
      {value === index && (
        <Box sx={{p: 3}}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Artwork() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <section className="bg-white py-8 lg:py-20">
      <Container>
        <div className="flex flex-wrap items-center gap-3 justify-center md:justify-start mb-6">
          <Box sx={{width: '100%'}}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                aria-label="scrollable auto tabs example"
              >
                <Tab label="Overview" className="text-xl" />
                <Tab label="Artwork" className="text-xl" />
                <Tab label="Ordering & Payments" className="text-xl" />
                <Tab label="Shipping" className="text-xl" />
                <Tab label="Terms & Conditions" className="text-xl" />
                <Tab label="Testimonials" className="text-xl" />
              </Tabs>
            </Box>
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
          </Box>
        </div>
      </Container>
    </section>
  );
}
