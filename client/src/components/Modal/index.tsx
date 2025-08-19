import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header";
import { X } from "lucide-react";

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
};

const Modal = ({ children, isOpen, onClose, name }: ModalProps) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-y-auto bg-gray-600/50 p-4">
      <div className="dark:bg-dark-secondary w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg">
        <Header
          name={name}
          buttonComponent={
            <button
              className="bg-blue-primary flex h-7 w-7 items-center justify-center rounded-full text-white hover:bg-blue-600"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          }
          isSmallText
        />
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
