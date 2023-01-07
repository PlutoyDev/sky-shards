import { useEffect, useState } from 'react';
import { BsX } from 'react-icons/bs';
import Modal from 'react-modal';

export default function Version2Modal() {
  const [isOpen, setIsOpen] = useState(false);
  //Set cookies nf_ab to production
  const onOptOut = () => {
    document.cookie = 'nf_ab=production; path=/';
    location.reload();
  };

  useEffect(() => {
    if (import.meta.env.DEV) {
      setIsOpen(true);
    } else if (localStorage.getItem('v2ModalShown') === null) {
      setIsOpen(true);
    }
  }, []);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => {
        setIsOpen(false);
        localStorage.setItem('v2ModalShown', 'true');
      }}
      className='modal'
      overlayClassName='modal-overlay'
      ariaHideApp={false}
    >
      <div className='modal-header'>
        <h2 className='modal-title'>V2.0 Beta</h2>
        <button className='modal-close' onClick={() => setIsOpen(false)}>
          <BsX />
        </button>
      </div>
      <div className='modal-content'>
        <p>
          <strong>Hello SkyKids</strong>, Plutoy here.
        </p>
        &nbsp;
        <p>You have been randomly selected to help me test the new version of Sky Shards.</p>
        <p>
          <span>Click </span>
          <span id='OptOut' onClick={onOptOut}>
            here
          </span>
          <span> to opt-out </span>
          <span>(Note: By opting-out, You will not be able to come back to this version, until full release)</span>
        </p>
        &nbsp;
        <p>The site design had been changed a lot. I hope you like it.</p>
        &nbsp;
        <p>If you notice any bugs or have any feedback, I would like to hear about it.</p>
        <p>Links to my socials can be found the bottom of the page</p>
        &nbsp;
        <p>
          <strong>Thank you for your help</strong>,
        </p>
        &nbsp;
        <p>
          <strong>Plutoy</strong>
        </p>
        <p>Developer of Sky Shards.</p>
      </div>
    </Modal>
  );
}
