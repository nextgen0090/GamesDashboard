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
  /** Optional: Unity canvas size for the play modal (defaults to 1280×720) */
  resolutionWidth?: number
  resolutionHeight?: number
  orientation?: 'landscape' | 'portrait'
  viewportPaddingTop?: number
  viewportPaddingBottom?: number
}
