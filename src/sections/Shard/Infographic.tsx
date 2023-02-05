import { ComponentPropsWithoutRef, ReactNode, CSSProperties, useState, useCallback } from 'react';
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
  return (
    <div id='shard-infographics' className='glass' {...divProps}>
      <div className='title'>{title}</div>
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
      <div className='credits'>{credits}</div>
    </div>
  );
}

const ClementShardMapRecords: Record<string, string> = {
  'Bird Nest': "/infographics/map_clement/01 Daylight Prairie - Bird's Nest.webp",
  'Sanctuary Island': '/infographics/map_clement/01 Daylight Prairie - Sanctuary Islands.webp',
  'Cave': '/infographics/map_clement/01 Daylight Prairie - Prairie Caves.webp',
  'Village Islands': '/infographics/map_clement/01 Daylight Prairie - Village Islands and Koi Pond.webp',
  'Butterfly Field': '/infographics/map_clement/01 Daylight Prairie - Butterfly Field.webp',
  'Forest Garden': '/infographics/map_clement/02 Hidden Forest - Forest End.webp',
  'Treehouse': '/infographics/map_clement/02 Hidden Forest - Assembly Treehouse.webp',
  'Elevated Clearing': '/infographics/map_clement/02 Hidden Forest - Elevated Clearing.webp',
  'Forest Brook': '/infographics/map_clement/02 Hidden Forest - Forest Brook.webp',
  'Boneyard': '/infographics/map_clement/02 Hidden Forest - Broken Bridge.webp',
  'Hermit valley': '/infographics/map_clement/03 Valley of Triumph - Hermit Valley.webp',
  'Village of Dreams': '/infographics/map_clement/03 Valley of Triumph - Village of Dreams.webp',
  'Ice Rink': '/infographics/map_clement/03 Valley of Triumph - Ice Rink.webp',
  'Graveyard': '',
  'Crabfield': '/infographics/map_clement/04 Golden Wasteland - Crab Fields.webp',
  'Forgotten Ark': '/infographics/map_clement/04 Golden Wasteland - Forgotten Ark.webp',
  'Broken Temple': '/infographics/map_clement/04 Golden Wasteland - Broken Temple.webp',
  'Battlefield': '/infographics/map_clement/04 Golden Wasteland - Battlefield.webp',
  'Jellyfish Cove': '/infographics/map_clement/05 Vault of Knowledge - Jellyfish Cove.webp',
  'Starlight Desert': '/infographics/map_clement/05 Vault of Knowledge - Starlight Desert.webp',
};

interface ShardMapInfographic {
  info: ShardInfo;
}

export function ShardMapInfographic({ info }: ShardMapInfographic) {
  const map = ClementShardMapRecords[info.map];
  return (
    <ShardInfographics
      title='Map'
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
