import credits from '../../data/credits';

export default function Footer() {
  return (
    <div id='footer' className='glass'>
      <div id='footer-disclaimer'>
        <span>Not affiliated with thatgamecompany </span>
        <span>(It might not reflect what is in-game)</span>
      </div>
      <div id='footer-credits'>
        <span>Thank you to those who helped to discover the patterns shard eruption:</span>
        {/* <div className='scrolling'> */}
        <div id='credits'>
          {credits.map(u => (
            <span key={u}>{u}</span>
          ))}
        </div>
        {/* </div> */}
      </div>
      <div id='footer-author'>
        <span>Created by Plutoy</span>
        <div className='links'>
          <a href='https://github.com/PlutoyDev/sky-shards'>View source code</a>
          <span> Or </span>
          <a href='https://github.com/PlutoyDev/sky-shards/issues/new'>Report an issue</a>
        </div>
      </div>
    </div>
  );
}
