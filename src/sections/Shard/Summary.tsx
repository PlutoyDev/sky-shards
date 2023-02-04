import { DateTime } from 'luxon';
import Clock from '../../components/Clock';
import Date from '../../components/Date';
import { getShardInfo, getUpcommingShardPhase } from '../../shardPredictor';

interface ShardSummarySectionProp {
  date: DateTime;
}

export default function ShardSummary({ date }: ShardSummarySectionProp) {
  const info = getShardInfo(date);

  if (!info.haveShard) {
    return (
      <div id='shardSummary'>
        <div id='shardInfo' className='glass'>
          <span>There is </span>
          <span className='Emphasized'>No Shard </span>
          <Date date={date} describeClose describeClosePrefix />
        </div>
      </div>
    );
  } else {
    const upcomming = getUpcommingShardPhase(date);
    const landed = upcomming && upcomming.land < date;
    const next = upcomming ? (landed ? upcomming.end : upcomming.land) : undefined;
    const ordinalIndex = upcomming?.index !== undefined && ['1st', '2nd', '3rd'][upcomming.index];

    return (
      <div id='shardSummary'>
        <div id='shardInfo' className='glass'>
          <span>There {upcomming ? (landed ? 'is' : 'will be') : 'was'} </span>
          <span className={`${info.isRed ? 'Red' : 'Black'} Emphasized`}>{info.isRed ? 'Red' : 'Black'} Shard</span>
          <span> in </span>
          <span>
            <span>
              <span className='Emphasized'>{info.map}, </span>
            </span>
            <span>
              <span className='Emphasized Full'>{info.realmFull}</span>
              <span className='Emphasized Nick'>{info.realmNick}</span>
            </span>
          </span>
          <Date date={date} describeClose describeClosePrefix />
        </div>
        <div id='shardTiming' className='glass'>
          {upcomming ? (
            <>
              <div id='shardCountdown'>
                <span>
                  <span className='Emphasized'>{ordinalIndex ? `${ordinalIndex} shard` : 'Shard'} </span>
                  {landed && (
                    <>
                      <span>has </span>
                      <span className='Emphasized'>landed </span>
                      <Clock date={upcomming.land} relative negate inline />
                      <span> ago, it </span>
                    </>
                  )}
                  <span>will </span>
                  <span className='Emphasized'>{landed ? 'end' : 'land'} </span>
                  <span>in </span>
                </span>
                <Clock date={next} relative trim />
                <span> which is </span>
              </div>
              <div id='shardAbsLocal'>
                <span className='Emphasized'>Your Time: </span>
                <div className='Demphasized'>({Intl.DateTimeFormat().resolvedOptions().timeZone})</div>
                <Date date={next} local />
                <Clock date={next} local />
              </div>
              <div id='shardAbsSky'>
                <span className='Emphasized'>Sky Time: </span>
                <div className='Demphasized'>(America/Los_Angeles)</div>
                <Date date={next} />
                <Clock date={next} />
              </div>
            </>
          ) : (
            <div id='shardCountdown'>
              <span> All shard has ended </span>
              <Clock date={info.lastEnd} relative negate />
              <span> ago </span>
            </div>
          )}
        </div>
      </div>
    );
  }
}
