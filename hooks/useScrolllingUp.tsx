import {useEffect, useState} from 'react';

export const useScrollingUp = () => {
  let prevScroll: number;
  //if it is SSR then check you are now on the client and window object is available
  if (process.browser) {
    prevScroll = window.pageYOffset;
  }
  const [scrollingUp, setScrollingUp] = useState(false);
  const [scrollValue, setScrollValue] = useState(0);

  const handleScroll = () => {
    const currScroll = window.pageYOffset;
    const isScrolled = prevScroll > currScroll;
    setScrollingUp(isScrolled);
    setScrollValue(currScroll);
    prevScroll = currScroll;
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, {passive: true});
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return {scrollingUp, scrollValue};
};
