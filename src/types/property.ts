export interface PropertyPhoto {
  url: string;
  title: string;
  room: string;
  caption: string;
}

export interface PropertyAgent {
  name: string;
  brokerage: string;
  phone: string;
  license: string;
  instagram: string;
}

export type AgentInfo = PropertyAgent;

export interface PropertyListing {
  id: string;
  url: string;
  title: string;
  address: string;
  neighborhood: string;
  price: number;
  priceFormatted: string;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: string;
  yearBuilt: number;
  propertyType: string;
  status: string;
  headline: string;
  description: string;
  highlights: string[];
  agent: PropertyAgent;
  photos: PropertyPhoto[];
}

export interface AICopyOutput {
  reelsHook: string;
  reelsVoiceoverScript: string[];
  instagramCaption: string;
  carouselHook: string;
  carouselSlidesContent: {
    slide: number;
    title: string;
    subtitle: string;
  }[];
  hashtags: string[];
}

export type CarouselTheme = 'luxe-noir' | 'modern-minimal' | 'vogue-editorial' | 'emerald-estate';
export type AspectRatioType = 'portrait' | 'square' | 'story';

export interface CarouselSlide {
  id: string;
  type: 'cover' | 'specs' | 'room' | 'lifestyle' | 'quote' | 'agent';
  badge?: string;
  title: string;
  subtitle: string;
  photoUrl?: string;
  bulletPoints?: string[];
  specs?: { label: string; value: string }[];
}

export interface ReelTrackPreset {
  id: string;
  name: string;
  bpm: number;
  genre: string;
  mood: string;
}

export type ReelTransitionEffect = 'cross-fade' | 'slide' | 'zoom' | 'wipe' | 'dip-black';
export type SocialPlatformPreset = 'tiktok' | 'reels' | 'shorts' | 'feed' | 'square' | 'youtube';
