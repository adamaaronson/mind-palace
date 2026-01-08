interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
}

export function Modal(props: ModalProps) {
  const { title, children, onClose, className } = props;
  return (
    <div className="fixed w-full h-full top-0 left-0 flex justify-center items-center z-50 p-4">
      <div
        className="fixed w-full h-full top-0 left-0 bg-light opacity-50 z-51"
        onClick={onClose}
      ></div>
      <div
        className={`bg-light border-standard p-4 px-8 min-w-0 z-52 ${className}`}
      >
        <div className="font-bold text-2xl mb-4">{title}</div>
        {children}
      </div>
    </div>
  );
}
