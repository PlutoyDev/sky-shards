import { memo, useEffect } from 'react';
import { DateTime } from 'luxon';
import { useModal, type ModalProps } from '../../context/ModalContext';
import { useNow } from '../../context/Now';

export function ShardIsBuggedModal({ hideModal }: ModalProps) {
  return (
    <div className='my-2 flex max-h-full w-full flex-col flex-nowrap items-start justify-center gap-y-2'>
      <p className='text-lg font-semibold'>Hey there skykids, </p>
      <p>You are seeing this pop-up because shard is currently bugged in-game or the schedule of shard had changed.</p>
      <p>The countdown/prediction here might not reflect what is in game</p>
      <p>
        You can still use this app by click on the proceed button bellow (daily) until the prediction is correct again
      </p>
      <button type='button' className='btn btn-primary btn-lg self-center font-bold' onClick={hideModal}>
        Proceed
      </button>
    </div>
  );
}

export const ShardIsBuggedTrigger = memo(function BuggedShardTriger() {
  const { application } = useNow();
  const { showModal } = useModal();

  useEffect(() => {
    if (application < DateTime.fromObject({ year: 2024, month: 3 }, { zone: 'America/Los_Angeles' })) {
      const cleared = localStorage.getItem('buggedcleared-' + application.toSQLDate());
      if (!cleared) {
        showModal({
          children: ShardIsBuggedModal,
          hideOnOverlayClick: true,
          onHidden: () => localStorage.setItem('buggedcleared-' + application.toSQLDate(), 'true'),
          title: 'Bugged Shard Mode Activated',
        });
      }
    }
  }, []);

  return null;
});
