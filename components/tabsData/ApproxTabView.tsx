import React from 'react';

const dataArray = [
  {label: 'Fabric', value: 'Bio-washed Cotton'},
  {label: 'Pattern', value: 'Printed'},
  {label: 'Fit', value: 'Regular-fit'},
  {label: 'Neck', value: 'Round Neck'},
  {label: 'Sleeve', value: 'Half-sleeves'},
  {label: 'Style', value: 'Casual Wear'}
];

const ApproxTabView = () => {
  return (
    <div>
      <p className="text-xs leading-normal text-[#807D7E] font-normal">
        Lorem Ipsum dollar sit smit ameda lorem ipsum Lorem Ipsum dollar sit
        smit ameda lorem ipsumLorem Ipsum dollar sit smit ameda lorem ipsumLorem
        Ipsum dollar sit smit ameda lorem ipsum
      </p>
      <div className="mt-4 bg-[#F6F6F6] rounded-lg">
        <div className="grid grid-cols-2 sm:grid-cols-3 p-1">
          {dataArray.map((item, index) => (
            <div key={index} className="px-6 py-3 border border-gray-300">
              <h6 className="mb-1 text-[#807D7E] text-xs">{item.label}</h6>
              <p className="text-[#3C4242] text-xs">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApproxTabView;
