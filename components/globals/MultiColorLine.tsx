import React from "react";

const MultiColorLine = () => {
  return (
    <>
      <span className="hover:text-[#9a605c] hover:border-t-[#9a605c]" />
      <span className="hover:text-[#dd6c99] hover:border-t-[#dd6c99]" />
      <span className="hover:text-[#58c6f1] hover:border-t-[#58c6f1]" />

      <span className="hover:text-[#9a605c]  sm:hover:border-t-[#9a605c]" />
      <span className="hover:text-[#dd6c99]  sm:hover:border-t-[#dd6c99]" />
      <span className="hover:text-[#58c6f1]  sm:hover:border-t-[#58c6f1]" />

      {/* nav-links */}
      <span className="hover:text-[#dd6c99] after:bg-[#dd6c99]" />
      <span className="hover:text-[#58c6f1] after:bg-[#58c6f1]" />
      <span className="hover:text-[#8fc23f] after:bg-[#8fc23f]" />
      <span className="hover:text-[#9a605c] after:bg-[#9a605c]" />
      <span className="hover:text-[#1f8b95] after:bg-[#1f8b95]" />
      <span className="hover:text-[#b658a2] after:bg-[#b658a2]" />
    </>
  );
};

export default MultiColorLine;
