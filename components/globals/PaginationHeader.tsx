import {ArrowLeftIcon, ArrowRightIcon} from '@heroicons/react/24/solid';
import React from 'react';

const PaginationHeader = () => {
  return (
    <div id="products-page">
      <div className="list-product">
        <div className="pagination-top paginations">
          <div className="sort-show leftpagnation flex items-center flex-col md:flex-row justify-center">
            <div className="select-sort flex flex-col sm:flex-row gap-4">
              <div className="item sort-by">
                <div className="name">Sort by</div>
                <div className="select">
                  <select name="theme4" className="custom_theme4 outline-none">
                    <option value="sort_type=lowcost">Price Low To High</option>
                    <option value="sort_type=highcost">
                      Price High To Low
                    </option>
                    <option value="sort_type=desc">Most Recent First</option>
                    <option value="sort_type=asc">Least Recent First</option>
                    <option value="sort_type=az">A to Z</option>
                    <option value="sort_type=za">Z to A</option>
                  </select>
                </div>
              </div>
              <div className="item show">
                <div className="name">Show</div>
                <div className="select">
                  <select name="theme5" className="custom_theme5 outline-none">
                    <option value="on_page=24" selected>
                      24
                    </option>
                    <option value="on_page=48">48</option>
                    <option value="viewall=1">All</option>
                  </select>
                </div>
                <div className="per">per page</div>
              </div>
            </div>
            <div className="paging flex gap-2">
              <button type="button" className="item prev">
                <ArrowLeftIcon className="h-4 w-4" />
              </button>
              <div className="numbers flex gap-2">
                <button type="button" className="item number is-active">
                  1
                </button>
                <button type="button" className="item number">
                  2
                </button>
                <button className="item number">3</button>
              </div>
              <button type="button" className="item next">
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginationHeader;
