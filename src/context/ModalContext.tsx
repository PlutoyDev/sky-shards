// React Modal Context
import { useState, createContext, useContext, ReactNode, FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ModalProps {
  hideModal: () => void;
}

interface ShowModalOption {
  children: FC<ModalProps>;
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

  const showModal = (props: ShowModalOption) => setModalProps(props);
  const hideModal = () => setModalProps(undefined);

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <AnimatePresence>
        {modalProps && (
          <>
            {/* Overlay */}
            <motion.div
              className='fixed inset-0 z-50 bg-black bg-opacity-50'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={hideModal}
            />
            {/* Modal */}
            <motion.div
              className='fixed inset-0 z-50 flex flex-col items-center justify-center'
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
            >
              <modalProps.children hideModal={hideModal} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
};
