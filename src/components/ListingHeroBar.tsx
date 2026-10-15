import React from 'react';
import { PropertyListing } from '../types/property';
import {
  Cube,
  FilmStrip,
  SquaresFour,
  Sparkle,
  Images,
  Bed,
  Bathtub,
  ArrowsOut,
  ArrowSquareOut,
  MapPin,
  CheckCircle,
  Globe,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type ActiveTab = 'showcase' | 'walkthrough' | 'reels' | 'carousel' | 'copy' | 'gallery';

interface ListingHeroBarProps {
  listing: PropertyListing;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const ListingHeroBar: React.FC<ListingHeroBarProps> = ({
  listing,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="w-full bg-white border-b border-[#e5e7eb] shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        {/* Top Info Bar: Architectural Editorial Layout */}
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-3 mb-3">
          <div className="min-w-0">
            {/* Unboxed Metadata (Zero-Pill Discipline) */}
            <div className="flex items-center gap-2 text-[11px] text-[#5d6c7b] mb-1.5 flex-wrap">
              <span className="font-bold text-[#0a1317] uppercase tracking-[0.15em] text-[10px]">
                {listing.status}
              </span>
              <span aria-hidden="true" className="text-[#ced0d4]">·</span>
              <span>{listing.neighborhood}</span>
              <span aria-hidden="true" className="text-[#ced0d4]">·</span>
              <span>Built {listing.yearBuilt}</span>
              {listing.url && (
                <>
                  <span aria-hidden="true" className="text-[#ced0d4]">·</span>
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#5d6c7b] hover:text-[#0a1317] underline decoration-[#dee3e9] underline-offset-4 flex items-center gap-1 transition-colors"
                  >
                    <span>MLS Direct</span>
                    <ArrowSquareOut className="w-3 h-3" />
                  </a>
                </>
              )}
            </div>

            <div className="flex items-baseline gap-3.5 flex-wrap">
              <h1 className="font-serif text-xl sm:text-2xl text-[#0a1317] tracking-tight">
                {listing.title}
              </h1>
              <span className="font-mono text-lg sm:text-xl font-medium text-[#0a1317] tracking-tight">
                {listing.priceFormatted}
              </span>
            </div>

            <p className="text-xs text-[#5d6c7b] truncate max-w-xl font-normal mt-0.5">
              {listing.address}
            </p>
          </div>

          {/* Architectural Metric Cluster (Tabular & Quiet) */}
          <div className="flex items-center gap-4 text-xs font-mono text-[#0a1317] pt-1 md:pt-0 border-t md:border-t-0 border-[#f1f4f7]">
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-sm">{listing.beds}</span>
              <span className="text-[#8595a4] text-[11px]">Beds</span>
            </div>
            <span aria-hidden="true" className="text-[#dee3e9]">/</span>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-sm">{listing.baths}</span>
              <span className="text-[#8595a4] text-[11px]">Baths</span>
            </div>
            <span aria-hidden="true" className="text-[#dee3e9]">/</span>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-sm">{listing.sqft?.toLocaleString()}</span>
              <span className="text-[#8595a4] text-[11px]">SF</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher: Quiet, Refined Segmented Control */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-[#f1f4f7] pt-2">
          {[
            { id: 'showcase', label: 'Public Showcase', icon: Globe },
            { id: 'walkthrough', label: '3D Spatial Walkthrough', icon: Cube },
            { id: 'reels', label: 'Reels Studio (9:16)', icon: FilmStrip },
            { id: 'carousel', label: 'Carousel Builder', icon: SquaresFour },
            { id: 'copy', label: 'Marketing Copy', icon: Sparkle },
            { id: 'gallery', label: 'Media Library', icon: Images },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Button
                key={tab.id}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onTabChange(tab.id as ActiveTab)}
                className={`px-3.5 py-1.5 h-auto rounded-lg text-xs font-medium flex items-center gap-2 transition-all duration-150 shrink-0 cursor-pointer active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#0a1317] hover:bg-[#202529] text-white shadow-xs font-semibold'
                    : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-[#f8f9fa] active:bg-[#f1f4f7]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-[#8595a4]'}`} />
                <span>{tab.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
