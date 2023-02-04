import { DateTime } from 'luxon';
import Date from '../../components/Date';

export interface ShardTimelineSectionProp {
  date: DateTime;
}

export default function ShardTimeline({ date }: ShardTimelineSectionProp) {
  //TODO: Show all shards for the day
  //Placeholder for now
  return (
    <div id='shardTimeline' className='glass'>
      <span className='underline underline-offset-2'>
        <span className='Emphasized'>Schedule for </span>
        <Date date={date} describeClose />
      </span>
    </div>
  );
}
