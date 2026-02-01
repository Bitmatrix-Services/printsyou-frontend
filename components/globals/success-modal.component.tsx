import React, {Dispatch, FC, SetStateAction} from 'react';
import {Modal, ModalDialog} from '@mui/joy';
import {useEffect} from 'react';
import {FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimesCircle} from 'react-icons/fa';

interface ISuccessModal {
  open: string;
  onClose: Dispatch<SetStateAction<'success' | 'error' | 'warning' | 'info' | ''>>;
  title: string;
  note?: string;
  htmlNote?: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export const SuccessModal: FC<ISuccessModal> = ({
  open,
  onClose,
  title,
  note,
  htmlNote,
  buttonText,
  onButtonClick
}) => {
  const handleModalClose = () => {
    if (onButtonClick) {
      onButtonClick();
    }
    onClose('');
  };

  useEffect(() => {
    if (open === 'success' && typeof (window as any).gtag_report_conversion === 'function') {
      (window as any).gtag_report_conversion();
    }
  }, [open]);

  const getIconAndColors = () => {
    switch (open) {
      case 'success':
        return {
          icon: <FaCheckCircle className="w-16 h-16" />,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-500',
          buttonBg: 'bg-green-600 hover:bg-green-700',
          borderColor: 'border-green-200'
        };
      case 'error':
        return {
          icon: <FaTimesCircle className="w-16 h-16" />,
          iconBg: 'bg-red-100',
          iconColor: 'text-red-500',
          buttonBg: 'bg-red-600 hover:bg-red-700',
          borderColor: 'border-red-200'
        };
      case 'warning':
        return {
          icon: <FaExclamationCircle className="w-16 h-16" />,
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-500',
          buttonBg: 'bg-orange-600 hover:bg-orange-700',
          borderColor: 'border-orange-200'
        };
      case 'info':
        return {
          icon: <FaInfoCircle className="w-16 h-16" />,
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-500',
          buttonBg: 'bg-blue-600 hover:bg-blue-700',
          borderColor: 'border-blue-200'
        };
      default:
        return {
          icon: <FaCheckCircle className="w-16 h-16" />,
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-500',
          buttonBg: 'bg-gray-600 hover:bg-gray-700',
          borderColor: 'border-gray-200'
        };
    }
  };

  const {icon, iconBg, iconColor, buttonBg, borderColor} = getIconAndColors();

  return (
    <Modal open={!!open} onClose={handleModalClose}>
      <ModalDialog
        sx={{
          height: 'auto',
          width: '90%',
          maxWidth: '28rem',
          margin: 'auto',
          padding: 0,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          '@media (max-width: 600px)': {
            width: '95%',
            maxWidth: '95%'
          }
        }}
      >
        <div className="flex flex-col">
          {/* Icon Section */}
          <div className={`${iconBg} py-8 flex justify-center items-center`}>
            <div className={`${iconColor} animate-scale-in`}>
              {icon}
            </div>
          </div>

          {/* Content Section */}
          <div className="px-6 py-6 bg-white">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              {title}
            </h2>

            {note && (
              <p className="text-gray-600 text-center leading-relaxed mb-6">
                {note}
              </p>
            )}

            {htmlNote && (
              <div
                className="text-gray-600 text-center leading-relaxed mb-6"
                dangerouslySetInnerHTML={{__html: htmlNote}}
              />
            )}

            {/* Button */}
            <button
              className={`w-full py-3 px-6 ${buttonBg} text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg`}
              onClick={handleModalClose}
            >
              {buttonText || 'Continue'}
            </button>
          </div>
        </div>
      </ModalDialog>
    </Modal>
  );
};
