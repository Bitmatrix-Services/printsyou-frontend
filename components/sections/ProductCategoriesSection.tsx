import React, {useState} from 'react';
import Container from '@components/globals/Container';
import ProductTabView from '@components/tabsData/ProductTabView';

const ProductCategoriesSection = () => {
  const [activeTab, setActiveTab] = useState('Bags and Apparels');

  const handleTabClick = (tab: React.SetStateAction<string>) => {
    setActiveTab(tab);
  };

  return (
    <section className="bg-grey pt-14 pb-8 lg:pb-20">
      <Container>
        <div className="mb-12 border-b-2 border-[#eee] flex flex-wrap gap-6">
          <h2 className="text-headingColor text-xl font-normal uppercase after:mt-3 lg:after:mt-7 after:block atfer:w-full after:h-1 after:bg-primary-500 mr-auto">
            PRODUCT CATEGORIES
          </h2>
          <div className="flex flex-wrap gap-5 pb-5">
            {[
              'Bags and Apparels',
              'Calendars',
              'Pet Items',
              'Drinkware',
              'Outdoor',
              'Technology and Mobile',
              'Writing'
            ].map(tab => (
              <button
                key={tab}
                className={`tab-link ${activeTab === tab ? 'active' : ''}`}
                type="button"
                onClick={() => handleTabClick(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div>
          {activeTab === 'Bags and Apparels' && <ProductTabView />}
          {activeTab === 'Calendars' && <ProductTabView />}
          {activeTab === 'Pet Items' && <ProductTabView />}
          {activeTab === 'Drinkware' && <ProductTabView />}
          {activeTab === 'Outdoor' && <ProductTabView />}
          {activeTab === 'Technology and Mobile' && <ProductTabView />}
          {activeTab === 'Writing' && <ProductTabView />}
        </div>
      </Container>
    </section>
  );
};

export default ProductCategoriesSection;
