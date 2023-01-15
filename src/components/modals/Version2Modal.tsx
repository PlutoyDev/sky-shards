import { useEffect, useState } from 'react';
import { BsX } from 'react-icons/bs';
import Modal from 'react-modal';

export default function Version2Modal() {
  const [isOpen, setIsOpen] = useState(false);
  const onModalClose = () => {
    setIsOpen(false);
    localStorage.setItem('v2FullModalShown', 'true');
  };

  useEffect(() => {
    if (import.meta.env.DEV) {
      setIsOpen(true);
    }
    if (localStorage.getItem('v2FullModalShown') === null) {
      setIsOpen(true);
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onModalClose}
      className='modal'
      overlayClassName='modal-overlay'
      ariaHideApp={false}
    >
      <div className='modal-header'>
        <h2 className='modal-title'>V2.0 Released</h2>
        <button className='modal-close' onClick={onModalClose}>
          <BsX />
        </button>
      </div>
      <div className='modal-content'>
        <p>
          <strong className='text-xl'>Hello SkyKids</strong>, Plutoy here.
        </p>
        &nbsp;
        <p>I&apos;m happy to announce that Sky Shards V2(.2) is officially out of beta.</p>
        <p>With that said, only major release like V2 will get this kind of pop-up message</p>
        <p>There will be an &quot;animations, details and guides&quot; (V2.3) update soon</p>
        &nbsp;
        <p>
          <span className='text-lg font-extrabold'>Thank you</span>
          <span> to early testers, especially, to those who write in feedback.</span>
        </p>
        &nbsp;
        <p>Feel free to shoot me with any feedback / bugs that you find,</p>
        <p>my socials can be found at the bottom of the page</p>
        &nbsp; &nbsp;
        <p>
          <strong>Plutoy,</strong>
        </p>
        <p>Developer of Sky Shards.</p>
      </div>
    </Modal>
  );
}
