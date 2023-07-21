import { ImCross } from 'react-icons/im';
import { ModalProps } from '../../context/ModalContext';

export default function Announcement_V4({ hideModal }: ModalProps) {
  return (
    <div className='glass w-full max-w-xs rounded-lg transition-[height] md:mx-auto md:max-w-lg'>
      <button
        className='absolute right-4 top-2'
        onClick={() => {
          localStorage.setItem('v4AnnouncementDismissed', 'true');
          hideModal();
        }}
      >
        <ImCross />
      </button>
      <h1 className='text-center text-lg font-semibold'>V4 Announcement</h1>
      <div className='px-4 py-2 [&>*]:pb-2'>
        <p>
          <span className='text-lg font-semibold'>Hi Skykids!</span>
          <span>, Plutoy here.</span>
        </p>
        <p>
          <span>Sky shards has been upgraded to </span>
          <span className='text-lg font-semibold'>V4! Hurray</span>
        </p>
        <p>It was previously released, but got rolled back as it was buggy.</p>
        <p>
          It&apos;s now back, and <strong>hopefully</strong> it&apos;s better than ever!
        </p>
        <p> It might still have bugs though, so please report them to me.</p>
        <p>
          <span>You can find the a feedback Google Form at the bottom of the page.</span>
        </p>
        &nbsp;
        <p>
          <span className='text-lg font-semibold'>Thank you</span>
        </p>
      </div>
    </div>
  );
}
