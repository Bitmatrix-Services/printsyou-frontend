import React, {FC, forwardRef} from 'react';
import {Popper} from '@mui/base/Popper';
import {ClickAwayListener} from '@mui/base/ClickAwayListener';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Link from 'next/link';
import Image from 'next/image';
import {Category} from '@components/home/home.types';
import {v4 as uuidv4} from 'uuid';

type Options = {
  initialActiveIndex: null | number;
  vertical: boolean;
  handlers?: {
    onKeyDown: (
      _: React.KeyboardEvent<HTMLAnchorElement>,
      __: {
        setActiveIndex: React.Dispatch<React.SetStateAction<number | null>>;
      }
    ) => void;
  };
};

const useRovingIndex = (options?: Options) => {
  const {
    initialActiveIndex = 0,
    vertical = false,
    handlers = {
      onKeyDown: () => {}
    }
  } = options || {};
  const [activeIndex, setActiveIndex] = React.useState<number | null>(initialActiveIndex!);
  const targetRefs = React.useRef<Array<HTMLAnchorElement>>([]);
  const targets = targetRefs.current;
  const focusNext = () => {
    let newIndex = activeIndex! + 1;
    if (newIndex >= targets.length) {
      newIndex = 0;
    }
    targets[newIndex]?.focus();
    setActiveIndex(newIndex);
  };
  const focusPrevious = () => {
    let newIndex = activeIndex! - 1;
    if (newIndex < 0) {
      newIndex = targets.length - 1;
    }
    targets[newIndex]?.focus();
    setActiveIndex(newIndex);
  };
  const getTargetProps = (index: number) => ({
    ref: (ref: HTMLAnchorElement) => {
      if (ref) {
        targets[index] = ref;
      }
    },
    tabIndex: activeIndex === index ? 0 : -1,
    onKeyDown: (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (Number.isInteger(activeIndex)) {
        if (e.key === (vertical ? 'ArrowDown' : 'ArrowRight')) {
          focusNext();
        }
        if (e.key === (vertical ? 'ArrowUp' : 'ArrowLeft')) {
          focusPrevious();
        }
        handlers.onKeyDown?.(e, {setActiveIndex});
      }
    },
    onClick: () => {
      setActiveIndex(index);
    }
  });
  return {
    activeIndex,
    setActiveIndex,
    targets,
    getTargetProps,
    focusNext,
    focusPrevious
  };
};

type MenuItemProps = {
  data: Category;
  focusNext: () => void;
  focusPrevious: () => void;
  onMouseEnter?: (_?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
  onKeyDown?: (_: React.KeyboardEvent<HTMLAnchorElement>) => void;
};

const MenuItem = forwardRef(
  ({focusNext, focusPrevious, data, ...props}: MenuItemProps, ref: React.ForwardedRef<HTMLAnchorElement>) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLAnchorElement | null>(null);
    const {targets, setActiveIndex} = useRovingIndex({
      initialActiveIndex: null,
      vertical: true,
      handlers: {
        onKeyDown: (event, fns) => {
          if (event.key.match(/(ArrowDown|ArrowUp|ArrowLeft|ArrowRight)/)) {
            event.preventDefault();
          }
          if (event.key === 'Tab') {
            setAnchorEl(null);
            fns.setActiveIndex(null);
          }
          if (event.key === 'ArrowLeft') {
            setAnchorEl(null);
            focusPrevious();
          }
          if (event.key === 'ArrowRight') {
            setAnchorEl(null);
            focusNext();
          }
        }
      }
    });

    const open = Boolean(anchorEl);
    const id = open ? 'about-popper' : undefined;
    return (
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <div onMouseLeave={() => setAnchorEl(null)}>
          <ListItemButton
            aria-haspopup
            aria-expanded={open ? 'true' : 'false'}
            ref={ref}
            {...props}
            role="menuitem"
            onKeyDown={event => {
              props.onKeyDown?.(event);
              if (event.key.match(/(ArrowLeft|ArrowRight|Tab)/)) {
                setAnchorEl(null);
              }
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                targets[0]?.focus();
                setActiveIndex(0);
              }
            }}
            onFocus={event => setAnchorEl(event.currentTarget)}
            onMouseEnter={event => {
              props.onMouseEnter?.(event);
              setAnchorEl(event.currentTarget);
            }}
            sx={{
              backgroundColor: 'transparent', // Replace with theme.palette.background.default
              transition: 'background-color 0.3s ease, color 0.3s ease',
              borderRadius: '0px',
              color: '#74768F',

              '&:hover': {
                color: '#FFF !important',
                backgroundColor: '#DB04818C !important' // Replace with theme.palette.action.hover
              },

              ...(open && {
                backgroundColor: '#DB04818C', // Use your main color with alpha for the background
                color: '#FFF' // Set to white or another contrasting color
              }),

              '&[role="menuitem"]': {
                fontWeight: 500 // Replace with theme.typography.fontWeightMedium
              }
            }}
          >
            <Link
              href={`/categories/${data.uniqueCategoryName}`}
              className="font-light capitalize"
              onClick={() => setAnchorEl(null)}
            >
              {data.categoryName}
            </Link>
          </ListItemButton>
          <Popper
            id={id}
            open={open}
            anchorEl={anchorEl}
            disablePortal
            keepMounted
            style={{backgroundColor: '#FFF', zIndex: 1000}}
          >
            <List
              role="menu"
              aria-label="About"
              variant="outlined"
              sx={{
                width: '100%',
                minWidth: '100vw',
                maxHeight: '22rem',
                minHeight: '20rem',
                zIndex: 99999,
                my: 0,
                boxShadow: 'sm',
                borderRadius: 'none',
                border: 'none',

                '--List-radius': '0px',
                '--List-padding': '30px',
                '--ListDivider-gap': '4px',
                '--ListItemDecorator-size': '32px',
                '--ListItem-minHeight': '3rem'
              }}
            >
              <div className="w-full max-w-[120rem] mx-auto px-4 pt-4 md:px-8 xl:px-12 relative">
                <div className="flex gap-4">
                  <div className="flex-1 columns-2 xl:columns-6 space-y-8">
                    {(data.subCategories ?? []).map(subCategory => (
                      <div key={uuidv4()}>
                        <Link
                          href={`/categories/${subCategory.uniqueCategoryName}`}
                          className="block text-sm text-mute hover:text-secondary-500 transition-all duration-150 capitalize"
                        >
                          {subCategory.categoryName}
                        </Link>
                      </div>
                    ))}
                  </div>

                  <div className="xl:self-center align-middle">
                    <Image objectFit="contain" height={3500} width={350} src="/assets/logo-full.png" alt="category" />
                  </div>
                </div>
              </div>
            </List>
          </Popper>
        </div>
      </ClickAwayListener>
    );
  }
);

MenuItem.displayName = 'MenuItem';

interface INavDropdownListComponentProps {
  category: Category;
}

export const NavDropdownListComponent: FC<INavDropdownListComponentProps> = ({category}) => {
  const {targets, getTargetProps, setActiveIndex, focusNext, focusPrevious} = useRovingIndex();
  return (
    <Box>
      <List
        role="menubar"
        orientation="horizontal"
        sx={{
          '--List-radius': '8px',
          '--List-padding': '4px',
          '--List-gap': '8px',
          '--ListItem-gap': '0px'
        }}
      >
        <ListItem role="none">
          <MenuItem
            data={category}
            onMouseEnter={() => {
              setActiveIndex(1);
              targets[1].focus();
            }}
            focusNext={focusNext}
            focusPrevious={focusPrevious}
            {...getTargetProps(1)}
          />
        </ListItem>
      </List>
    </Box>
  );
};
