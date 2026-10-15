import React, { useState } from 'react';
import { PropertyListing, AgentInfo } from '../../types/property';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Palette,
  Check,
  InstagramLogo,
  Phone,
  IdentificationCard,
  Building,
  Sparkle,
} from '@phosphor-icons/react';

interface AgentBrandKitSheetProps {
  listing: PropertyListing;
  onUpdateAgent: (updatedAgent: AgentInfo) => void;
}

const BROKERAGE_PRESETS = [
  { name: 'The Agency Beverly Hills', licensePrefix: 'DRE# 0204', accent: '#0064e0' },
  { name: 'Compass Luxury Estates', licensePrefix: 'DRE# 0199', accent: '#000000' },
  { name: 'Sotheby’s International Realty', licensePrefix: 'DRE# 0184', accent: '#0a1e3f' },
  { name: 'Coldwell Banker Global Luxury', licensePrefix: 'DRE# 0142', accent: '#002f6c' },
];

export const AgentBrandKitSheet: React.FC<AgentBrandKitSheetProps> = ({
  listing,
  onUpdateAgent,
}) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(listing.agent.name);
  const [brokerage, setBrokerage] = useState(listing.agent.brokerage);
  const [phone, setPhone] = useState(listing.agent.phone);
  const [license, setLicense] = useState(listing.agent.license);
  const [instagram, setInstagram] = useState(listing.agent.instagram);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAgent({
      name: name.trim() || listing.agent.name,
      brokerage: brokerage.trim() || listing.agent.brokerage,
      phone: phone.trim() || listing.agent.phone,
      license: license.trim() || listing.agent.license,
      instagram: instagram.trim() || listing.agent.instagram,
    });
    setSavedNotice(true);
    setTimeout(() => {
      setSavedNotice(false);
      setOpen(false);
    }, 1200);
  };

  const handleApplyPreset = (preset: typeof BROKERAGE_PRESETS[0]) => {
    setBrokerage(preset.name);
    if (!license || license.length < 5) {
      setLicense(`${preset.licensePrefix}8832`);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="rounded-lg text-xs font-medium gap-1.5 border-[#e5e7eb] bg-white hover:bg-[#f8f9fa] text-[#0a1317] px-3 py-1.5 h-auto shadow-xs cursor-pointer transition-colors"
          >
            <Shield className="w-3.5 h-3.5 text-[#5d6c7b]" />
            <span>Brand Kit</span>
            <span className="font-mono text-[10px] text-[#5d6c7b] border-l border-[#e5e7eb] pl-1.5 ml-0.5">
              PRO
            </span>
          </Button>
        }
      />

      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-white border-[#e5e7eb]">
        <SheetHeader className="space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b]">
            White-Label Studio
          </span>
          <SheetTitle className="font-serif text-2xl font-normal text-[#0a1317] tracking-tight">
            Agent &amp; Brokerage Brand Kit
          </SheetTitle>
          <SheetDescription className="text-xs text-[#5d6c7b] leading-relaxed">
            All updates instantly syndicate across the 3D spatial tour, 9:16 Reels, social carousels, and client memorandum copy.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSave} className="space-y-5 py-4">
          {/* Quick Brokerage Presets */}
          <div>
            <label className="text-xs font-bold text-[#0a1317] flex items-center gap-1.5 mb-2">
              <Building className="w-3.5 h-3.5 text-[#5d6c7b]" />
              <span>Brokerage Quick Presets</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BROKERAGE_PRESETS.map((p, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => handleApplyPreset(p)}
                  className={`p-2.5 rounded-lg border text-left text-xs font-medium transition-all cursor-pointer ${
                    brokerage === p.name
                      ? 'border-[#0a1317] bg-[#f8f9fa] text-[#0a1317] font-semibold'
                      : 'border-[#e5e7eb] bg-white hover:bg-[#f8f9fa] text-[#5d6c7b]'
                  }`}
                >
                  <div className="truncate text-[#0a1317]">{p.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-[#8595a4] font-mono truncate">{p.name}</div>
                </button>
              ))}
            </div>
          </div>

          <Separator className="bg-[#e5e7eb]" />

          {/* Form Inputs */}
          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-medium text-[#0a1317] mb-1 block">
                Agent / Team Name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Josh Altman & Associates"
                className="bg-[#f8f9fa] border-[#e5e7eb] focus-visible:border-[#0a1317] focus-visible:bg-white rounded-lg text-xs text-[#0a1317]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-[#0a1317] mb-1 block">
                Brokerage Name
              </label>
              <Input
                value={brokerage}
                onChange={(e) => setBrokerage(e.target.value)}
                placeholder="e.g. The Agency Beverly Hills"
                className="bg-[#f8f9fa] border-[#e5e7eb] focus-visible:border-[#0a1317] focus-visible:bg-white rounded-lg text-xs text-[#0a1317]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-[#0a1317] mb-1 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-[#5d6c7b]" />
                  <span>Direct Phone</span>
                </label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(310) 555-0199"
                  className="bg-[#f8f9fa] border-[#e5e7eb] focus-visible:border-[#0a1317] focus-visible:bg-white rounded-lg text-xs text-[#0a1317]"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-[#0a1317] mb-1 flex items-center gap-1">
                  <IdentificationCard className="w-3 h-3 text-[#5d6c7b]" />
                  <span>DRE / License #</span>
                </label>
                <Input
                  value={license}
                  onChange={(e) => setLicense(e.target.value)}
                  placeholder="DRE# 01928471"
                  className="bg-[#f8f9fa] border-[#e5e7eb] focus-visible:border-[#0a1317] focus-visible:bg-white rounded-lg text-xs text-[#0a1317]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-[#0a1317] mb-1 flex items-center gap-1">
                <InstagramLogo className="w-3 h-3 text-[#5d6c7b]" />
                <span>Instagram / Social Handle</span>
              </label>
              <Input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@theagencyre"
                className="bg-[#f8f9fa] border-[#e5e7eb] focus-visible:border-[#0a1317] focus-visible:bg-white rounded-lg text-xs text-[#0a1317]"
              />
            </div>
          </div>

          <Separator className="bg-[#e5e7eb]" />

          {/* Real-time Watermark Preview */}
          <div className="bg-[#f8f9fa] border border-[#e5e7eb] rounded-xl p-3.5 text-xs">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block mb-1">
              Live Watermark Output
            </span>
            <div className="font-semibold text-[#0a1317]">
              Listed by {name} · {brokerage}
            </div>
            <div className="text-[11px] text-[#5d6c7b] font-mono mt-0.5">
              {phone} · {instagram} · {license}
            </div>
          </div>

          <SheetFooter className="gap-2 sm:gap-2 pt-2">
            <SheetClose
              render={
                <Button type="button" variant="outline" className="rounded-lg text-xs font-medium border-[#e5e7eb] hover:bg-[#f8f9fa]">
                  Cancel
                </Button>
              }
            />
            <Button
              type="submit"
              className="bg-[#0a1317] hover:bg-[#202529] text-white rounded-lg text-xs font-medium px-5 cursor-pointer shadow-xs transition-colors"
            >
              {savedNotice ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Branding Applied</span>
                </>
              ) : (
                <span>Save &amp; Apply Everywhere</span>
              )}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
