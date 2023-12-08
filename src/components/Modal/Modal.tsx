import { createPortal } from "react-dom";
import { ModalBackdrop, ModalWindow } from "./Modal.styled";
import { FC, ReactElement, SyntheticEvent } from "react";

interface IModalState {
  children: ReactElement;
  handleBackdropClick: (e: SyntheticEvent) => void;
}

const Modal: FC<IModalState> = ({ children, handleBackdropClick }) => {
  const modalRoot = document.getElementById("portal") as HTMLElement;

  return createPortal(
    <ModalBackdrop id="backdrop" onClick={(e) => handleBackdropClick(e)}>
      <ModalWindow>{children}</ModalWindow>
    </ModalBackdrop>,
    modalRoot
  );
};

export default Modal;
