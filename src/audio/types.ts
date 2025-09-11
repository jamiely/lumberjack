export interface AudioAsset {
  name: string;
  url: string;
  buffer?: AudioBuffer;
}

export interface PlaySoundOptions {
  volume?: number;
  loop?: boolean;
  fadeIn?: number;
}

export type AudioState = 'uninitialized' | 'loading' | 'ready' | 'error';