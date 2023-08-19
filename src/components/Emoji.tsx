interface EmojiDefinition {
  path: string;
  alt: string | undefined;
}

const emojiDefinitions = {
  'Red shard': {
    path: '/emojis/ShardRed.webp',
    alt: 'Red Shards',
  },
  'Black shard': {
    path: '/emojis/ShardBlack.webp',
    alt: 'Black Shards',
  },
  'Ascended candle': {
    path: '/emojis/AscendedCandle.webp',
    alt: 'Ascended Candles',
  },
  'Candle cake': {
    path: '/emojis/CandleCake.webp',
    alt: 'Candle Cakes',
  },
} satisfies Record<string, EmojiDefinition>;

interface EmojiProp {
  name: keyof typeof emojiDefinitions;
  className?: string;
}

export function Emoji({ name, className = '' }: EmojiProp) {
  return (
    <img
      className={`inline h-[0.9em] w-[0.9em] align-baseline leading-[1em] ${className}`}
      src={emojiDefinitions[name].path}
      alt={emojiDefinitions[name].alt ?? name}
    />
  );
}

export default Emoji;
