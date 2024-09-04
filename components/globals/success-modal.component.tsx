import React, {Dispatch, FC, SetStateAction} from 'react';
import {Modal, ModalDialog} from '@mui/joy';
import {FiCheckCircle} from 'react-icons/fi';

interface ISuccessModal {
  open: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
  title: string;
  note: String;
}

export const SuccessModal: FC<ISuccessModal> = ({open, onClose, title, note}) => {
  const handleModalClose = () => {
    onClose(false);
  };
  return (
    <Modal open={open} onClose={handleModalClose}>
      <ModalDialog>
        <div className="flex flex-col justify-center items-center gap-4">
          <h2 className="text-xl text-center font-bold">{title}</h2>
          <p className="text-base font-light text-center max-w-sm ">{note}</p>
          <div className="flex justify-center items-center mt-2">
            <FiCheckCircle className="w-10 h-10 text-secondary" />
          </div>
          <h2 className="text-lg font-semibold">In the meantime, you can</h2>
          <p className="text-sm text-center font-light">
            Check our <u>Help Center</u> for FAQs and tutorials
          </p>
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
