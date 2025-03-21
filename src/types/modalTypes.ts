export type ModalProps = {
  open: boolean;
  onClose: (open: boolean) => void;
  children?: React.ReactNode;
};
