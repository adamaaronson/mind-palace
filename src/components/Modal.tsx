import { AnimatePresence, motion } from "motion/react";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export function Modal(props: ModalProps) {
  const { title, children, isOpen, onClose, className } = props;
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
          className={`absolute w-full h-full max-w-screen max-h-screen top-0 left-0 flex justify-center items-center z-50 p-4 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          <div
            className="absolute w-full h-full top-0 left-0 bg-light-light opacity-90 z-51"
            onClick={onClose}
          ></div>
          <div
            className={`bg-light border-standard min-w-0 z-52 relative inset-shadow-scroll m-4 ${className}`}
          >
            <div className="absolute top-0 w-[calc(100%+48px)] h-2 -left-6 bg-text-dark -translate-y-5 rounded-full"></div>
            <div className="absolute top-0 w-[calc(100%+24px)] h-4 -left-3 bg-text-dark -translate-y-6"></div>
            <div className="absolute top-0 w-[calc(100%+16px)] h-8 border-standard -left-2 bg-light -translate-y-full inset-shadow-glossy"></div>
            <div className="p-4 px-8 overflow-scroll max-h-[calc(100vh-64px)]">
              <motion.div
                key={Math.random()}
                initial={{ height: 0 }}
                animate={{ height: "auto" }}
                className="overflow-hidden"
              >
                <div className="font-bold text-3xl mb-4 font-classical text-center">
                  {title}
                </div>
                {children}
              </motion.div>
            </div>
            <div className="absolute top-full w-[calc(100%+48px)] h-2 -left-6 bg-text-dark translate-y-3 rounded-full"></div>
            <div className="absolute top-full w-[calc(100%+24px)] h-4 -left-3 bg-text-dark translate-y-2"></div>
            <div className="absolute top-full w-[calc(100%+16px)] h-8 border-standard -left-2 bg-light inset-shadow-glossy"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
