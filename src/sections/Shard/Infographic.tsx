import { ComponentPropsWithoutRef, ReactNode, CSSProperties, useState, useCallback, useEffect } from 'react';
import { BiLinkExternal } from 'react-icons/bi';
import { BsDiscord } from 'react-icons/bs';
import { ShardInfo } from '../../shardPredictor';

interface ShardInfographicsProps {
  title: string;
  image: string;
  imageAlt: string;
  credits: ReactNode;
  minWidth?: CSSProperties['minWidth'];
  minHeight?: CSSProperties['minHeight'];
  maxWidth?: CSSProperties['maxWidth'];
  maxHeight?: CSSProperties['maxHeight'];
  divProps?: ComponentPropsWithoutRef<'div'>;
}

function ShardInfographics({
  title,
  image,
  imageAlt,
  minWidth = '50%',
  minHeight = '50%',
  maxWidth,
  maxHeight,
  credits,
  divProps,
}: ShardInfographicsProps) {
  const [noImg, setNoImg] = useState(image === '');
  useEffect(() => {
    setNoImg(image === '');
  }, [image]);

  return (
    <section className='shard-infographics glass' {...divProps}>
      <h1 className='title'>{title}</h1>
      {noImg && (
        <div className='no-img'>
          <div className='text'>Infographic has yet to be created for the following</div>
        </div>
      )}
      <div className='image'>
        <img
          src={image}
          alt={imageAlt}
          onError={() => setNoImg(true)}
          style={{ minWidth, minHeight, maxWidth, maxHeight }}
        />
      </div>
      <small className='credits'>{credits}</small>
    </section>
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
        <div
          className='credit glass'
          onClick={useCallback(() => window?.open('https://discord.gg/skyinfographicsdatabase'), [])}
        >
          <p>
            <span>
              <strong>Sky: COTL </strong>
              <span>Infographic Database Discord Server </span>
            </span>
            <BsDiscord style={{ display: 'inline' }} />
          </p>
          <p>
            <span>Click here to Join Server </span>
            <BiLinkExternal style={{ display: 'inline' }} />
          </p>
        </div>
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
        <div className='credit'>
          <span>
            By <s>Clam</s> <strong>Galerowfylery </strong>
          </span>
          <BsDiscord style={{ display: 'inline' }} />
        </div>
      }
    />
  );
}
