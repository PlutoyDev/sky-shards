import credits from '../data/credits';

export default function Footer() {
  return (
    <div className='App-footer'>
      <div>
        <span>Not affiliated with thatgamecompany</span>
        <span>(It might not reflect what is in-game)</span>
      </div>
      <div>
        <span>Created by Plutoy</span>
        <div className='links'>
          <a href='https://github.com/PlutoyDev/sky-shards'>View source code</a>
          Or
          <a href='https://github.com/PlutoyDev/sky-shards/issues/new'>Report an issue</a>
        </div>
      </div>
      <div>
        <span>Thank you to those who helped to discover the patterns shard eruption:</span>
        <div className='credits'>
          {credits.map(u => (
            <span key={u}>{u}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
