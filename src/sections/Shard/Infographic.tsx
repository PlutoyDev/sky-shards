import { ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BiLinkExternal } from 'react-icons/bi';
import { BsDiscord } from 'react-icons/bs';
import { DailyConfig } from '../../data/remoteConfig';
import { ShardInfo } from '../../data/shard';

interface ShardInfographicsProps {
  title: string;
  image: string;
  imageAlt: string;
  credits: ReactNode;
}

function ShardInfographics({ title, image, imageAlt, credits }: ShardInfographicsProps) {
  const [noImg, setNoImg] = useState(image === '');
  const { t } = useTranslation('infographicSection');
  useEffect(() => {
    setNoImg(image === '');
  }, [image]);

  return (
    <div className='glass'>
      <h1 className='mb-1 font-extrabold underline'>{title}</h1>
      {noImg ? (
        <div role='alert' className='alert '>
          {/* Copied from DaisyUI */}
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            className='h-6 w-6 shrink-0 stroke-current'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
            ></path>
          </svg>
          <span>{t('imageError')}</span>
        </div>
      ) : (
        <a href={image} className='block p-0.5' target='_blank' rel='noreferrer'>
          <img
            src={image}
            alt={imageAlt}
            onError={() => setNoImg(true)}
            className='mx-auto cursor-pointer rounded-md shadow-lg md:max-w-lg'
          />
        </a>
      )}
      <small>{credits}</small>
    </div>
  );
}

interface ShardMemoryInfographic {
  remoteDailyConfig?: DailyConfig;
  authorNames?: Record<string, string>;
}

export function ShardMemoryInfographic({ remoteDailyConfig, authorNames }: ShardMemoryInfographic) {
  const { t } = useTranslation(['infographicSection', 'shard']);
  const memory = remoteDailyConfig?.memory;
  if (!memory && memory !== 0) return null;
  const author = authorNames?.[remoteDailyConfig?.memoryBy!]!;
  const imageUrl = `/infographics/memory_clement/${memory}.webp`;
  const memoryStr = t(`shard:memories.${memory}`);
  return (
    <ShardInfographics
      title={`Clement's Shard Memory (${memoryStr})`}
      image={imageUrl}
      imageAlt={memoryStr}
      credits={
        <>
          <a href='https://discord.gg/skyinfographicsdatabase' target='_blank' rel='noreferrer'>
            <div className='glass tooltip tooltip-top' data-tip='Click to join server'>
              <p>
                <strong>Sky: COTL </strong>Infographic Database Discord Server
                <BsDiscord className='ml-1 inline' />
                <BiLinkExternal className='ml-1 inline' />
              </p>
            </div>
          </a>
          {(remoteDailyConfig?.memory || remoteDailyConfig?.memory === 0) && <p>{t('memoryCredit', { author })}</p>}
        </>
      }
    />
  );
}

interface ShardMapInfographic {
  info: ShardInfo;
  remoteDailyConfig?: DailyConfig;
  authorNames?: Record<string, string>;
}

export function ShardMapInfographic({ info, remoteDailyConfig, authorNames }: ShardMapInfographic) {
  const { t } = useTranslation(['infographicSection']);
  const { variation, variationBy } = remoteDailyConfig ?? {};
  const author = variationBy && authorNames?.[variationBy];
  const imageUrl =
    info.numVarient > 1 && (variation || variation === 0)
      ? `/infographics/map_varient_clement/${info.map}.${remoteDailyConfig?.variation}.webp`
      : `/infographics/map_clement/${info.map}.webp`;
  return (
    <ShardInfographics
      title="Clement's Map"
      image={imageUrl}
      imageAlt={info.map}
      credits={
        <>
          <a href='https://discord.gg/skyinfographicsdatabase' target='_blank' rel='noreferrer'>
            <div className='glass tooltip tooltip-top' data-tip='Click to join server'>
              <p>
                <strong>Sky: COTL </strong>Infographic Database Discord Server
                <BsDiscord className='ml-1 inline' />
                <BiLinkExternal className='ml-1 inline' />
              </p>
            </div>
          </a>
          {author && <p>{t('varationCredit', { author })}</p>}
        </>
      }
    />
  );
}

interface ShardDataInfographic {
  info: ShardInfo;
}

export function ShardDataInfographic({ info }: ShardDataInfographic) {
  const data = `/infographics/data_gale/${info.map}.webp`;
  return (
    <ShardInfographics
      title="Gale's Shard Data"
      image={data}
      imageAlt={info.map}
      credits={
        <>
          By <s>Clam</s> <strong>Galerowfylery </strong>
          <BsDiscord className='ml-1 inline' />
        </>
      }
    />
  );
}
