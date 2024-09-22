'use client';
import React from 'react';
import {DialogContent, Drawer} from '@mui/joy';
import Image from 'next/image';
import {CartSection} from '@components/globals/cart/cart-section.component';
import {selectSidebarCartOpen, setSidebarCartOpen} from '../../../store/slices/cart/cart.slice';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {WishlistSection} from './wishlist-section.component';

export const SidebarCart = () => {
  const dispatch = useAppDispatch();
  const sidebarCartOpen = useAppSelector(selectSidebarCartOpen);

  return (
    <Drawer anchor={'right'} open={sidebarCartOpen} onClose={() => dispatch(setSidebarCartOpen(false))} size="sm">
      <div className="px-4 py-4 md:px-8 md:py-8 relative">
        <div className="relative flex justify-center items-center">
          <Image width={180} height={35} className=" object-contain" src="/assets/logo-full.png" alt="logo" />
        </div>
        <DialogContent>
          <div className="mt-8">
            <CartSection />

            <WishlistSection />
          </div>
        </DialogContent>
      </div>
    </Drawer>
  );
};
