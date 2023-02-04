import { ComponentPropsWithoutRef, forwardRef, ReactNode, CSSProperties } from 'react';

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

export function ShardInfographics({
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
  return (
    <div id='shard-infographics' className='' {...divProps}>
      <div className='title'>{title}</div>
      <div className='image'>
        <img src={image} alt={imageAlt} style={{ minWidth, minHeight, maxWidth, maxHeight, margin: 'auto' }} />
      </div>
      <div className='credits'>{credits}</div>
    </div>
  );
}
