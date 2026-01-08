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
        className="fixed w-full h-full top-0 left-0 bg-light-light opacity-90 z-51"
        onClick={onClose}
      ></div>
      <div
        className={`bg-light border-standard p-4 px-8 min-w-0 z-52 relative inset-shadow-scroll ${className}`}
      >
        <div className="absolute top-0 w-[calc(100%+40px)] h-2 -left-5 bg-text-dark -translate-y-5 rounded-full"></div>
        <div className="absolute top-0 w-[calc(100%+24px)] h-4 -left-3 bg-text-dark -translate-y-6"></div>
        <div className="absolute top-0 w-[calc(100%+16px)] h-8 border-standard -left-2 bg-light -translate-y-full inset-shadow-glossy"></div>
        <div className="font-bold text-2xl mb-4">{title}</div>
        {children}
        <div className="absolute top-full w-[calc(100%+40px)] h-2 -left-5 bg-text-dark translate-y-3 rounded-full"></div>
        <div className="absolute top-full w-[calc(100%+24px)] h-4 -left-3 bg-text-dark translate-y-2"></div>
        <div className="absolute top-full w-[calc(100%+16px)] h-8 border-standard -left-2 bg-light inset-shadow-glossy"></div>
      </div>
    </div>
  );
}
