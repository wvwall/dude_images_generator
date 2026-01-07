export interface GeneratedImage {
  id?: string;
  url: string;
  prompt: string;
  timestamp?: number;
  aspectRatio: string;
}

export type AspectRatio = "1:1" | "3:4" | "4:3" | "16:9" | "9:16";

export interface GenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
}

export enum AudioType {
  HOW_YOU_DOIN = "HOW_YOU_DOIN",
  OH_MY_GOD = "OH_MY_GOD",
  FRIENDS_THEME = "FRIENDS_THEME",
}

export const AUDIO_MAP: Record<AudioType, string> = {
  [AudioType.HOW_YOU_DOIN]: "audio/how_you_doin.mp3",
  [AudioType.OH_MY_GOD]: "audio/oh_my_god.mp3",
  [AudioType.FRIENDS_THEME]: "audio/friends_theme.mp3",
};

export interface Phrase {
  text: string;
  audioSrc: string;
  dynamic?: boolean;
}
