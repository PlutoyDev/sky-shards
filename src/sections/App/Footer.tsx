import { BsGithub, BsTwitter, BsReddit, BsDiscord, BsFillEnvelopeFill } from 'react-icons/bs';
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
        <div>
          <div id='author'>Created by Plutoy</div>
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
              {import.meta.env.DEV ? 'Dev' : 'Prod'} Version:{' '}
              {(import.meta.env.VITE_VERSION_MINOR && `V${import.meta.env.VITE_VERSION_MINOR}`) ??
                (import.meta.env.VITE_NETLIFY_GIT_BRANCH && `Branch ${import.meta.env.VITE_NETLIFY_GIT_BRANCH}`) ??
                (import.meta.env.VITE_NETLIFY_GIT_COMIT_REF &&
                  `Commit ${import.meta.env.VITE_NETLIFY_GIT_COMIT_REF}`) ??
                'Local'}
            </div>
          </div>
          <div id='project-link'>
            <a className='circular-icon' href='https://github.com/PlutoyDev/sky-shards' aria-label='Source Code'>
              <BsGithub />
            </a>
            <a
              className='circular-icon'
              href='https://discord.com/channels/736912435654688868/1041548386333102090'
              aria-label='Discord'
            >
              <BsDiscord />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
