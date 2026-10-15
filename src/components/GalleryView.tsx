import React, { useState } from 'react';
import { PropertyListing } from '../types/property';
import {
  Images,
  Plus,
  CheckCircle,
  FileText,
  User,
  Phone,
  IdentificationCard,
  InstagramLogo,
  Sparkle,
} from '@phosphor-icons/react';
import {
  Card,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

interface GalleryViewProps {
  listing: PropertyListing;
  onUpdateListing: (updated: PropertyListing) => void;
  onNavigateTab: (tab: 'reels' | 'carousel' | 'walkthrough') => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  listing,
  onUpdateListing,
  onNavigateTab,
}) => {
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoRoom, setNewPhotoRoom] = useState('Living Area');

  const handleAddPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoUrl.trim()) return;

    const newPhoto = {
      url: newPhotoUrl.trim(),
      title: newPhotoTitle.trim() || 'Custom Architectural View',
      room: newPhotoRoom,
      caption: 'High-resolution photo added to listing media kit.',
    };

    onUpdateListing({
      ...listing,
      photos: [...listing.photos, newPhoto],
    });

    setNewPhotoUrl('');
    setNewPhotoTitle('');
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8 bg-white text-[#0a1317]">
      {/* Top Banner with Editorial Restraint */}
      <Card className="rounded-2xl border-[#e5e7eb] p-6 shadow-xs bg-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block">
              Listing Media Kit
            </span>
            <CardTitle className="font-serif text-2xl sm:text-3xl font-normal text-[#0a1317] tracking-tight">
              {listing.photos.length} High-Resolution Architectural Assets
            </CardTitle>
            <CardDescription className="text-xs text-[#5d6c7b]">
              Curated master photography syndicating across the 3D walkthrough, Reel Studio, and Carousel Builder.
            </CardDescription>
          </div>

          {/* Action Pair with Zero-Pill Discipline */}
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              onClick={() => onNavigateTab('reels')}
              className="bg-[#0a1317] hover:bg-[#202529] text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer h-9"
            >
              <Sparkle className="w-3.5 h-3.5" />
              <span>Generate Reel</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => onNavigateTab('carousel')}
              className="bg-white hover:bg-[#f8f9fa] text-[#0a1317] font-medium px-4 py-2 rounded-lg text-xs border border-[#e5e7eb] transition-colors cursor-pointer shadow-xs h-9"
            >
              <span>Build Carousel</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Grid of Photos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {listing.photos.map((photo, idx) => (
          <Card
            key={idx}
            className="bg-white border-[#e5e7eb] rounded-xl overflow-hidden shadow-xs flex flex-col group hover:border-[#0a1317] transition-colors"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-[#0a1317]">
              <img
                src={photo.url}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md uppercase tracking-wider">
                {photo.room}
              </div>
              <div className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                #{idx + 1}
              </div>
            </div>

            <CardContent className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-semibold text-[#0a1317] mb-1">{photo.title}</h3>
                <p className="text-[11px] text-[#5d6c7b] leading-relaxed font-normal">{photo.caption}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Custom Photo Section */}
      <Card className="bg-[#f8f9fa] border-[#e5e7eb] rounded-xl p-5 shadow-xs">
        <div className="mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block mb-0.5">
            Asset Ingestion
          </span>
          <h3 className="text-xs font-semibold text-[#0a1317] flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 text-[#5d6c7b]" />
            <span>Append Custom Architectural Photo</span>
          </h3>
        </div>
        <form onSubmit={handleAddPhoto} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          <div className="sm:col-span-5">
            <Input
              type="url"
              placeholder="Image URL (e.g. https://...)"
              value={newPhotoUrl}
              onChange={(e) => setNewPhotoUrl(e.target.value)}
              className="bg-white border-[#e5e7eb] focus-visible:border-[#0a1317] rounded-lg px-3 py-1.5 text-xs text-[#0a1317] h-9"
            />
          </div>
          <div className="sm:col-span-4">
            <Input
              type="text"
              placeholder="Title (e.g. Wine Pavilion & Bar)"
              value={newPhotoTitle}
              onChange={(e) => setNewPhotoTitle(e.target.value)}
              className="bg-white border-[#e5e7eb] focus-visible:border-[#0a1317] rounded-lg px-3 py-1.5 text-xs text-[#0a1317] h-9"
            />
          </div>
          <Button
            type="submit"
            disabled={!newPhotoUrl.trim()}
            className="sm:col-span-3 bg-[#0a1317] hover:bg-[#202529] text-white font-medium px-4 py-2 rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer shadow-xs h-9"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Asset</span>
          </Button>
        </form>
      </Card>

      {/* Property Description & Architectural Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 bg-white border-[#e5e7eb] rounded-xl p-6 shadow-xs space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block">
              Architectural Summary
            </span>
            <h3 className="font-serif text-lg font-normal text-[#0a1317] tracking-tight">
              Full Property Narrative
            </h3>
          </div>
          <p className="text-xs text-[#0a1317] leading-relaxed whitespace-pre-wrap font-normal">
            {listing.description}
          </p>

          <Separator className="bg-[#e5e7eb]" />

          <div>
            <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] mb-2.5">
              Verified Architectural Attributes
            </h4>
            <div className="space-y-2">
              {listing.highlights?.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-[#0a1317]">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-normal">{h}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Agent & Brokerage Card */}
        <Card className="lg:col-span-4 bg-white border-[#e5e7eb] rounded-xl p-6 shadow-xs space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block">
              Exclusive Representation
            </span>
            <h3 className="font-serif text-lg font-normal text-[#0a1317] tracking-tight">
              Listing Advisor
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0a1317] text-white flex items-center justify-center font-bold text-sm shadow-xs">
              {listing.agent.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#0a1317]">{listing.agent.name}</h4>
              <p className="text-[11px] text-[#5d6c7b]">{listing.agent.brokerage}</p>
            </div>
          </div>

          <Separator className="bg-[#e5e7eb]" />

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#5d6c7b] flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-[#5d6c7b]" />
                <span>Direct:</span>
              </span>
              <span className="font-mono text-[#0a1317]">{listing.agent.phone}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5d6c7b] flex items-center gap-1.5">
                <IdentificationCard className="w-3 h-3 text-[#5d6c7b]" />
                <span>License:</span>
              </span>
              <span className="font-mono text-[#0a1317]">{listing.agent.license}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#5d6c7b] flex items-center gap-1.5">
                <InstagramLogo className="w-3 h-3 text-[#5d6c7b]" />
                <span>Instagram:</span>
              </span>
              <span className="font-mono text-[#0a1317]">{listing.agent.instagram}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
