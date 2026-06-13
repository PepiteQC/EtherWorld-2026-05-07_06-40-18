export type GameMode = 'play' | 'editor' | 'spectator'
export type AdminTool = 
  | 'editor' 
  | 'agent' 
  | 'weather' 
  | 'transform' 
  | 'catalog' 
  | 'client' 
  | 'core' 
  | 'stats'

export interface WeatherPreset {
  type: 'clear' | 'rain' | 'snow' | 'storm' | 'fog' | 'blizzard' | 'extreme'
}
