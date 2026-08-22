import {ButtonHTMLAttributes, FC} from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon' | 'tile';

// Only properties that are identical across every current call site of a variant
// live here - anything that legitimately varies per instance (padding, radius where
// it differs, color/selected-state logic) stays in that call site's own className.
const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed',
  secondary: 'rounded-lg border-2 border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed',
  ghost: 'rounded-lg text-gray-700 font-medium bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  icon: 'z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md border border-gray-200 text-primary-500 hover:bg-primary-500 hover:text-white transition-colors',
  tile: 'rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
};

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
}

export const Button: FC<IButton> = ({variant, className = '', type = 'button', children, ...props}) => (
  <button type={type} className={`${VARIANT_CLASSES[variant]} ${className}`.trim()} {...props}>
    {children}
  </button>
);
