import { BsGithub, BsTwitter, BsReddit, BsDiscord, BsFillEnvelopeFill } from 'react-icons/bs';
import { patternCredits } from '../../data/credits';

export default function Footer() {
  return (
    <footer id='footer' className='glass'>
      <div id='footer-disclaimer'>
        <span>Not affiliated with thatgamecompany </span>
        <span>(It might not reflect what is in-game)</span>
      </div>
      <div id='footer-credits'>
        <span>Thank you to those who helped to discover the patterns shard eruption:</span>
        <div id='credits'>
          {patternCredits.map(u => (
            <span key={u}>{u}</span>
          ))}
        </div>
      </div>
      <div id='footer-author'>
        <div>
          <div id='author'>Created by Plutoy#5022</div>
          <div id='author-link'>
            <a className='circular-icon' href='https://github.com/PlutoyDev' aria-label="Go to Developer's GitHub">
              <BsGithub />
            </a>
            <a className='circular-icon' href='https://twitter.com/PlutoySky' aria-label="Go to Developer's Twitter">
              <BsTwitter />
            </a>
            <a
              className='circular-icon'
              href='https://www.reddit.com/u/PlutoySky'
              aria-label="Go to Developer's Reddit"
            >
              <BsReddit />
            </a>
            <a
              className='circular-icon'
              href='mailto:99151858+PlutoyDev@users.noreply.github.com'
              aria-label='Email the developer'
            >
              <BsFillEnvelopeFill />
            </a>
          </div>
        </div>
        <div>
          <div id='version'>
            <div>
              {import.meta.env.PROD ? 'Prod ' : ''}
              {import.meta.env.VITE_VERSION_MINOR
                ? `Version: ${import.meta.env.VITE_VERSION_MINOR}`
                : __NETLIFY_GIT_BRANCH__ && __NETLIFY_GIT_BRANCH__ !== 'undefined'
                ? `Branch: ${__NETLIFY_GIT_BRANCH__} (${__NETLIFY_GIT_COMMIT_REF__?.slice(0, 7)})`
                : 'Unknown'}
            </div>
          </div>
          <div id='project-link'>
            <a className='circular-icon' href='https://github.com/PlutoyDev/sky-shards' aria-label='Source Code'>
              <BsGithub />
            </a>
            <a
              className='circular-icon'
              href='https://discord.com/channels/575762611111592007/575827924343848960/1057890049166938143'
              aria-label="Go to Developer's Discord"
            >
              <BsDiscord />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
