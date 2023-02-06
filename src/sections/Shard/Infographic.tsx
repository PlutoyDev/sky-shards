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

const GaleShardDataRecords: Record<string, string> = {
  'Bird Nest': '/infographics/data_gale/Prairie-Bird_Nest.webp',
  'Sanctuary Island': '/infographics/data_gale/Prairie-Sanctuary_Islands.webp',
  'Cave': '/infographics/data_gale/Prairie-Prairie_Cave.webp',
  'Village Islands': '/infographics/data_gale/Prairie-Village_Islands.webp',
  'Butterfly Field': '/infographics/data_gale/Prairie-Butterfly_Field.webp',
  'Forest Garden': '/infographics/data_gale/Forest-End.webp',
  'Treehouse': '/infographics/data_gale/Forest-Treehouse.webp',
  'Elevated Clearing': '/infographics/data_gale/Forest-Elevated_Clearing.webp',
  'Forest Brook': '/infographics/data_gale/Forest-Brook.webp',
  'Boneyard': '/infographics/data_gale/Forest-Boneyard.webp',
  'Hermit valley': '/infographics/data_gale/Valley-Hermit_Valley.webp',
  'Village of Dreams': '/infographics/data_gale/Valley-Village_Of_Dreams.webp',
  'Ice Rink': '/infographics/data_gale/Valley-Ice_Rink.webp',
  'Graveyard': '/infographics/data_gale/Wasteland-Graveyard.webp',
  'Crabfield': '/infographics/data_gale/Wasteland-Crabfield.webp',
  'Forgotten Ark': '/infographics/data_gale/Wasteland-Fogortten_Ark.webp',
  'Broken Temple': '/infographics/data_gale/Wasteland-Broken_Temple.webp',
  'Battlefield': '/infographics/data_gale/Wasteland-Battlefield.webp',
  'Jellyfish Cove': '/infographics/data_gale/Vault-Jellyfish_Cove.webp',
  'Starlight Desert': '/infographics/data_gale/Vault-Starlight_Desert.webp',
};

interface ShardDataInfographic {
  info: ShardInfo;
}

export function ShardDataInfographic({ info }: ShardDataInfographic) {
  const data = GaleShardDataRecords[info.map];
  return (
    <ShardInfographics
      title="Gale's Data"
      image={data}
      imageAlt={info.map}
      credits={
        <div className='credit'>
          <span>
            By <s>Year of the Clam</s> <strong>Galerowfylery </strong>
          </span>
          <BsDiscord style={{ display: 'inline' }} />
        </div>
      }
    />
  );
}
