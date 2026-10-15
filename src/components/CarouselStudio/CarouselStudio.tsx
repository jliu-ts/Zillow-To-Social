import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PropertyListing, CarouselTheme, AspectRatioType, CarouselSlide } from '../../types/property';
import {
  CaretLeft,
  CaretRight,
  DownloadSimple,
  Palette,
  SquaresFour,
  Check,
  FileImage,
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
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CarouselStudioProps {
  listing: PropertyListing;
  suggestedHook?: string;
  suggestedSlidesContent?: { slide: number; title: string; subtitle: string }[];
}

export const CarouselStudio: React.FC<CarouselStudioProps> = ({
  listing,
  suggestedHook,
}) => {
  const [theme, setTheme] = useState<CarouselTheme>('luxe-noir');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('portrait');
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const photos = listing.photos && listing.photos.length > 0 ? listing.photos : [];

  const [slides, setSlides] = useState<CarouselSlide[]>([
    {
      id: 'slide-1',
      type: 'cover',
      badge: 'JUST LISTED',
      title: suggestedHook || `Is this the cleanest modern home in ${listing.neighborhood}?`,
      subtitle: `${listing.priceFormatted} • ${listing.neighborhood}`,
      photoUrl: photos[0]?.url,
    },
    {
      id: 'slide-2',
      type: 'specs',
      badge: 'AT A GLANCE',
      title: 'The Numbers & Fast Facts',
      subtitle: listing.address,
      specs: [
        { label: 'Offered At', value: listing.priceFormatted },
        { label: 'Bedrooms', value: `${listing.beds} Suites` },
        { label: 'Bathrooms', value: `${listing.baths} Baths` },
        { label: 'Interior Living', value: `${listing.sqft?.toLocaleString()} Sq Ft` },
        { label: 'Lot Size', value: listing.lotSize || '0.75 Acres' },
        { label: 'Year Built', value: `${listing.yearBuilt}` },
      ],
    },
    {
      id: 'slide-3',
      type: 'room',
      badge: 'ENTERTAINING',
      title: photos[1]?.title || 'The Grand Great Room',
      subtitle: photos[1]?.caption || '14ft ceilings with disappearing Fleetwood glass walls.',
      photoUrl: photos[1]?.url,
    },
    {
      id: 'slide-4',
      type: 'room',
      badge: 'CULINARY',
      title: photos[2]?.title || 'Chef’s Calacatta Kitchen',
      subtitle: photos[2]?.caption || 'Book-matched marble waterfall island with integrated Gaggenau appliances.',
      photoUrl: photos[2]?.url,
    },
    {
      id: 'slide-5',
      type: 'room',
      badge: 'PRIMARY RETREAT',
      title: photos[3]?.title || 'The Primary Sanctuary',
      subtitle: photos[3]?.caption || 'Private terrace, morning bar, and custom dressing room.',
      photoUrl: photos[3]?.url,
    },
    {
      id: 'slide-6',
      type: 'room',
      badge: 'OUTDOOR LIVING',
      title: photos[4]?.title || 'Sunset Infinity Pool',
      subtitle: photos[4]?.caption || 'Zero-edge pool overlooking unobstructed panoramic views.',
      photoUrl: photos[4]?.url,
    },
    {
      id: 'slide-7',
      type: 'agent',
      badge: 'EXCLUSIVE ACCESS',
      title: 'Schedule a Private Showing',
      subtitle: 'Direct DM for VIP floor plan & private viewing appointments.',
      specs: [
        { label: 'Listing Agent', value: listing.agent.name },
        { label: 'Brokerage', value: listing.agent.brokerage },
        { label: 'Direct Phone', value: listing.agent.phone },
        { label: 'Instagram', value: listing.agent.instagram },
      ],
    },
  ]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render a specific slide to a canvas with precise aspect ratio preservation & zero image distortion
  const renderSlideToCanvas = useCallback(
    (canvas: HTMLCanvasElement, slide: CarouselSlide, currentTheme: CarouselTheme, currentAspect: AspectRatioType): Promise<void> => {
      return new Promise((resolve) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve();

        const w = 1080;
        const h = currentAspect === 'story' ? 1920 : currentAspect === 'portrait' ? 1350 : 1080;
        canvas.width = w;
        canvas.height = h;

        // Helper to draw images in cover mode with zero stretching or distortion
        const drawCoverImage = (
          img: HTMLImageElement,
          x: number,
          y: number,
          targetW: number,
          targetH: number
        ) => {
          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, targetW, targetH);
          ctx.clip();

          const imgAspect = img.naturalWidth / img.naturalHeight;
          const targetAspect = targetW / targetH;
          let renderW = targetW;
          let renderH = targetH;
          if (imgAspect > targetAspect) {
            renderW = targetH * imgAspect;
          } else {
            renderH = targetW / imgAspect;
          }
          const renderX = x + (targetW - renderW) / 2;
          const renderY = y + (targetH - renderH) / 2;

          ctx.drawImage(img, renderX, renderY, renderW, renderH);
          ctx.restore();
        };

        // Theme Color Schemes
        const themeConfigs = {
          'luxe-noir': {
            bg: '#0a1317',
            cardBg: 'rgba(28, 30, 33, 0.94)',
            accent: '#0064e0',
            accentSoft: 'rgba(0, 100, 224, 0.15)',
            textPrimary: '#ffffff',
            textSecondary: '#dee3e9',
            border: '#444950',
          },
          'modern-minimal': {
            bg: '#f1f4f7',
            cardBg: 'rgba(255, 255, 255, 0.95)',
            accent: '#0064e0',
            accentSoft: 'rgba(0, 100, 224, 0.10)',
            textPrimary: '#0a1317',
            textSecondary: '#5d6c7b',
            border: '#dee3e9',
          },
          'vogue-editorial': {
            bg: '#1c1e21',
            cardBg: 'rgba(10, 19, 23, 0.92)',
            accent: '#f7b928',
            accentSoft: 'rgba(247, 185, 40, 0.12)',
            textPrimary: '#ffffff',
            textSecondary: '#ced0d4',
            border: '#4b4c4f',
          },
          'emerald-estate': {
            bg: '#071b15',
            cardBg: 'rgba(10, 33, 26, 0.94)',
            accent: '#31a24c',
            accentSoft: 'rgba(49, 162, 76, 0.15)',
            textPrimary: '#f0fdf4',
            textSecondary: '#a7f3d0',
            border: '#164e3c',
          },
        };

        const cfg = themeConfigs[currentTheme] || themeConfigs['luxe-noir'];

        ctx.fillStyle = cfg.bg;
        ctx.fillRect(0, 0, w, h);

        const isSquare = currentAspect === 'square';
        const isStory = currentAspect === 'story';

        const drawElements = (img: HTMLImageElement | null) => {
          if (slide.type === 'cover') {
            const imgH = isStory ? h * 0.70 : isSquare ? h * 0.56 : h * 0.66;
            if (img && img.complete) {
              drawCoverImage(img, 0, 0, w, imgH);
              const grad = ctx.createLinearGradient(0, imgH * 0.45, 0, imgH + 20);
              grad.addColorStop(0, 'rgba(0,0,0,0)');
              grad.addColorStop(1, cfg.bg);
              ctx.fillStyle = grad;
              ctx.fillRect(0, imgH * 0.45, w, imgH * 0.55 + 20);
            }

            if (slide.badge) {
              ctx.fillStyle = cfg.accent;
              ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
              ctx.fillText(slide.badge.toUpperCase(), 72, isStory ? 90 : isSquare ? 72 : 80);
            }

            ctx.fillStyle = cfg.textPrimary;
            const titleFontSize = isStory ? 50 : isSquare ? 40 : 46;
            ctx.font = `600 ${titleFontSize}px "Playfair Display", Georgia, serif`;
            const words = slide.title.split(' ');
            let line = '';
            let lineY = isStory ? h * 0.74 : isSquare ? h * 0.61 : h * 0.71;
            const lineSpacing = isStory ? 62 : isSquare ? 50 : 58;

            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + ' ';
              const metrics = ctx.measureText(testLine);
              if (metrics.width > w - 144 && n > 0) {
                ctx.fillText(line, 72, lineY);
                line = words[n] + ' ';
                lineY += lineSpacing;
              } else {
                line = testLine;
              }
            }
            ctx.fillText(line, 72, lineY);

            ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = cfg.accent;
            ctx.fillText(slide.subtitle, 72, lineY + (isStory ? 60 : isSquare ? 48 : 56));

            ctx.font = '600 17px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = cfg.textSecondary;
            ctx.fillText('SWIPE FOR TOUR →', 72, h - (isStory ? 70 : isSquare ? 50 : 60));

            ctx.textAlign = 'right';
            ctx.fillText(`${listing.agent.brokerage}`, w - 72, h - (isStory ? 70 : isSquare ? 50 : 60));
            ctx.textAlign = 'left';
          } else if (slide.type === 'specs') {
            ctx.strokeStyle = cfg.border;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(60, 60, w - 120, h - 120, 20);
            ctx.stroke();

            ctx.fillStyle = cfg.accent;
            ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(slide.badge?.toUpperCase() || 'SPECIFICATIONS', 100, isStory ? 130 : isSquare ? 110 : 120);

            ctx.fillStyle = cfg.textPrimary;
            ctx.font = `600 ${isStory ? 52 : isSquare ? 42 : 48}px "Playfair Display", Georgia, serif`;
            ctx.fillText(slide.title, 100, isStory ? 200 : isSquare ? 168 : 185);

            ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
            ctx.fillStyle = cfg.textSecondary;
            ctx.fillText(slide.subtitle, 100, isStory ? 250 : isSquare ? 210 : 230);

            if (slide.specs) {
              const gridStartX = 100;
              const gridStartY = isStory ? 320 : isSquare ? 245 : 275;
              const colW = (w - 200 - 36) / 2;
              const rowH = isStory ? 160 : isSquare ? 115 : 140;
              const gapY = isStory ? 24 : isSquare ? 16 : 22;

              slide.specs.forEach((sp, idx) => {
                const col = idx % 2;
                const row = Math.floor(idx / 2);
                const bx = gridStartX + col * (colW + 36);
                const by = gridStartY + row * (rowH + gapY);

                ctx.fillStyle = cfg.cardBg;
                ctx.beginPath();
                ctx.roundRect(bx, by, colW, rowH, 12);
                ctx.fill();

                ctx.strokeStyle = cfg.border;
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = cfg.textSecondary;
                ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
                ctx.fillText(sp.label.toUpperCase(), bx + 22, by + (isStory ? 48 : isSquare ? 38 : 44));

                ctx.fillStyle = cfg.textPrimary;
                ctx.font = `600 ${isStory ? 34 : isSquare ? 28 : 32}px "Plus Jakarta Sans", sans-serif`;
                ctx.fillText(sp.value, bx + 22, by + (isStory ? 108 : isSquare ? 82 : 96));
              });
            }

            ctx.fillStyle = cfg.textSecondary;
            ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
            ctx.fillText('SWIPE FOR ROOM TOURS →', 100, h - (isStory ? 90 : isSquare ? 65 : 80));
          } else if (slide.type === 'room') {
            const imgH = isStory ? h * 0.72 : isSquare ? h * 0.58 : h * 0.70;
            if (img && img.complete) {
              drawCoverImage(img, 0, 0, w, imgH);
              const grad = ctx.createLinearGradient(0, imgH * 0.45, 0, imgH + 20);
              grad.addColorStop(0, 'rgba(0,0,0,0)');
              grad.addColorStop(1, cfg.bg);
              ctx.fillStyle = grad;
              ctx.fillRect(0, imgH * 0.45, w, imgH * 0.55 + 20);
            }

            if (slide.badge) {
              ctx.fillStyle = cfg.accent;
              ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
              ctx.fillText(slide.badge.toUpperCase(), 72, isStory ? 90 : isSquare ? 72 : 80);
            }

            ctx.fillStyle = cfg.textPrimary;
            ctx.font = `600 ${isStory ? 46 : isSquare ? 38 : 44}px "Playfair Display", Georgia, serif`;
            ctx.fillText(slide.title, 72, isStory ? h * 0.78 : isSquare ? h * 0.66 : h * 0.77);

            ctx.fillStyle = cfg.textSecondary;
            ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(slide.subtitle, 72, isStory ? h * 0.84 : isSquare ? h * 0.73 : h * 0.83, w - 144);

            ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
            ctx.fillText('CONTINUE EXPLORING →', 72, h - (isStory ? 70 : isSquare ? 50 : 60));

            ctx.textAlign = 'right';
            ctx.fillText(listing.neighborhood, w - 72, h - (isStory ? 70 : isSquare ? 50 : 60));
            ctx.textAlign = 'left';
          } else if (slide.type === 'agent') {
            ctx.strokeStyle = cfg.border;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(60, 60, w - 120, h - 120, 20);
            ctx.stroke();

            ctx.fillStyle = cfg.accent;
            ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(slide.badge?.toUpperCase() || 'EXCLUSIVE SHOWING', 100, isStory ? 130 : isSquare ? 110 : 125);

            ctx.fillStyle = cfg.textPrimary;
            ctx.font = `600 ${isStory ? 52 : isSquare ? 42 : 48}px "Playfair Display", Georgia, serif`;
            ctx.fillText(slide.title, 100, isStory ? 200 : isSquare ? 170 : 195);

            ctx.fillStyle = cfg.textSecondary;
            ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
            ctx.fillText(slide.subtitle, 100, isStory ? 250 : isSquare ? 215 : 245);

            if (slide.specs) {
              const startY = isStory ? 360 : isSquare ? 260 : 310;
              const cardH = isStory ? 104 : isSquare ? 76 : 90;
              const gapY = isStory ? 18 : isSquare ? 12 : 16;
              slide.specs.forEach((sp, idx) => {
                const cy = startY + idx * (cardH + gapY);
                ctx.fillStyle = cfg.cardBg;
                ctx.beginPath();
                ctx.roundRect(100, cy, w - 200, cardH, 12);
                ctx.fill();

                ctx.strokeStyle = cfg.border;
                ctx.lineWidth = 1;
                ctx.stroke();

                ctx.fillStyle = cfg.textSecondary;
                ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
                ctx.fillText(sp.label, 130, cy + (isStory ? 60 : isSquare ? 46 : 54));

                ctx.textAlign = 'right';
                ctx.fillStyle = cfg.textPrimary;
                ctx.font = `600 ${isStory ? 26 : isSquare ? 22 : 24}px "Plus Jakarta Sans", sans-serif`;
                ctx.fillText(sp.value, w - 130, cy + (isStory ? 60 : isSquare ? 46 : 54));
                ctx.textAlign = 'left';
              });
            }
          }
          resolve();
        };

        if (slide.photoUrl) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = slide.photoUrl;
          img.onload = () => drawElements(img);
          img.onerror = () => drawElements(null);
        } else {
          drawElements(null);
        }
      });
    },
    [listing]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cur = slides[activeSlideIdx];
    if (cur) {
      renderSlideToCanvas(canvas, cur, theme, aspectRatio);
    }
  }, [activeSlideIdx, slides, theme, aspectRatio, renderSlideToCanvas]);

  const handleDownloadActiveSlide = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${listing.id}-slide-${activeSlideIdx + 1}.png`;
    a.click();
  };

  const handleDownloadAllSlides = async () => {
    setIsExportingAll(true);
    setExportNotice('Rendering slides...');

    const tempCanvas = document.createElement('canvas');

    for (let i = 0; i < slides.length; i++) {
      setExportNotice(`Exporting Slide ${i + 1} of ${slides.length}...`);
      await renderSlideToCanvas(tempCanvas, slides[i], theme, aspectRatio);
      const url = tempCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `${listing.id}-carousel-slide-${i + 1}.png`;
      a.click();
      await new Promise((r) => setTimeout(r, 400));
    }

    setIsExportingAll(false);
    setExportNotice('All slides exported successfully!');
    setTimeout(() => setExportNotice(null), 4000);
  };

  const currentSlide = slides[activeSlideIdx];

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 bg-white text-[#0a1317]">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left: Interactive Carousel Preview */}
        <div className="lg:col-span-6 flex flex-col items-center lg:sticky lg:top-24 w-full">
          <Card className="relative w-full max-w-[440px] bg-[#f8f9fa] rounded-2xl p-3 sm:p-4 border-[#e5e7eb] shadow-xs flex flex-col items-center">
            {/* Canvas Slide Viewport */}
            <div
              className={`relative w-full overflow-hidden rounded-xl bg-[#0a1317] flex items-center justify-center shadow-inner transition-all duration-200 ${
                aspectRatio === 'story'
                  ? 'aspect-[9/16] max-w-[320px]'
                  : aspectRatio === 'portrait'
                  ? 'aspect-[4/5] max-w-[360px]'
                  : 'aspect-square max-w-[380px]'
              }`}
            >
              <canvas ref={canvasRef} className="w-full h-full object-contain" />

              {/* Prev / Next Buttons */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setActiveSlideIdx((prev) => (prev > 0 ? prev - 1 : slides.length - 1))}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-white/95 hover:bg-white text-[#0a1317] border-[#e5e7eb] shadow-xs transition-transform active:scale-95 cursor-pointer"
                title="Previous Slide"
              >
                <CaretLeft className="w-4 h-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setActiveSlideIdx((prev) => (prev < slides.length - 1 ? prev + 1 : 0))}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-white/95 hover:bg-white text-[#0a1317] border-[#e5e7eb] shadow-xs transition-transform active:scale-95 cursor-pointer"
                title="Next Slide"
              >
                <CaretRight className="w-4 h-4" />
              </Button>

              {/* Top Slide Number Indicator */}
              <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded-md shadow-xs">
                {activeSlideIdx + 1} / {slides.length}
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            <div className="w-full mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`w-14 sm:w-16 h-18 rounded-lg overflow-hidden border shrink-0 relative transition-all cursor-pointer ${
                    idx === activeSlideIdx
                      ? 'border-[#0a1317] ring-1 ring-[#0a1317] scale-102 shadow-xs'
                      : 'border-[#e5e7eb] opacity-65 hover:opacity-100'
                  }`}
                >
                  {s.photoUrl ? (
                    <img src={s.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-[#f8f9fa] flex items-center justify-center text-[10px] text-[#5d6c7b] font-mono">
                      {idx + 1}
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 bg-[#0a1317]/85 text-[9px] text-center text-white py-0.5 font-mono">
                    #{idx + 1}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Right: Theme, Typography & Slide Customizer */}
        <div className="lg:col-span-6 space-y-5 w-full">
          {/* Header Card */}
          <Card className="bg-white border-[#e5e7eb] rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b]">
                Social Media Publication Suite
              </span>
              <span className="text-[11px] font-mono text-[#5d6c7b]">
                {aspectRatio === 'story'
                  ? '1080×1920 · 9:16 Story'
                  : aspectRatio === 'portrait'
                  ? '1080×1350 · 4:5 Portrait'
                  : '1080×1080 · 1:1 Square'}
              </span>
            </div>
            <CardTitle className="font-serif text-2xl font-normal text-[#0a1317] tracking-tight mb-1">
              Architectural Multi-Slide Post
            </CardTitle>
            <CardDescription className="text-xs text-[#5d6c7b] leading-relaxed font-normal">
              Generates high-resolution social presentation cards ready for Instagram, LinkedIn, and Facebook with bespoke typography and property highlights.
            </CardDescription>
          </Card>

          {/* Theme Selector Card */}
          <Card className="bg-white border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block">
                Visual Curation
              </span>
              <label className="text-sm font-semibold text-[#0a1317] flex items-center gap-2">
                <Palette className="w-4 h-4 text-[#5d6c7b]" />
                <span>Aesthetic Theme Presets</span>
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { id: 'luxe-noir', name: 'Luxe Noir', color: 'bg-[#0a1317] text-white border-[#444950]' },
                { id: 'modern-minimal', name: 'Modern Ivory', color: 'bg-[#f8f9fa] text-[#0a1317] border-[#e5e7eb]' },
                { id: 'vogue-editorial', name: 'Vogue Serif', color: 'bg-[#1c1e21] text-[#f7b928] border-[#4b4c4f]' },
                { id: 'emerald-estate', name: 'Emerald Brass', color: 'bg-[#071b15] text-[#31a24c] border-[#164e3c]' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as CarouselTheme)}
                  className={`p-3 rounded-lg border text-center transition-all cursor-pointer ${
                    theme === t.id
                      ? 'border-[#0a1317] bg-[#f8f9fa] shadow-xs font-semibold'
                      : 'border-[#e5e7eb] bg-white hover:bg-[#f8f9fa] text-[#5d6c7b]'
                  }`}
                >
                  <div className={`w-full h-8 rounded-md mb-2 flex items-center justify-center text-xs font-serif border ${t.color}`}>
                    Aa
                  </div>
                  <span className="text-xs font-medium text-[#0a1317]">{t.name}</span>
                </button>
              ))}
            </div>

            <Separator className="bg-[#e5e7eb]" />

            {/* Aspect Ratio Selector */}
            <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs text-[#5d6c7b] font-medium">Aspect Ratio:</span>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={aspectRatio === 'portrait' ? 'default' : 'outline'}
                  onClick={() => setAspectRatio('portrait')}
                  className={`rounded-lg text-xs font-medium h-auto py-1.5 px-3 cursor-pointer ${
                    aspectRatio === 'portrait'
                      ? 'bg-[#0a1317] hover:bg-[#202529] text-white border-[#0a1317]'
                      : 'bg-white border-[#e5e7eb] text-[#5d6c7b] hover:bg-[#f8f9fa] hover:text-[#0a1317]'
                  }`}
                >
                  4:5 Portrait
                </Button>
                <Button
                  size="sm"
                  variant={aspectRatio === 'square' ? 'default' : 'outline'}
                  onClick={() => setAspectRatio('square')}
                  className={`rounded-lg text-xs font-medium h-auto py-1.5 px-3 cursor-pointer ${
                    aspectRatio === 'square'
                      ? 'bg-[#0a1317] hover:bg-[#202529] text-white border-[#0a1317]'
                      : 'bg-white border-[#e5e7eb] text-[#5d6c7b] hover:bg-[#f8f9fa] hover:text-[#0a1317]'
                  }`}
                >
                  1:1 Square
                </Button>
                <Button
                  size="sm"
                  variant={aspectRatio === 'story' ? 'default' : 'outline'}
                  onClick={() => setAspectRatio('story')}
                  className={`rounded-lg text-xs font-medium h-auto py-1.5 px-3 cursor-pointer ${
                    aspectRatio === 'story'
                      ? 'bg-[#0a1317] hover:bg-[#202529] text-white border-[#0a1317]'
                      : 'bg-white border-[#e5e7eb] text-[#5d6c7b] hover:bg-[#f8f9fa] hover:text-[#0a1317]'
                  }`}
                >
                  9:16 Story
                </Button>
              </div>
            </div>
          </Card>

          {/* Current Slide Text Editor Card */}
          {currentSlide && (
            <Card className="bg-white border-[#e5e7eb] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#0a1317] uppercase tracking-wider font-mono">
                  Slide #{activeSlideIdx + 1} ({currentSlide.type})
                </span>
                <span className="text-[10px] font-mono text-[#5d6c7b]">
                  Live Canvas Sync
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-[#0a1317] mb-1.5 block">Slide Badge Tag</label>
                <Input
                  type="text"
                  value={currentSlide.badge || ''}
                  onChange={(e) => {
                    const newSlides = [...slides];
                    newSlides[activeSlideIdx].badge = e.target.value;
                    setSlides(newSlides);
                  }}
                  className="bg-[#f8f9fa] border-[#e5e7eb] focus-visible:border-[#0a1317] focus-visible:bg-white rounded-lg px-3 py-1.5 text-xs text-[#0a1317] h-9"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#0a1317] mb-1.5 block">Headline / Title</label>
                <Input
                  type="text"
                  value={currentSlide.title}
                  onChange={(e) => {
                    const newSlides = [...slides];
                    newSlides[activeSlideIdx].title = e.target.value;
                    setSlides(newSlides);
                  }}
                  className="bg-[#f8f9fa] border-[#e5e7eb] focus-visible:border-[#0a1317] focus-visible:bg-white rounded-lg px-3 py-1.5 text-xs text-[#0a1317] h-9"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#0a1317] mb-1.5 block">Subtitle / Description</label>
                <Textarea
                  rows={2}
                  value={currentSlide.subtitle}
                  onChange={(e) => {
                    const newSlides = [...slides];
                    newSlides[activeSlideIdx].subtitle = e.target.value;
                    setSlides(newSlides);
                  }}
                  className="bg-[#f8f9fa] border-[#e5e7eb] focus-visible:border-[#0a1317] focus-visible:bg-white rounded-lg px-3 py-2 text-xs text-[#0a1317] resize-none"
                />
              </div>
            </Card>
          )}

          {/* Export Actions Card */}
          <Card className="bg-white border-[#e5e7eb] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center gap-3">
            <Button
              onClick={handleDownloadAllSlides}
              disabled={isExportingAll}
              className="w-full sm:w-auto flex-1 bg-[#0a1317] hover:bg-[#202529] text-white font-medium px-6 py-2.5 h-10 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 text-xs disabled:opacity-40 cursor-pointer"
            >
              <DownloadSimple className="w-4 h-4" />
              <span>{isExportingAll ? 'Exporting Carousel...' : `Download All ${slides.length} Slides`}</span>
            </Button>

            <Button
              variant="outline"
              onClick={handleDownloadActiveSlide}
              className="w-full sm:w-auto bg-white hover:bg-[#f8f9fa] text-[#0a1317] font-medium px-5 py-2.5 h-10 rounded-lg border border-[#e5e7eb] transition-colors flex items-center justify-center gap-2 text-xs cursor-pointer shadow-xs"
            >
              <FileImage className="w-4 h-4" />
              <span>Download Slide #{activeSlideIdx + 1}</span>
            </Button>
          </Card>

          {exportNotice && (
            <Alert variant="default" className="rounded-lg py-2 px-3 flex items-center gap-2 border-[#e5e7eb] bg-[#f8f9fa] text-[#0a1317]">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <AlertDescription className="text-xs font-medium">
                {exportNotice}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};
