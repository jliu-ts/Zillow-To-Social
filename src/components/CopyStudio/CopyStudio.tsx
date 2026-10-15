import React, { useState } from 'react';
import { PropertyListing, AICopyOutput } from '../../types/property';
import {
  Copy,
  Check,
  Sparkle,
  ArrowsClockwise,
  FileText,
  InstagramLogo,
  EnvelopeSimple,
  VideoCamera,
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
import { Separator } from '@/components/ui/separator';
import { Select } from '@/components/ui/select';

interface CopyStudioProps {
  listing: PropertyListing;
  initialCopy?: AICopyOutput | null;
  onRefreshCopy: (tone: string) => Promise<void>;
  isLoading: boolean;
}

export const CopyStudio: React.FC<CopyStudioProps> = ({
  listing,
  initialCopy,
  onRefreshCopy,
  isLoading,
}) => {
  const [activeTab, setActiveTab] = useState<'instagram' | 'voiceover' | 'email' | 'mls'>('instagram');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedTone, setSelectedTone] = useState('luxury');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const instagramText = initialCopy?.instagramCaption || `PRIVATE OFFERING | ${listing.address}\n\nOffered at ${listing.priceFormatted}\n\nLocation: ${listing.neighborhood}\nAccommodations: ${listing.beds} Bedrooms · ${listing.baths} Bathrooms · ${listing.sqft?.toLocaleString()} Sq Ft\n\nWelcome to an architectural triumph. Perched with panoramic vistas, this residence blends modernist clean lines with bespoke natural finishes. Soaring ceilings and floor-to-ceiling glass pocket doors dissolve the boundaries between interior refinement and outdoor resort living.\n\nArchitectural Highlights:\n• ${listing.highlights?.join('\n• ')}\n\nDirect Message "@${listing.agent.instagram.replace('@', '')}" for the private walkthrough video & confidential offering memorandum.\n\nListed by ${listing.agent.name} · ${listing.agent.brokerage}\n${listing.agent.license} · ${listing.agent.phone}\n\n${initialCopy?.hashtags?.join(' ') || '#LuxuryRealEstate #ModernArchitecture #BelAir #ArchitecturalDigest #EstateTour'}`;

  const voiceoverText = initialCopy?.reelsVoiceoverScript?.join('\n\n') || `[0:00 - 0:04] Step inside one of Bel Air's most extraordinary architectural achievements, offered at ${listing.priceFormatted}.\n\n[0:04 - 0:08] Welcome to ${listing.address}, curated for seamless indoor-outdoor living.\n\n[0:08 - 0:14] Notice how the grand salon opens completely with 14-foot motorized Fleetwood pocket glass walls directly onto the heated zero-edge pool.\n\n[0:14 - 0:20] The culinary center features book-matched Italian Calacatta marble and integrated Gaggenau appliances.\n\n[0:20 - 0:26] Comment "TOUR" or send a direct message to receive private floor plans and schedule an appointment.`;

  const emailText = `Subject: Private Offering: ${listing.title} (${listing.priceFormatted})\n\nDear Client,\n\nI am pleased to present our newest exclusive architectural listing at ${listing.address}, offered at ${listing.priceFormatted}.\n\nPROPERTY OVERVIEW:\n• Location: ${listing.neighborhood}\n• Accommodations: ${listing.beds} Suites, ${listing.baths} Bathrooms\n• Living Area: ${listing.sqft?.toLocaleString()} Sq Ft\n• Lot Size: ${listing.lotSize}\n\nARCHITECTURAL ATTRIBUTES:\n${listing.highlights?.map((h) => `• ${h}`).join('\n')}\n\nPrivate showings are being scheduled this week by prior appointment only. Please contact me directly at ${listing.agent.phone} or reply to this email for the complete offering memorandum.\n\nWarm regards,\n\n${listing.agent.name}\n${listing.agent.brokerage}\n${listing.agent.phone} | ${listing.agent.instagram}`;

  const mlsText = `ARCHITECTURAL MASTERPIECE IN ${listing.neighborhood.toUpperCase()}. Striking contemporary residence boasting ${listing.sqft?.toLocaleString()} sq ft of peerless design. Featuring soaring cedar ceilings, walls of Fleetwood vanishing glass, and seamless indoor-outdoor living with heated zero-edge pool and spa. Gourmet culinary center equipped with Calacatta Gold waterfall marble island, dual dishwashers, and bespoke fluted oak cabinetry. Sumptuous primary wing with private terrace, dual boutique walk-in closets, and spa-inspired bath. Complete smart home automation with architectural lighting and security. Shown to pre-qualified buyers by appointment only.`;

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-8 space-y-6 bg-white text-[#0a1317]">
      {/* Top Banner & Tone Controls using shadcn Card */}
      <Card className="rounded-2xl border-[#e5e7eb] p-6 shadow-xs bg-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-semibold tracking-wider text-[#5d6c7b] uppercase">
              Editorial Script &amp; Copy Generation
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#0a1317] tracking-tight">
              Multi-Platform Architectural Copywriting
            </h2>
            <CardDescription className="text-xs text-[#5d6c7b]">
              Tailored marketing prose, spoken voiceover teleprompters, private client emails, and MLS copy.
            </CardDescription>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            <Select
              value={selectedTone}
              onChange={(e) => setSelectedTone(e.target.value)}
              aria-label="Editorial tone of voice"
              className="w-48 bg-[#f8f9fa]"
            >
              <option value="luxury">Ultra-Luxury Editorial</option>
              <option value="tiktok">High-Energy Viral TikTok</option>
              <option value="architectural">Architectural Connoisseur</option>
              <option value="investor">Discreet Investor Pitch</option>
            </Select>

            <Button
              onClick={() => onRefreshCopy(selectedTone)}
              disabled={isLoading}
              className="bg-[#0a1317] hover:bg-[#202529] text-white font-medium px-4 py-2 rounded-md text-xs transition-colors flex items-center gap-1.5 shadow-xs disabled:opacity-40 shrink-0 cursor-pointer h-9"
            >
              <ArrowsClockwise className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Generating...' : 'Regenerate'}</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Segmented Control for Channel Selection */}
      <div className="flex items-center gap-1.5 border-b border-[#e5e7eb] pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('instagram')}
          className={`rounded-md text-xs font-medium px-3.5 py-1.5 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'instagram'
              ? 'bg-[#0a1317] text-white font-semibold shadow-xs'
              : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-[#f8f9fa]'
          }`}
        >
          <InstagramLogo className="w-3.5 h-3.5" />
          <span>Instagram Caption</span>
        </button>

        <button
          onClick={() => setActiveTab('voiceover')}
          className={`rounded-md text-xs font-medium px-3.5 py-1.5 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'voiceover'
              ? 'bg-[#0a1317] text-white font-semibold shadow-xs'
              : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-[#f8f9fa]'
          }`}
        >
          <VideoCamera className="w-3.5 h-3.5" />
          <span>Voiceover Script</span>
        </button>

        <button
          onClick={() => setActiveTab('email')}
          className={`rounded-md text-xs font-medium px-3.5 py-1.5 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'email'
              ? 'bg-[#0a1317] text-white font-semibold shadow-xs'
              : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-[#f8f9fa]'
          }`}
        >
          <EnvelopeSimple className="w-3.5 h-3.5" />
          <span>Private Client Email</span>
        </button>

        <button
          onClick={() => setActiveTab('mls')}
          className={`rounded-md text-xs font-medium px-3.5 py-1.5 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'mls'
              ? 'bg-[#0a1317] text-white font-semibold shadow-xs'
              : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-[#f8f9fa]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>MLS Remarks</span>
        </button>
      </div>

      {/* Tab Contents using shadcn Card */}
      <Card className="rounded-2xl border-[#e5e7eb] p-6 shadow-xs bg-white relative">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="text-xs text-[#5d6c7b] font-normal flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold text-[#0a1317] uppercase tracking-wider">
              {activeTab}
            </span>
            <span aria-hidden="true" className="text-[#ced0d4]">·</span>
            <span>
              {activeTab === 'instagram' && 'Ready to publish on Instagram, Threads, and Meta'}
              {activeTab === 'voiceover' && 'Paced with 5-second markers for recording Reels & Shorts'}
              {activeTab === 'email' && 'Personalized VIP buyer outreach memorandum'}
              {activeTab === 'mls' && 'MLS character-compliant property description'}
            </span>
          </div>

          <Button
            onClick={() => {
              const textMap = {
                instagram: instagramText,
                voiceover: voiceoverText,
                email: emailText,
                mls: mlsText,
              };
              copyToClipboard(textMap[activeTab], activeTab);
            }}
            className="self-start sm:self-auto bg-[#0a1317] hover:bg-[#202529] active:bg-black text-white px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            {copiedKey === activeTab ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Text</span>
              </>
            )}
          </Button>
        </div>

        <Separator className="mb-4 bg-[#e5e7eb]" />

        {/* Text Area Display */}
        <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl p-5 font-sans text-sm text-[#0a1317] leading-relaxed whitespace-pre-wrap max-h-[480px] overflow-y-auto selection:bg-[#0a1317] selection:text-white font-normal">
          {activeTab === 'instagram' && instagramText}
          {activeTab === 'voiceover' && voiceoverText}
          {activeTab === 'email' && emailText}
          {activeTab === 'mls' && mlsText}
        </div>
      </Card>
    </div>
  );
};

