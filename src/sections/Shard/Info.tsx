import { DateTime } from 'luxon';
import Date from '../../components/Date';
import { useNow } from '../../context/Now';
import { getShardInfo, ShardInfo } from '../../shardPredictor';

interface ShardInfoDisplayProps {
  info?: ShardInfo;
  now?: DateTime;
  verbsTense: 'past' | 'present' | 'future';
}

export default function ShardInfoDisplay({ info, now, verbsTense }: ShardInfoDisplayProps) {
  const defNow = now ?? useNow().application;
  const { date, haveShard, isRed, map, realmFull, realmNick } = info ?? getShardInfo(defNow);
  const color = isRed ? 'Red' : 'Black';

  if (!haveShard) {
    return (
      <div id='shardInfo' className='glass'>
        <span>There {verbsTense === 'future' ? 'will be' : verbsTense === 'past' ? 'was' : 'is'} </span>
        <span className='Emphasized'>No Shard</span>
        <Date date={date} describeClose />
      </div>
    );
  } else {
    return (
      <div id='shardInfo' className='glass'>
        <span>
          <span>There {verbsTense === 'future' ? 'will be' : verbsTense === 'past' ? 'was' : 'is'} a </span>
          <span className={`${color} Emphasized`}>{color} Shard </span>
          <span> in </span>
        </span>
        <span>
          <span>
            <span className='Emphasized'>{map}, </span>
          </span>
          <span>
            <span className='Emphasized Full'>{realmFull}</span>
            <span className='Emphasized Nick'>{realmNick}</span>
          </span>
        </span>
        <span>
          <Date date={date} describeClose />
        </span>
      </div>
    );
  }
}
