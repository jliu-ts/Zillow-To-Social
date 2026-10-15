import React, { useState, useEffect, useRef, useCallback } from 'react';
import { PropertyListing, ReelTrackPreset, ReelTransitionEffect } from '../../types/property';
import { audioSynth } from '../../utils/audioSynthesizer';
import {
  Play,
  ArrowCounterClockwise,
  SpeakerHigh,
  SpeakerSlash,
  DownloadSimple,
  Sparkle,
  MusicNotes,
  Clock,
  Check,
  FilmStrip,
  Camera,
  DeviceMobile,
  CaretDown,
  Stack,
  ArrowsLeftRight,
  MagnifyingGlassPlus,
  SlidersHorizontal,
  Eye,
  EyeSlash,
  MagicWand,
  Microphone,
} from '@phosphor-icons/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface ReelStudioProps {
  listing: PropertyListing;
  suggestedHook?: string;
  suggestedVoiceover?: string[];
}

export type VideoAspectRatio = '9:16' | '4:5' | '1:1' | '16:9';
export type SocialPlatformId = 'tiktok' | 'reels' | 'shorts' | 'feed' | 'square' | 'youtube';

export interface AspectRatioPreset {
  id: SocialPlatformId;
  aspectRatio: VideoAspectRatio;
  label: string;
  platform: string;
  sublabel: string;
  badge: string;
  previewW: number;
  previewH: number;
  exportW: number;
  exportH: number;
  containerClass: string;
}

export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  {
    id: 'tiktok',
    aspectRatio: '9:16',
    label: 'TikTok (9:16 Vertical)',
    platform: 'TikTok',
    sublabel: 'Optimized for TikTok algorithm with engagement safe-zones',
    badge: 'TikTok 9:16',
    previewW: 720,
    previewH: 1280,
    exportW: 1080,
    exportH: 1920,
    containerClass: 'aspect-[9/16] max-w-[310px] sm:max-w-[340px]',
  },
  {
    id: 'reels',
    aspectRatio: '9:16',
    label: 'Instagram Reels (9:16 Vertical)',
    platform: 'Instagram Reels',
    sublabel: '9:16 full-screen reel format with Instagram UI safe margins',
    badge: 'IG Reels 9:16',
    previewW: 720,
    previewH: 1280,
    exportW: 1080,
    exportH: 1920,
    containerClass: 'aspect-[9/16] max-w-[310px] sm:max-w-[340px]',
  },
  {
    id: 'shorts',
    aspectRatio: '9:16',
    label: 'YouTube Shorts (9:16 Vertical)',
    platform: 'YouTube Shorts',
    sublabel: '9:16 vertical video with YouTube Shorts subscribe buffer',
    badge: 'YT Shorts 9:16',
    previewW: 720,
    previewH: 1280,
    exportW: 1080,
    exportH: 1920,
    containerClass: 'aspect-[9/16] max-w-[310px] sm:max-w-[340px]',
  },
  {
    id: 'feed',
    aspectRatio: '4:5',
    label: 'Instagram Feed / Ads (4:5 Portrait)',
    platform: 'Instagram Feed',
    sublabel: '1080×1350 portrait frame for main Instagram grid & Meta ads',
    badge: 'IG Feed 4:5',
    previewW: 720,
    previewH: 900,
    exportW: 1080,
    exportH: 1350,
    containerClass: 'aspect-[4/5] max-w-[340px] sm:max-w-[380px]',
  },
  {
    id: 'square',
    aspectRatio: '1:1',
    label: 'Square Post (1:1 Feed)',
    platform: 'Instagram & LinkedIn',
    sublabel: '1080×1080 standard square post for multi-platform feeds',
    badge: 'Square 1:1',
    previewW: 720,
    previewH: 720,
    exportW: 1080,
    exportH: 1080,
    containerClass: 'aspect-square max-w-[340px] sm:max-w-[380px]',
  },
  {
    id: 'youtube',
    aspectRatio: '16:9',
    label: 'YouTube & MLS Video (16:9 Landscape)',
    platform: 'YouTube & MLS',
    sublabel: '1920×1080 cinematic landscape video for property websites & YouTube',
    badge: 'Landscape 16:9',
    previewW: 1280,
    previewH: 720,
    exportW: 1920,
    exportH: 1080,
    containerClass: 'aspect-video max-w-[480px] sm:max-w-[540px]',
  },
];

export interface TransitionPreset {
  id: ReelTransitionEffect;
  name: string;
  tag: string;
  description: string;
  icon: React.ElementType;
}

export const TRANSITION_PRESETS: TransitionPreset[] = [
  {
    id: 'cross-fade',
    name: 'Cross-Fade (Dissolve)',
    tag: 'Classic Luxury',
    description: 'Smooth, cinematic cross-dissolve between rooms for an elegant property flow.',
    icon: Stack,
  },
  {
    id: 'slide',
    name: 'Push Slide (Motion)',
    tag: 'Viral & Punchy',
    description: 'Dynamic horizontal slide transition favored by high-retention TikTok & Reels creators.',
    icon: ArrowsLeftRight,
  },
  {
    id: 'zoom',
    name: 'Punch Zoom (Whip)',
    tag: 'High Energy',
    description: 'Dramatic scale-through transition pulling the viewer deeper into the next space.',
    icon: MagnifyingGlassPlus,
  },
  {
    id: 'wipe',
    name: 'Curtain Wipe',
    tag: 'Architectural Sweep',
    description: 'Crisp geometric curtain wipe revealing spaces with a refined accent line.',
    icon: SlidersHorizontal,
  },
  {
    id: 'dip-black',
    name: 'Dip to Black',
    tag: 'Editorial Film',
    description: 'Paced editorial black dip reminiscent of prestige architectural documentary films.',
    icon: FilmStrip,
  },
];

const HOOK_PRESETS = [
  'Wait till you see the primary suite in this estate...',
  'Would you pay $18.5M for this view?',
  'Inside the cleanest architectural home on the market right now',
  'Touring a masterclass in modern luxury design',
  'This kitchen island just ruined all other kitchens for me',
  'POV: You just checked into your $20M Bel Air sanctuary',
];

const AUDIO_TRACKS: ReelTrackPreset[] = [
  { id: 'luxury-lofi', name: 'Luxury Lo-Fi Chords', bpm: 88, genre: 'Lo-Fi / Soul', mood: 'Relaxed & Expensive' },
  { id: 'cinematic-drone', name: 'Cinematic Drone & Sub', bpm: 70, genre: 'Ambient', mood: 'Dramatic & High-End' },
  { id: 'upbeat-tech', name: 'Tech House Luxury Groove', bpm: 120, genre: 'Modern House', mood: 'Energetic & Viral' },
];

export const ReelStudio: React.FC<ReelStudioProps> = ({
  listing,
  suggestedHook,
  suggestedVoiceover,
}) => {
  // Photos for the reel
  const photos = listing.photos && listing.photos.length > 0
    ? listing.photos
    : [
        {
          url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
          title: 'Architectural Elevation',
          room: 'Exterior Front',
          caption: 'Modern luxury entrance',
        },
      ];

  const [platformPreset, setPlatformPreset] = useState<SocialPlatformId>('tiktok');
  const [transitionEffect, setTransitionEffect] = useState<ReelTransitionEffect>('cross-fade');
  const [showSafeZones, setShowSafeZones] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeHook, setActiveHook] = useState(suggestedHook || HOOK_PRESETS[0]);
  const [customHookText, setCustomHookText] = useState('');
  const [activeTrack, setActiveTrack] = useState<string>('luxury-lofi');
  const [isMuted, setIsMuted] = useState(false);
  const [slideDuration, setSlideDuration] = useState<number>(3.5); // seconds per slide
  const [showPriceTag, setShowPriceTag] = useState(true);
  const [showAgentCard, setShowAgentCard] = useState(true);
  const [, setProgress] = useState(0); // 0 to 1 for current slide
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const slideProgressRef = useRef<number>(0);
  const imageElementsRef = useRef<HTMLImageElement[]>([]);
  const imagesLoadedRef = useRef<boolean>(false);

  const activePresetConfig =
    ASPECT_RATIO_PRESETS.find((r) => r.id === platformPreset) || ASPECT_RATIO_PRESETS[0];
  const aspectRatio = activePresetConfig.aspectRatio;

  // Preload images into HTMLImageElements for smooth canvas rendering
  useEffect(() => {
    imagesLoadedRef.current = false;
    let loadedCount = 0;
    const imgs: HTMLImageElement[] = [];

    photos.forEach((p) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = p.url;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === photos.length) {
          imagesLoadedRef.current = true;
        }
      };
      imgs.push(img);
    });

    imageElementsRef.current = imgs;
  }, [photos]);

  // Audio handling
  useEffect(() => {
    if (isPlaying && !isMuted) {
      audioSynth.play(activeTrack);
    } else {
      audioSynth.stop();
    }
    return () => {
      audioSynth.stop();
    };
  }, [isPlaying, isMuted, activeTrack]);

  // Playback timer & progress update
  useEffect(() => {
    if (!isPlaying) return;

    let startTime = performance.now();
    const interval = setInterval(() => {
      const now = performance.now();
      const elapsedSec = (now - startTime) / 1000;
      const curProg = (elapsedSec % slideDuration) / slideDuration;
      setProgress(curProg);
      slideProgressRef.current = curProg;

      if (elapsedSec >= slideDuration) {
        startTime = performance.now();
        setCurrentPhotoIdx((prev) => (prev + 1) % photos.length);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [isPlaying, slideDuration, photos.length]);

  // Render on Canvas with responsive scaling & selected transition effect
  const drawFrameToCanvas = useCallback(
    (targetCanvas: HTMLCanvasElement, photoIdx: number, pRatio: number) => {
      const ctx = targetCanvas.getContext('2d');
      if (!ctx) return;

      const w = targetCanvas.width;
      const h = targetCanvas.height;

      ctx.clearRect(0, 0, w, h);

      // Background fallback
      ctx.fillStyle = '#0a1317';
      ctx.fillRect(0, 0, w, h);

      const totalPhotos = photos.length;
      const currentImg = imageElementsRef.current[photoIdx];
      const prevIdx = (photoIdx - 1 + totalPhotos) % totalPhotos;
      const prevImg = imageElementsRef.current[prevIdx];

      // Transition window is the first 22% of slide duration (~0.77s on 3.5s slide)
      const transitionWindow = 0.22;
      const isTransitioning = pRatio < transitionWindow && totalPhotos > 1;

      // Draw helper with cover aspect ratio & transform
      const drawCover = (
        img: HTMLImageElement | undefined,
        scale: number,
        panX: number,
        panY: number,
        alpha: number = 1.0,
        clipRect?: { x: number; y: number; w: number; h: number }
      ) => {
        if (!img || !img.complete || img.naturalWidth === 0) return;
        ctx.save();
        if (clipRect) {
          ctx.beginPath();
          ctx.rect(clipRect.x, clipRect.y, clipRect.w, clipRect.h);
          ctx.clip();
        }
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.translate(w / 2 + panX, h / 2 + panY);
        ctx.scale(scale, scale);

        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = w / h;
        let drawW = w;
        let drawH = h;
        if (imgAspect > canvasAspect) {
          drawW = h * imgAspect;
        } else {
          drawH = w / imgAspect;
        }
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      };

      if (!isTransitioning) {
        // Standard Ken Burns motion pan and scale
        const adjustedRatio = (pRatio - transitionWindow) / (1 - transitionWindow);
        const scale = 1.05 + adjustedRatio * 0.12;
        const panX = (adjustedRatio - 0.5) * (w * 0.04);
        const panY = (adjustedRatio - 0.5) * (h * 0.03);
        drawCover(currentImg, scale, panX, panY, 1.0);
      } else {
        // Active transition rendering
        const rawT = pRatio / transitionWindow;
        // Cubic ease in-out
        const t = rawT < 0.5 ? 4 * rawT * rawT * rawT : 1 - Math.pow(-2 * rawT + 2, 3) / 2;

        if (transitionEffect === 'cross-fade') {
          // Outgoing photo finishing its movement
          drawCover(prevImg, 1.17, w * 0.02, h * 0.015, 1.0);
          // Incoming photo dissolving in
          drawCover(currentImg, 1.05 + t * 0.03, (t - 0.5) * (w * 0.02), 0, t);
        } else if (transitionEffect === 'slide') {
          // Outgoing slides left: pan from 0 to -w
          const prevPanX = -t * w;
          drawCover(prevImg, 1.15, prevPanX, 0, 1.0);
          // Incoming slides in from right: pan from w to 0
          const curPanX = (1 - t) * w;
          drawCover(currentImg, 1.05, curPanX, 0, 1.0);
        } else if (transitionEffect === 'zoom') {
          // Outgoing zooms forward aggressively and dissolves
          const prevScale = 1.15 + t * 0.45;
          drawCover(prevImg, prevScale, 0, 0, 1 - t);
          // Incoming zooms smoothly into place maintaining full bleed
          const curScale = 1.02 + t * 0.08;
          drawCover(currentImg, curScale, 0, 0, t);
        } else if (transitionEffect === 'wipe') {
          // Base outgoing image
          drawCover(prevImg, 1.15, 0, 0, 1.0);
          // Incoming image revealed by wiping horizontally across
          const wipeWidth = w * t;
          drawCover(currentImg, 1.05, 0, 0, 1.0, { x: 0, y: 0, w: wipeWidth, h });
          // Glowing cobalt divider line in Meta brand tone
          ctx.save();
          ctx.strokeStyle = '#0064e0';
          ctx.lineWidth = 3;
          ctx.shadowColor = 'rgba(0, 100, 224, 0.8)';
          ctx.shadowBlur = 12;
          ctx.beginPath();
          ctx.moveTo(wipeWidth, 0);
          ctx.lineTo(wipeWidth, h);
          ctx.stroke();
          ctx.restore();
        } else if (transitionEffect === 'dip-black') {
          // Dip to black transition
          if (t < 0.5) {
            const alpha = 1 - t * 2;
            drawCover(prevImg, 1.15, 0, 0, alpha);
          } else {
            const alpha = (t - 0.5) * 2;
            drawCover(currentImg, 1.05, 0, 0, alpha);
          }
        }
      }

      // Cinematic Vignette / Gradients for legible text
      const topGrad = ctx.createLinearGradient(0, 0, 0, h * 0.28);
      topGrad.addColorStop(0, 'rgba(10, 19, 23, 0.7)');
      topGrad.addColorStop(1, 'rgba(10, 19, 23, 0)');
      ctx.fillStyle = topGrad;
      ctx.fillRect(0, 0, w, h * 0.28);

      const botGrad = ctx.createLinearGradient(0, h * 0.55, 0, h);
      botGrad.addColorStop(0, 'rgba(10, 19, 23, 0)');
      botGrad.addColorStop(0.7, 'rgba(10, 19, 23, 0.85)');
      botGrad.addColorStop(1, 'rgba(10, 19, 23, 0.96)');
      ctx.fillStyle = botGrad;
      ctx.fillRect(0, h * 0.55, w, h * 0.45);

      // Aspect-ratio adaptive scale: normalize to min dimension so 16:9 landscape doesn't blow up
      const isLandscape = w > h;
      const isSquare = Math.abs(w - h) / Math.max(w, h) < 0.05;
      const isVertical = h / w >= 1.4;
      const scale = Math.min(w / 720, (h / 720) * 1.05);

      // 1. Top Story Progress Bars
      const barY = Math.round(h * 0.035);
      const barH = Math.max(3, Math.round(4 * scale));
      const barGap = Math.max(4, Math.round(6 * scale));
      const totalBars = photos.length;
      const totalGaps = (totalBars - 1) * barGap;
      const barW = (w - w * 0.08 - totalGaps) / totalBars;
      const startX = w * 0.04;

      for (let i = 0; i < totalBars; i++) {
        const bx = startX + i * (barW + barGap);
        // Track bg
        ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.beginPath();
        ctx.roundRect(bx, barY, barW, barH, 2);
        ctx.fill();

        // Fill progress
        let fillW = 0;
        if (i < photoIdx) {
          fillW = barW;
        } else if (i === photoIdx) {
          fillW = barW * pRatio;
        }
        if (fillW > 0) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(bx, barY, fillW, barH, 2);
          ctx.fill();
        }
      }

      // 2. Top Location Tag (Unboxed Editorial Kicker)
      const locFontSize = Math.max(12, Math.round(18 * scale));
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.font = `600 ${locFontSize}px 'Plus Jakarta Sans', -apple-system, sans-serif`;
      ctx.textAlign = 'left';
      ctx.fillText(listing.neighborhood.toUpperCase(), w * 0.045, barY + barH + 20 * scale);

      // 3. Middle Viral Hook Bubble (for slide 0 or 1)
      const currentPhoto = photos[photoIdx];
      const isIntro = photoIdx <= 1;

      if (isIntro && activeHook) {
        ctx.save();
        ctx.shadowColor = 'rgba(10, 19, 23, 0.5)';
        ctx.shadowBlur = 16;
        ctx.shadowOffsetY = 4;

        const hookText = activeHook;
        const hookFontSize = Math.max(16, Math.round((isLandscape ? 24 : isSquare ? 22 : 28) * scale));
        ctx.font = `600 ${hookFontSize}px 'Plus Jakarta Sans', -apple-system, sans-serif`;
        const textMetrics = ctx.measureText(hookText);
        const boxPadX = Math.round(24 * scale);
        const boxW = Math.min(w * 0.88, textMetrics.width + boxPadX * 2);
        const boxH = Math.round((isLandscape ? 58 : isSquare ? 56 : 68) * scale);
        const boxX = (w - boxW) / 2;
        const boxY = isLandscape ? h * 0.18 : isSquare ? h * 0.16 : h * 0.22;

        ctx.fillStyle = 'rgba(10, 19, 23, 0.88)';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, boxW, boxH, 12 * scale);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(hookText, w / 2, boxY + boxH * 0.62, boxW - 24);
        ctx.restore();
      }

      // 4 & 5. Lower Third Specs & Pricing (Adaptive Layout by Aspect Ratio)
      ctx.textAlign = 'left';

      if (isLandscape) {
        // Landscape (16:9): Cinematic broadcast split layout
        const bottomY = h * 0.94;
        
        // Agent Watermark on bottom right
        if (showAgentCard && listing.agent) {
          ctx.save();
          ctx.textAlign = 'right';
          const agentFontSize = Math.max(11, Math.round(15 * scale));
          ctx.font = `500 ${agentFontSize}px 'Plus Jakarta Sans', sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fillText(`Listed by ${listing.agent.name} · ${listing.agent.brokerage}`, w * 0.95, bottomY);
          ctx.restore();
        }

        // Room Tag on left
        if (currentPhoto && currentPhoto.room) {
          const roomText = currentPhoto.room.toUpperCase();
          const roomFontSize = Math.max(11, Math.round(13 * scale));
          ctx.font = `600 ${roomFontSize}px 'Plus Jakarta Sans', sans-serif`;
          const rMetrics = ctx.measureText(roomText);
          const rPadX = Math.round(12 * scale);
          const rW = rMetrics.width + rPadX * 2;
          const rH = Math.round(26 * scale);
          const rX = w * 0.045;
          const rY = h * 0.68;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.beginPath();
          ctx.roundRect(rX, rY, rW, rH, 6 * scale);
          ctx.fill();

          ctx.fillStyle = '#0a1317';
          ctx.fillText(roomText, rX + rPadX, rY + rH * 0.70);
        }

        // Price
        ctx.fillStyle = '#ffffff';
        const priceFontSize = Math.max(26, Math.round(36 * scale));
        ctx.font = `600 ${priceFontSize}px 'Playfair Display', Georgia, serif`;
        ctx.fillText(listing.priceFormatted, w * 0.045, h * 0.82);

        // Specs & Address inline
        if (showPriceTag) {
          const specsFontSize = Math.max(12, Math.round(16 * scale));
          ctx.font = `500 ${specsFontSize}px 'Plus Jakarta Sans', sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillText(
            `${listing.beds} Beds  ·  ${listing.baths} Baths  ·  ${listing.sqft?.toLocaleString()} Sq Ft  ·  ${listing.address}`,
            w * 0.045,
            h * 0.90
          );
        }
      } else {
        // Vertical (9:16), Feed (4:5), or Square (1:1): Stacked upward from bottom margin
        const bottomMargin = isVertical ? h * 0.065 : isSquare ? h * 0.045 : h * 0.055;
        let cursorY = h - bottomMargin;

        // Line 1: Agent Watermark
        if (showAgentCard && listing.agent) {
          const agentFontSize = Math.max(10, Math.round((isSquare ? 13 : 15) * scale));
          ctx.font = `500 ${agentFontSize}px 'Plus Jakarta Sans', sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.fillText(`Listed by ${listing.agent.name} · ${listing.agent.brokerage}`, w * 0.05, cursorY);
          cursorY -= Math.round(22 * scale);
        }

        // Line 2: Address
        if (showPriceTag) {
          const addrFontSize = Math.max(10, Math.round((isSquare ? 13 : 16) * scale));
          ctx.font = `400 ${addrFontSize}px 'Plus Jakarta Sans', sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
          ctx.fillText(listing.address, w * 0.05, cursorY, w * 0.9);
          cursorY -= Math.round(22 * scale);

          // Line 3: Beds / Baths / SqFt
          const specsFontSize = Math.max(11, Math.round((isSquare ? 15 : 18) * scale));
          ctx.font = `500 ${specsFontSize}px 'Plus Jakarta Sans', sans-serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.fillText(
            `${listing.beds} Beds  ·  ${listing.baths} Baths  ·  ${listing.sqft?.toLocaleString()} Sq Ft`,
            w * 0.05,
            cursorY
          );
          cursorY -= Math.round((isSquare ? 26 : 30) * scale);
        }

        // Line 4: Price
        ctx.fillStyle = '#ffffff';
        const priceFontSize = Math.max(22, Math.round((isSquare ? 28 : isVertical ? 38 : 34) * scale));
        ctx.font = `600 ${priceFontSize}px 'Playfair Display', Georgia, serif`;
        ctx.fillText(listing.priceFormatted, w * 0.05, cursorY);
        cursorY -= Math.round((isSquare ? 28 : 34) * scale);

        // Line 5: Room Tag
        if (currentPhoto && currentPhoto.room) {
          const roomText = currentPhoto.room.toUpperCase();
          const roomFontSize = Math.max(10, Math.round((isSquare ? 12 : 14) * scale));
          ctx.font = `600 ${roomFontSize}px 'Plus Jakarta Sans', sans-serif`;
          const rMetrics = ctx.measureText(roomText);
          const rPadX = Math.round(12 * scale);
          const rW = rMetrics.width + rPadX * 2;
          const rH = Math.round((isSquare ? 24 : 28) * scale);
          const rX = w * 0.05;
          const rY = cursorY - rH;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.beginPath();
          ctx.roundRect(rX, rY, rW, rH, 6 * scale);
          ctx.fill();

          ctx.fillStyle = '#0a1317';
          ctx.fillText(roomText, rX + rPadX, rY + rH * 0.70);
        }
      }

      // 6. Optional Safe Zone Guides Overlay
      if (showSafeZones) {
        ctx.save();
        ctx.setLineDash([6, 6]);
        ctx.lineWidth = 1.5;

        if (platformPreset === 'tiktok') {
          ctx.strokeStyle = 'rgba(228, 30, 63, 0.85)';
          ctx.fillStyle = 'rgba(228, 30, 63, 0.12)';
          const rightW = w * 0.18;
          ctx.fillRect(w - rightW, h * 0.45, rightW, h * 0.42);
          ctx.strokeRect(w - rightW, h * 0.45, rightW, h * 0.42);

          const botH = h * 0.18;
          ctx.fillRect(0, h - botH, w, botH);
          ctx.strokeRect(0, h - botH, w, botH);

          ctx.fillStyle = 'rgba(228, 30, 63, 0.95)';
          ctx.font = `600 ${Math.max(11, Math.round(13 * scale))}px 'Plus Jakarta Sans', sans-serif`;
          ctx.textAlign = 'right';
          ctx.fillText('TikTok UI Safe Zone', w - 16, h * 0.43);
        } else if (platformPreset === 'reels') {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
          const rightW = w * 0.16;
          ctx.fillRect(w - rightW, h * 0.50, rightW, h * 0.38);
          ctx.strokeRect(w - rightW, h * 0.50, rightW, h * 0.38);

          const botH = h * 0.16;
          ctx.fillRect(0, h - botH, w, botH);
          ctx.strokeRect(0, h - botH, w, botH);

          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.font = `600 ${Math.max(11, Math.round(13 * scale))}px 'Plus Jakarta Sans', sans-serif`;
          ctx.textAlign = 'right';
          ctx.fillText('IG Reels Safe Zone', w - 16, h * 0.48);
        } else if (platformPreset === 'shorts') {
          ctx.strokeStyle = 'rgba(228, 30, 63, 0.85)';
          ctx.fillStyle = 'rgba(228, 30, 63, 0.12)';
          const rightW = w * 0.16;
          ctx.fillRect(w - rightW, h * 0.52, rightW, h * 0.36);
          ctx.strokeRect(w - rightW, h * 0.52, rightW, h * 0.36);

          const botH = h * 0.15;
          ctx.fillRect(0, h - botH, w, botH);
          ctx.strokeRect(0, h - botH, w, botH);

          ctx.fillStyle = 'rgba(228, 30, 63, 0.95)';
          ctx.font = `600 ${Math.max(11, Math.round(13 * scale))}px 'Plus Jakarta Sans', sans-serif`;
          ctx.textAlign = 'right';
          ctx.fillText('YT Shorts Safe Zone', w - 16, h * 0.50);
        }
        ctx.restore();
      }
    },
    [listing, photos, activeHook, showAgentCard, showPriceTag, transitionEffect, showSafeZones, platformPreset]
  );

  // Render preview canvas continuously
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = activePresetConfig.previewW;
    canvas.height = activePresetConfig.previewH;

    const render = () => {
      drawFrameToCanvas(canvas, currentPhotoIdx, slideProgressRef.current);
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [drawFrameToCanvas, currentPhotoIdx, activePresetConfig]);

  // Export full video via MediaRecorder with transition effects baked in
  const handleExportVideo = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setDownloadUrl(null);

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = activePresetConfig.exportW;
    exportCanvas.height = activePresetConfig.exportH;

    const stream = exportCanvas.captureStream(30);

    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    const recorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 6000000,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setIsExporting(false);
      setExportProgress(100);
    };

    recorder.start();

    const fps = 30;
    const framesPerSlide = Math.floor(slideDuration * fps);
    const totalFrames = photos.length * framesPerSlide;
    let currentFrame = 0;

    const renderInterval = setInterval(() => {
      const photoIndex = Math.floor(currentFrame / framesPerSlide) % photos.length;
      const pRatio = (currentFrame % framesPerSlide) / framesPerSlide;

      drawFrameToCanvas(exportCanvas, photoIndex, pRatio);

      currentFrame++;
      setExportProgress(Math.floor((currentFrame / totalFrames) * 100));

      if (currentFrame >= totalFrames) {
        clearInterval(renderInterval);
        recorder.stop();
      }
    }, 1000 / fps);
  };

  // Download snapshot image of current reel frame
  const handleDownloadSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${listing.id}-${platformPreset}-${transitionEffect}-frame.png`;
    a.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 bg-white text-[#0a1317]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Interactive Video Player Viewport */}
        <div className="lg:col-span-5 flex flex-col items-center lg:sticky lg:top-24 w-full">
          {/* Aspect Ratio & Platform Header Bar */}
          <Card className="w-full flex flex-row items-center justify-between gap-2 mb-3 bg-[#f8f9fa] border-[#e5e7eb] p-2.5 rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5 text-xs text-[#0a1317] font-medium shrink-0">
              <DeviceMobile className="w-4 h-4 text-[#5d6c7b]" />
              <span className="font-semibold">Format:</span>
            </div>

            {/* Prominent Platform & Aspect Ratio Dropdown */}
            <div className="relative flex-1 max-w-[260px]">
              <select
                value={platformPreset}
                onChange={(e) => setPlatformPreset(e.target.value as SocialPlatformId)}
                aria-label="Select Social Media Aspect Ratio"
                className="w-full appearance-none bg-white border border-[#e5e7eb] hover:border-[#0a1317] rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-[#0a1317] focus:outline-none cursor-pointer transition-colors shadow-xs"
              >
                <optgroup label="9:16 Vertical Video">
                  <option value="tiktok">TikTok (9:16 Vertical)</option>
                  <option value="reels">Instagram Reels (9:16 Vertical)</option>
                  <option value="shorts">YouTube Shorts (9:16 Vertical)</option>
                </optgroup>
                <optgroup label="Feed & Web Formats">
                  <option value="feed">Instagram Feed &amp; Ads (4:5)</option>
                  <option value="square">Square Post (1:1 Feed)</option>
                  <option value="youtube">YouTube &amp; MLS Video (16:9)</option>
                </optgroup>
              </select>
              <CaretDown className="w-3.5 h-3.5 text-[#5d6c7b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </Card>

          {/* Quick Toolbar: Transition Selector & Safe Zone Toggle */}
          <div className="w-full flex items-center justify-between gap-2 mb-3 px-1 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-[#5d6c7b] font-medium text-xs">Transition:</span>
              <div className="relative">
                <select
                  value={transitionEffect}
                  onChange={(e) => setTransitionEffect(e.target.value as ReelTransitionEffect)}
                  aria-label="Choose video transition effect"
                  className="appearance-none bg-white border border-[#e5e7eb] hover:border-[#0a1317] rounded-lg pl-2.5 pr-7 py-1 text-[11px] font-medium text-[#0a1317] cursor-pointer focus:outline-none transition-colors shadow-xs"
                >
                  {TRANSITION_PRESETS.map((preset) => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name}
                    </option>
                  ))}
                </select>
                <CaretDown className="w-3 h-3 text-[#5d6c7b] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Safe Zone Toggle */}
            {aspectRatio === '9:16' && (
              <Button
                variant={showSafeZones ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowSafeZones(!showSafeZones)}
                className={`flex items-center gap-1.5 px-2.5 py-1 h-auto rounded-lg text-[11px] font-medium cursor-pointer ${
                  showSafeZones
                    ? 'bg-[#0a1317] text-white border-[#0a1317]'
                    : 'bg-white text-[#5d6c7b] border-[#e5e7eb] hover:bg-[#f8f9fa] hover:text-[#0a1317]'
                }`}
                title="Toggle social platform UI safe margins overlay"
              >
                {showSafeZones ? <Eye className="w-3 h-3 text-white" /> : <EyeSlash className="w-3 h-3 text-[#5d6c7b]" />}
                <span>Safe Guides</span>
              </Button>
            )}
          </div>

          {/* Dynamic Aspect Ratio Video Frame */}
          <div
            className={`relative w-full ${activePresetConfig.containerClass} rounded-2xl overflow-hidden shadow-md border border-[#e5e7eb] bg-black flex items-center justify-center transition-all duration-300`}
          >
            <canvas ref={canvasRef} className="w-full h-full object-cover" />

            {/* Play/Pause Overlay Touch Trigger */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="absolute inset-0 w-full h-full bg-transparent focus:outline-none flex items-center justify-center group cursor-pointer"
              aria-label={isPlaying ? 'Pause Reel' : 'Play Reel'}
            >
              {!isPlaying && (
                <div className="w-16 h-16 rounded-full bg-[#0a1317]/80 border border-white/20 flex items-center justify-center text-white shadow-xl backdrop-blur-sm group-hover:scale-105 transition-transform">
                  <Play className="w-8 h-8 ml-1 fill-white" />
                </div>
              )}
            </button>

            {/* Quick Reel Bottom Overlay Controls */}
            <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted(!isMuted);
                }}
                className="w-9 h-9 rounded-full bg-[#0a1317]/80 text-white hover:bg-[#444950] border-white/20 shadow-sm cursor-pointer"
                title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              >
                {isMuted ? <SpeakerSlash className="w-4 h-4 text-white" /> : <SpeakerHigh className="w-4 h-4 text-[#0091ff]" />}
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentPhotoIdx(0);
                  setProgress(0);
                }}
                className="w-9 h-9 rounded-full bg-[#0a1317]/80 text-white hover:bg-[#444950] border-white/20 shadow-sm cursor-pointer"
                title="Restart Reel"
                aria-label="Restart Reel"
              >
                <ArrowCounterClockwise className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>

          {/* Player status below video with clean unboxed metadata */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-[11px] text-[#5d6c7b] font-mono">
            <span className="text-[#0a1317] font-semibold">{activePresetConfig.badge}</span>
            <span aria-hidden="true" className="text-[#ced0d4]">·</span>
            <span>{activePresetConfig.exportW}×{activePresetConfig.exportH} px</span>
            <span aria-hidden="true" className="text-[#ced0d4]">·</span>
            <span className="capitalize">{TRANSITION_PRESETS.find((t) => t.id === transitionEffect)?.name.split(' ')[0]} Effect</span>
            <span aria-hidden="true" className="text-[#ced0d4]">·</span>
            <span>Slide {currentPhotoIdx + 1} of {photos.length}</span>
            <span aria-hidden="true" className="text-[#ced0d4]">·</span>
            <span>{(photos.length * slideDuration).toFixed(0)}s Total</span>
          </div>
        </div>

        {/* Right: Customization Controls & Export Engine using shadcn Cards */}
        <div className="lg:col-span-7 space-y-5 w-full">
          {/* Header Card */}
          <Card className="bg-white border-[#e5e7eb] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5d6c7b]">
                Multi-Platform Real Estate Video
              </span>
              <span className="text-[11px] font-mono text-[#5d6c7b]">
                9:16 · 1:1 · 16:9
              </span>
            </div>
            <CardTitle className="font-serif text-2xl font-normal text-[#0a1317] tracking-tight mb-1">
              Kinetic Architectural Reel Studio
            </CardTitle>
            <CardDescription className="text-xs text-[#5d6c7b] font-normal leading-relaxed">
              Automated high-retention video production with rhythmic photo panning, royalty-free audio, and instant 4K WebM/MP4 export.
            </CardDescription>
          </Card>

          {/* Platform & Aspect Ratio Selection Cards */}
          <Card className="bg-white border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#0a1317] flex items-center gap-2">
                <DeviceMobile className="w-4 h-4 text-[#0a1317]" />
                <span>Target Platform &amp; Aspect Ratio</span>
              </label>
              <span className="text-[10px] font-mono text-[#8595a4]">
                Auto-calculated FOV
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ASPECT_RATIO_PRESETS.map((preset) => {
                const isSelected = platformPreset === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setPlatformPreset(preset.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0a1317] bg-[#f8f9fa] text-[#0a1317] shadow-xs ring-1 ring-[#0a1317]'
                        : 'border-[#e5e7eb] bg-white hover:bg-[#f8f9fa] text-[#5d6c7b]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#0a1317]">{preset.platform}</span>
                      <span className="text-[10px] font-mono text-[#5d6c7b]">
                        {preset.aspectRatio}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#5d6c7b] truncate mt-0.5">{preset.sublabel}</div>
                    <div className="text-[10px] font-mono text-[#8595a4] mt-1">
                      {preset.exportW}×{preset.exportH} px
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* VIDEO TRANSITION EFFECTS SELECTION TOOL */}
          <Card className="bg-white border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block">
                  Motion Choreography
                </span>
                <label className="text-sm font-semibold text-[#0a1317] flex items-center gap-2">
                  <MagicWand className="w-4 h-4 text-[#5d6c7b]" />
                  <span>Video Transition Effects</span>
                </label>
              </div>
              <span className="text-[10px] font-mono text-[#5d6c7b]">
                {TRANSITION_PRESETS.find((t) => t.id === transitionEffect)?.name}
              </span>
            </div>
            <p className="text-xs text-[#5d6c7b] leading-relaxed font-normal">
              Applied between architectural photos in the reel. Rendered in real-time and baked into video exports.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {TRANSITION_PRESETS.map((preset) => {
                const IconComponent = preset.icon;
                const isSelected = transitionEffect === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setTransitionEffect(preset.id)}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-[#0a1317] bg-[#f8f9fa] text-[#0a1317] shadow-xs'
                        : 'border-[#e5e7eb] bg-white hover:bg-[#f8f9fa] text-[#5d6c7b]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-7 h-7 rounded-md flex items-center justify-center ${
                              isSelected ? 'bg-[#0a1317] text-white' : 'bg-[#f8f9fa] border border-[#e5e7eb] text-[#0a1317]'
                            }`}
                          >
                            <IconComponent className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs font-semibold text-[#0a1317]">{preset.name.split(' ')[0]}</span>
                        </div>
                        <span className="text-[10px] font-mono text-[#5d6c7b]">
                          {preset.tag}
                        </span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-[#5d6c7b] line-clamp-2 font-normal">
                        {preset.description}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-[#e5e7eb] flex items-center justify-between text-[10px] font-mono">
                      <span className={isSelected ? 'text-[#0a1317] font-semibold' : 'text-[#8595a4]'}>
                        {isSelected ? 'Active Transition' : 'Select'}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#0a1317]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Hook Selector Card */}
          <Card className="bg-white border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block">
                  Engagement Hook
                </span>
                <label className="text-sm font-semibold text-[#0a1317] flex items-center gap-2">
                  <Sparkle className="w-4 h-4 text-[#5d6c7b]" />
                  <span>Opening Viral Hook (First 3 Seconds)</span>
                </label>
              </div>
              <span className="text-[10px] font-mono text-[#5d6c7b]">
                Pique Curiosity
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {HOOK_PRESETS.map((hook, i) => {
                const isSelected = activeHook === hook;
                return (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveHook(hook);
                      setCustomHookText('');
                    }}
                    className={`w-full text-left p-3 rounded-lg text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border border-[#0a1317] bg-[#f8f9fa] text-[#0a1317] shadow-xs'
                        : 'border border-[#e5e7eb] bg-white hover:bg-[#f8f9fa] text-[#5d6c7b]'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-[#0a1317] font-mono font-bold shrink-0">#{i + 1}</span>
                      <span className="leading-relaxed font-normal text-[#0a1317]">"{hook}"</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom hook input */}
            <div className="pt-1">
              <Input
                type="text"
                placeholder="Or type custom opening hook..."
                value={customHookText}
                onChange={(e) => {
                  setCustomHookText(e.target.value);
                  setActiveHook(e.target.value);
                }}
                className="bg-[#f8f9fa] border-[#e5e7eb] focus-visible:border-[#0a1317] focus-visible:bg-white rounded-lg px-3 py-1.5 text-xs text-[#0a1317] h-9"
              />
            </div>
          </Card>

          {/* Soundtrack Selection Card */}
          <Card className="bg-white border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block">
                Audio Score
              </span>
              <label className="text-sm font-semibold text-[#0a1317] flex items-center gap-2">
                <MusicNotes className="w-4 h-4 text-[#5d6c7b]" />
                <span>Soundtrack &amp; Audio Vibe</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {AUDIO_TRACKS.map((track) => {
                const isSelected = activeTrack === track.id;
                return (
                  <button
                    key={track.id}
                    onClick={() => {
                      setActiveTrack(track.id);
                      if (isMuted) setIsMuted(false);
                    }}
                    className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0a1317] bg-[#f8f9fa] text-[#0a1317] shadow-xs'
                        : 'border border-[#e5e7eb] bg-white hover:bg-[#f8f9fa] text-[#5d6c7b]'
                    }`}
                  >
                    <div className="text-xs font-semibold text-[#0a1317] mb-0.5">{track.name}</div>
                    <div className="text-[10px] font-mono text-[#5d6c7b]">{track.bpm} BPM · {track.genre}</div>
                    <div className="text-[11px] text-[#5d6c7b] mt-1 font-normal">{track.mood}</div>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Slide Timing & Elements Card */}
          <Card className="bg-white border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block">
                Pacing &amp; Watermarks
              </span>
              <label className="text-sm font-semibold text-[#0a1317] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#5d6c7b]" />
                <span>Pacing &amp; Overlays</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#5d6c7b] mb-1.5 block font-medium">
                  Seconds per photo: <span className="text-[#0a1317] font-mono font-semibold">{slideDuration}s</span>
                </label>
                <div className="flex gap-2">
                  {[2.5, 3.5, 4.5].map((sec) => (
                    <Button
                      key={sec}
                      variant={slideDuration === sec ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSlideDuration(sec)}
                      className={`flex-1 rounded-lg text-xs font-medium h-auto py-1.5 cursor-pointer ${
                        slideDuration === sec
                          ? 'bg-[#0a1317] hover:bg-[#202529] text-white'
                          : 'bg-white border-[#e5e7eb] text-[#5d6c7b] hover:bg-[#f8f9fa] hover:text-[#0a1317]'
                      }`}
                    >
                      {sec}s {sec === 2.5 ? '(Fast)' : sec === 3.5 ? '(Standard)' : '(Relaxed)'}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-[#5d6c7b] mb-1.5 block font-medium">Visible Overlays</label>
                <div className="flex gap-2">
                  <Button
                    variant={showPriceTag ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowPriceTag(!showPriceTag)}
                    className={`flex-1 rounded-lg text-xs font-medium h-auto py-1.5 px-2 cursor-pointer ${
                      showPriceTag
                        ? 'bg-[#0a1317] hover:bg-[#202529] text-white border-[#0a1317]'
                        : 'bg-white text-[#5d6c7b] border-[#e5e7eb] hover:bg-[#f8f9fa] hover:text-[#0a1317]'
                    }`}
                  >
                    Price &amp; Specs
                  </Button>
                  <Button
                    variant={showAgentCard ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setShowAgentCard(!showAgentCard)}
                    className={`flex-1 rounded-lg text-xs font-medium h-auto py-1.5 px-2 cursor-pointer ${
                      showAgentCard
                        ? 'bg-[#0a1317] hover:bg-[#202529] text-white border-[#0a1317]'
                        : 'bg-white text-[#5d6c7b] border-[#e5e7eb] hover:bg-[#f8f9fa] hover:text-[#0a1317]'
                    }`}
                  >
                    Agent Watermark
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Voiceover Script Teleprompter Card */}
          {suggestedVoiceover && suggestedVoiceover.length > 0 && (
            <Card className="bg-white border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0a1317] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Microphone className="w-3.5 h-3.5 text-[#5d6c7b]" />
                  <span>Teleprompter Voiceover Script</span>
                </span>
                <span className="text-[10px] font-mono text-[#5d6c7b]">
                  Read aloud while recording
                </span>
              </div>
              <div className="space-y-2">
                {suggestedVoiceover.map((line, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border text-xs leading-relaxed transition-colors ${
                      idx === currentPhotoIdx
                        ? 'border-[#0a1317] bg-[#f8f9fa] text-[#0a1317] font-medium'
                        : 'border-[#e5e7eb] bg-white text-[#5d6c7b]'
                    }`}
                  >
                    <span className="text-[#0a1317] mr-2 font-mono font-semibold">
                      0:{String(idx * 4).padStart(2, '0')}s
                    </span>
                    {line}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Export & Download Bar */}
          <Card className="bg-white border-[#e5e7eb] rounded-2xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
              <Button
                onClick={handleExportVideo}
                disabled={isExporting}
                className="w-full sm:w-auto flex-1 bg-[#0a1317] hover:bg-[#202529] text-white font-medium px-6 py-2.5 h-10 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 text-xs disabled:opacity-40 cursor-pointer"
              >
                <DownloadSimple className="w-4 h-4" />
                <span>
                  {isExporting
                    ? `Rendering ${activePresetConfig.badge} Video (${exportProgress}%)...`
                    : `Export ${activePresetConfig.badge} (${activePresetConfig.exportW}×${activePresetConfig.exportH}) Video`}
                </span>
              </Button>

              <Button
                variant="outline"
                onClick={handleDownloadSnapshot}
                className="w-full sm:w-auto bg-white hover:bg-[#f8f9fa] text-[#0a1317] font-medium px-5 py-2.5 h-10 rounded-lg border border-[#e5e7eb] transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer shadow-xs"
                title="Download high-resolution still image"
              >
                <Camera className="w-4 h-4 text-[#5d6c7b]" />
                <span>Save Still Frame</span>
              </Button>
            </div>

            {isExporting && (
              <div className="w-full space-y-1.5 pt-1">
                <div className="flex justify-between text-[10px] font-mono text-[#5d6c7b]">
                  <span>Encoding frames via MediaRecorder...</span>
                  <span className="text-[#0a1317] font-semibold">{exportProgress}%</span>
                </div>
                <Progress value={exportProgress} className="h-1.5 w-full bg-[#f8f9fa]" />
              </div>
            )}
          </Card>

          {/* Download ready notification */}
          {downloadUrl && (
            <Alert variant="default" className="p-3.5 rounded-lg flex items-center justify-between shadow-xs border-[#e5e7eb] bg-[#f8f9fa]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-xs font-medium text-[#0a1317]">
                  Your {activePresetConfig.badge} ({activePresetConfig.exportW}×{activePresetConfig.exportH}) video is ready.
                </span>
              </div>
              <a
                href={downloadUrl}
                download={`${listing.id}-${platformPreset}-${transitionEffect}-video.webm`}
                className="bg-[#0a1317] hover:bg-[#202529] text-white font-medium px-3.5 py-1.5 rounded-md text-xs transition-colors shrink-0 shadow-xs"
              >
                Download Video
              </a>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};
