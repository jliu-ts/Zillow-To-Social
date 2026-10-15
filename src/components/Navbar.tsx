import React, { useState } from 'react';
import { Sparkle, MagnifyingGlass, ArrowsClockwise, Compass } from '@phosphor-icons/react';
import { PropertyListing } from '../types/property';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AgentBrandKitSheet } from './AgentBrandKit/AgentBrandKitSheet';
import { AgentInfo } from '../types/property';

interface NavbarProps {
  onLoadUrl: (url: string) => Promise<void>;
  isLoading: boolean;
  curatedListings: PropertyListing[];
  onSelectCurated: (listing: PropertyListing) => void;
  activeListingId?: string;
  activeListing?: PropertyListing | null;
  onUpdateAgent?: (updatedAgent: AgentInfo) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onLoadUrl,
  isLoading,
  curatedListings,
  onSelectCurated,
  activeListingId,
  activeListing,
  onUpdateAgent,
}) => {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUrl.trim()) {
      onLoadUrl(inputUrl.trim());
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      {/* Top Hairline Announcement Bar (Editorial Restraint) */}
      <div className="w-full bg-[#0a1317] text-white py-1.5 px-4 sm:px-6 text-[11px] border-b border-white/10">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-white/90">ZillowReel Studio</span>
            <span aria-hidden="true" className="text-white/30">·</span>
            <span className="text-white/70 truncate">
              Spatial 3D Walkthroughs, 9:16 Reels &amp; Editorial Social Carousels
            </span>
          </div>
          <span className="hidden md:inline-flex items-center text-[10px] text-white/50 font-mono shrink-0">
            Confidential Media Kit
          </span>
        </div>
      </div>

      {/* Main Top Navigation Bar (White, Hairline Border) */}
      <div className="w-full border-b border-[#e5e7eb] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 min-h-[58px]">
          {/* Brand Mark */}
          <div className="flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#0a1317] text-white flex items-center justify-center font-bold">
                <Compass className="w-4 h-4 text-white" />
              </div>
              <div className="leading-tight">
                <span className="font-serif text-base text-[#0a1317] tracking-tight">
                  ZillowReel <span className="font-sans font-light text-[#5d6c7b] text-xs">Studio</span>
                </span>
              </div>
            </div>

            {/* Mobile Category Tabs */}
            <div className="flex md:hidden items-center gap-1 overflow-x-auto no-scrollbar max-w-[200px]">
              {curatedListings.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectCurated(c)}
                  className={`rounded-md text-[11px] font-medium px-2.5 py-1 transition-colors shrink-0 cursor-pointer ${
                    activeListingId === c.id
                      ? 'bg-[#0a1317] text-white font-semibold'
                      : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-[#f8f9fa]'
                  }`}
                >
                  {c.neighborhood.split(',')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar with Tactile Button (No Sparkle Slop) */}
          <form onSubmit={handleSubmit} className="flex-1 max-w-full md:max-w-xl flex items-center gap-2">
            <div className="relative flex-1">
              <MagnifyingGlass className="w-3.5 h-3.5 text-[#8595a4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                placeholder="Paste any Zillow URL (e.g. zillow.com/homedetails/...)"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                className="w-full bg-[#f8f9fa] hover:bg-[#f1f4f7] focus-visible:bg-white border-[#e5e7eb] focus-visible:border-[#0a1317] rounded-lg pl-9 pr-4 py-2 text-xs font-normal text-[#0a1317] placeholder:text-[#8595a4] transition-all h-9"
              />
            </div>
            <Button
              type="submit"
              disabled={isLoading || !inputUrl.trim()}
              className="bg-[#0a1317] hover:bg-[#202529] active:bg-[#000000] text-white font-semibold px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 disabled:opacity-40 shrink-0 cursor-pointer shadow-xs h-9"
            >
              {isLoading && <ArrowsClockwise className="w-3.5 h-3.5 animate-spin" />}
              <span>{isLoading ? 'Parsing...' : 'Ingest Listing'}</span>
            </Button>
          </form>

          {/* Desktop Curated Properties & Brand Kit */}
          <div className="hidden md:flex items-center gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
            <span className="text-[10px] font-bold text-[#8595a4] uppercase tracking-wider mr-1">
              Presets:
            </span>
            {curatedListings.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectCurated(c)}
                className={`rounded-md text-xs font-medium px-2.5 py-1.5 transition-colors shrink-0 cursor-pointer ${
                  activeListingId === c.id
                    ? 'bg-[#0a1317] text-white font-semibold shadow-xs'
                    : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-[#f8f9fa]'
                }`}
              >
                {c.neighborhood.split(',')[0]}
              </button>
            ))}

            {activeListing && onUpdateAgent && (
              <div className="ml-1 pl-2 border-l border-[#e5e7eb]">
                <AgentBrandKitSheet listing={activeListing} onUpdateAgent={onUpdateAgent} />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

