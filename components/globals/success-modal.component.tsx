import React, {Dispatch, FC, SetStateAction} from 'react';
import {Modal, ModalDialog} from '@mui/joy';
import {FiCheckCircle} from 'react-icons/fi';
import {BiSolidErrorCircle} from 'react-icons/bi';

interface ISuccessModal {
  open: string;
  onClose: Dispatch<SetStateAction<'success' | 'error' | ''>>;
  title: string;
  note: String;
}

export const SuccessModal: FC<ISuccessModal> = ({open, onClose, title, note}) => {
  const handleModalClose = () => {
    onClose('');
  };
  return (
    <Modal open={!!open} onClose={handleModalClose}>
      <ModalDialog>
        <div className="flex flex-col justify-center items-center gap-4">
          {open === 'success' ? (
            <>
              <h2 className="text-xl text-center font-bold">{title}</h2>
              <p className="text-base font-light text-center max-w-sm ">{note}</p>
            </>
          ) : open === 'error' ? (
            <h2>something went wrong , please try again later</h2>
          ) : null}
          <div className="flex justify-center items-center mt-2">
            {open === 'success' ? (
              <FiCheckCircle className="w-10 h-10 text-secondary" />
            ) : open === 'error' ? (
              <BiSolidErrorCircle className="w-10 h-10 text-red-600" />
            ) : null}
          </div>
          {/*<h2 className="text-lg font-semibold">In the meantime, you can</h2>*/}
          {/*<p className="text-sm text-center font-light">*/}
          {/*  Check our <u>Help Center</u> for FAQs and tutorials*/}
          {/*</p>*/}
          <button
            className="px-8 py-2 text-sm bg-primary-500 text-white font-bold rounded-full"
            onClick={handleModalClose}
          >
            Continue
          </button>
        </div>
      </ModalDialog>
    </Modal>
  );
};
