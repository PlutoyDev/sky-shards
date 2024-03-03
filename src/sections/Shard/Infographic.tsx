import { ReactNode, useState, useEffect } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { BsDiscord } from 'react-icons/bs';
import { ShardInfo } from '../../shardPredictor';

interface ShardInfographicsProps {
  title: string;
  image: string;
  imageAlt: string;
  credits: ReactNode;
}

function ShardInfographics({ title, image, imageAlt, credits }: ShardInfographicsProps) {
  const [noImg, setNoImg] = useState(image === '');
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
          <span>Unable to find image</span>
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

interface ShardMapInfographic {
  info: ShardInfo;
}

export function ShardMapInfographic({ info }: ShardMapInfographic) {
  const map = `/infographics/map_clement/${info.map}.webp`;
  return (
    <ShardInfographics
      title="Clement's Map"
      image={map}
      imageAlt={info.map}
      credits={
        <a href='https://discord.gg/skyinfographicsdatabase' target='_blank' rel='noreferrer'>
          <div className='glass'>
            <p>
              <strong>Sky: COTL </strong>Infographic Database Discord Server
              <BsDiscord className='ml-1 inline' />
            </p>
            <p>
              Click here to Join Server
              <BiLinkExternal className='ml-1 inline' />
            </p>
          </div>
        </a>
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
