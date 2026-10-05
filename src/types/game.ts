export interface Game {
  id: string
  name: string
  tagline: string
  url: string
  image: string
  gradientFrom: string
  gradientTo: string
  glow: string
  category: string
  /** Unity WebGL default canvas size (match Player → WebGL template / build settings) */
  resolutionWidth: number
  resolutionHeight: number
  /** Used only when width/height omitted; prefer exact resolution when known */
  orientation?: 'landscape' | 'portrait'
}
