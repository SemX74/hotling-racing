import { useState } from "react";

export type ModalProps = ReturnType<typeof useModal>;

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  return { isOpen, onOpen, onClose };
};
