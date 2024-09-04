import {NavDropdownListComponent} from '@components/globals/nav-dropdown-list.component';
import {Category} from '@components/home/home.types';
import {FC} from 'react';

interface INavComponentProps {
  categories: Category[];
}

export const NavComponent: FC<INavComponentProps> = ({categories}) => {
  return (
    <div className="w-full max-w-[120rem] mx-auto px-4 md:px-[9rem] lg:px-[12rem] xl:px-[14rem] relative">
      <nav className="hidden lg:flex">
        <ul className="w-full flex flex-wrap gap-4 mx-5 my-5 justify-between">
          {(categories?.slice(0, 7) ?? []).map(category => (
            <li key={category.id}>
              <NavDropdownListComponent category={category} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};
