import { useState } from 'react'
import type { Game } from '../types/game'

const EMOJI: Record<string, string> = {
  'wonder-voyage': '🧭',
  'city-cargo': '📦',
  'bounce-legends': '🏀',
  'color-snake': '🐍',
  'bloom-heaven': '🌸',
  dunes: '🏜️',
  'knife-strike': '🔪',
  'robo-scape': '🤖',
  'drift-circuit': '🏎️',
  'skyline-dash': '🏙️',
  'neon-hoops': '🥅',
  'block-dash': '🧱',
  'shadow-arena': '🥷',
  'salon-stars': '💄',
  'island-obby': '🏝️',
  'turbo-rally': '🚗',
  'petal-pop': '🌺',
  'metro-rush': '🚇',
  'candy-stack': '🍬',
  'goal-kick': '⚽',
  'pixel-pit': '👾',
  'cozy-cafe': '☕',
  'dune-buggy': '🚙',
  'star-fisher': '🐟',
  'ribbon-rush': '🎀',
  'moon-miner': '🌙',
  'kitty-merge': '🐱',
  'roof-runner': '🏃',
  'aqua-io': '🌊',
  'blossom-makeup': '💅',
  'cannon-duel': '💥',
  'waffle-stack': '🧇',
  'night-owl': '🦉',
  'skate-loop': '🛹',
  'gem-slide': '💎',
  'cloud-jump': '☁️',
  'robot-tidy': '🧹',
  'lava-loop': '🌋',
  'safari-snap': '🦁',
  'pencil-rally': '✏️',
  'bubble-orbit': '🫧',
  'castle-creep': '🏰',
  'hoop-hero': '⛹️',
  'thread-run': '🧵',
  'pizza-rush': '🍕',
  'voxel-park': '🟩',
  'slime-pit': '🟢',
  'mirror-maze': '🪞',
  'punch-dummy': '🥊',
  'coral-quest': '🐠',
  'paper-plane': '✈️',
  'disco-dress': '👗',
  'sniper-lane': '🎯',
  'farm-hop': '🐄',
  'ice-slide': '🧊',
  'lantern-run': '🏮',
  'brick-blitz': '🧩',
  'turbo-toad': '🐸',
  'shadow-tag': '👻',
  'melody-match': '🎵',
}

type TileArtProps = {
  game: Game
}

export function TileArt({ game }: TileArtProps) {
  const [photo, setPhoto] = useState<'loading' | 'ready' | 'off'>(game.image ? 'loading' : 'off')
  const emoji = EMOJI[game.id] ?? '🎮'

  return (
    <div
      className="mosaic-art"
      style={{
        background: `linear-gradient(155deg, ${game.gradientFrom} 0%, ${game.gradientTo} 100%)`,
      }}
    >
      <span className="mosaic-art-glow" aria-hidden />
      <span className="mosaic-emoji" aria-hidden>
        {emoji}
      </span>
      {photo !== 'off' && (
        <img
          src={game.image}
          alt=""
          className={`mosaic-tile-img${photo === 'ready' ? ' is-ready' : ''}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setPhoto('ready')}
          onError={() => setPhoto('off')}
        />
      )}
    </div>
  )
}
