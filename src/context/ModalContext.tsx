// React Modal Context
import { useState, createContext, useContext, ReactNode, FC, useEffect } from 'react';
import { ImCross } from 'react-icons/im';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps {
  hideModal: () => void;
  setOnHidden?: (onHidden: () => void) => void;
  setTitle?: (title: string) => void;
}

interface ShowModalOption {
  children: FC<ModalProps>;
  onHidden?: () => void;
  hideOnOverlayClick?: boolean;
  title?: string;
}

export type ModalContextType = {
  showModal: (props: ShowModalOption) => void;
  hideModal: () => void;
};

const ModalContext = createContext<ModalContextType>({
  showModal: () => console.log('openModal not yet initialized'),
  hideModal: () => console.log('closeModal not yet initialized'),
});

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalProps, setModalProps] = useState<ShowModalOption | undefined>(undefined);
  const [onHidden, setOnHidden] = useState<(() => void) | undefined>(undefined);
  const [title, setTitle] = useState<string | undefined>(undefined);

  const showModal = (props: ShowModalOption) => setModalProps(props);
  const hideModal = () => (setModalProps(undefined), onHidden?.(), setOnHidden(undefined), setTitle(undefined));

  useEffect(() => {
    if (modalProps?.onHidden) {
      setOnHidden(() => modalProps.onHidden);
    }

    if (modalProps?.title) {
      setTitle(modalProps.title);
    }
  }, [modalProps]);

  const setOnHiddenWrapper = (onHidden: () => void) => {
    setOnHidden(() => onHidden);
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <AnimatePresence>
        {modalProps && (
          <>
            {/* Overlay */}
            <motion.div
              className='fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm backdrop-filter'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => modalProps.hideOnOverlayClick && hideModal()}
            />
            {/* Modal */}
            <motion.div
              className='fixed inset-0 z-50 mx-auto flex flex-col items-center justify-center'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <div className='glass my-4 !w-max overflow-y-auto rounded-lg transition-[height] sm:container max-sm:max-w-[80vw] sm:mx-auto [@media_(max-height:_375px)]:max-h-[80vh]'>
                <button className='absolute right-4 top-2' onClick={() => hideModal()}>
                  <ImCross />
                </button>
                {title && <h1 className='text-center text-lg font-semibold'>{title}</h1>}
                <div className='overflow-y-auto'>
                  <modalProps.children hideModal={hideModal} setOnHidden={setOnHiddenWrapper} setTitle={setTitle} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};
