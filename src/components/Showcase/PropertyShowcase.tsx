import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PropertyListing } from '../../types/property';
import {
  Compass,
  FilmStrip,
  Calendar,
  CheckCircle,
  Clock,
  Sparkle,
  ArrowSquareOut,
  Phone,
  EnvelopeSimple,
  Shield,
  Check,
  PaperPlaneTilt,
  Star,
  Flame,
  ArrowRight,
  TrendUp,
  Eye,
  Users,
  ChartBar,
  ShareNetwork,
  Lightning,
  DeviceMobile,
  InstagramLogo,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';

const tourBookingSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number (at least 10 digits)'),
  showingWindow: z.string().min(1, 'Please select a showing time'),
  buyerType: z.string().min(1, 'Please select your buyer status'),
});

type TourBookingValues = z.infer<typeof tourBookingSchema>;

interface PropertyShowcaseProps {
  listing: PropertyListing;
  onNavigateTab: (tab: 'walkthrough' | 'reels' | 'carousel' | 'copy' | 'gallery') => void;
}

export const PropertyShowcase: React.FC<PropertyShowcaseProps> = ({
  listing,
  onNavigateTab,
}) => {
  const [isBooked, setIsBooked] = useState(false);
  const [bookedDetails, setBookedDetails] = useState<TourBookingValues | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const form = useForm<TourBookingValues>({
    resolver: zodResolver(tourBookingSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      showingWindow: 'Tomorrow, 2:00 PM',
      buyerType: 'pre-approved',
    },
  });

  const heroPhoto = listing.photos?.[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80';
  const interiorPhoto1 = listing.photos?.[1]?.url || listing.photos?.[0]?.url || '';
  const interiorPhoto2 = listing.photos?.[2]?.url || listing.photos?.[0]?.url || '';
  const interiorPhoto3 = listing.photos?.[3]?.url || listing.photos?.[0]?.url || '';

  const onBookingSubmit = (values: TourBookingValues) => {
    setIsBooked(true);
    setBookedDetails(values);
    setTimeout(() => {
      setIsBooked(false);
      setDialogOpen(false);
      form.reset();
    }, 3000);
  };

  return (
    <div className="w-full bg-white text-[#0a1317] font-sans pb-16">
      {/* 1. HERO BAND SECTION (shadcnblocks Hero Block pattern) */}
      <section className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 pt-6 sm:pt-8">
        <div className="relative rounded-[24px] sm:rounded-[32px] overflow-hidden border border-[#dee3e9] bg-[#0a1317] shadow-xl min-h-[500px] sm:min-h-[560px] flex flex-col justify-end p-6 sm:p-10 lg:p-12 text-white">
          {/* Full-bleed hero background photo */}
          <img
            src={heroPhoto}
            alt={listing.title}
            className="absolute inset-0 w-full h-full object-cover opacity-85 hover:scale-102 transition-transform duration-700"
          />

          {/* Dark gradient for crisp typography contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1317] via-[#0a1317]/50 to-transparent" />

          {/* Top Unboxed Metadata (Zero-Pill Discipline) */}
          <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-2 z-10 text-xs text-white/90">
            <span className="font-bold uppercase tracking-[0.2em] text-white text-[10px]">
              Private Exclusive
            </span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span className="font-medium text-white/80">{listing.neighborhood}</span>
          </div>

          {/* Hero Content Block: High-Craft Editorial Layout */}
          <div className="relative z-10 max-w-3xl space-y-3.5">
            <p className="text-[11px] font-semibold tracking-[0.2em] text-[#90c2ff] uppercase">
              Architectural Profile — Bel Air Country Club
            </p>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white leading-[1.08] tracking-tight max-w-2xl text-balance">
              {listing.title}
            </h1>

            <p className="text-sm sm:text-base text-white/80 font-normal leading-relaxed line-clamp-2 max-w-2xl">
              {listing.headline || listing.description}
            </p>

            <div className="pt-2 flex flex-wrap items-baseline gap-3.5">
              <span className="font-mono text-2xl sm:text-4xl font-normal text-white tracking-tight">
                {listing.priceFormatted}
              </span>
              <span className="text-xs sm:text-sm text-white/60 font-normal">
                {listing.address}
              </span>
            </div>

            {/* Dual CTA Hero Pattern: Meta pill buttons */}
            <div className="pt-4 flex flex-wrap items-center gap-3 sm:gap-4">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger
                  render={
                    <Button
                      size="lg"
                      className="bg-[#0064e0] hover:bg-[#0457cb] active:bg-[#0457cb] text-white font-bold rounded-full px-8 py-3.5 text-sm shadow-md cursor-pointer h-auto"
                    >
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span>Request Private Showing</span>
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-[480px] rounded-[24px] bg-white border-[#dee3e9] p-6 text-[#0a1317]">
                  <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-[#0064e0] text-white text-[10px] font-bold rounded-full px-2.5 py-0.5">
                        VIP CONCIERGE
                      </Badge>
                      <span className="text-[11px] text-[#5d6c7b] font-medium">Direct Agent Desk</span>
                    </div>
                    <DialogTitle className="text-xl font-bold tracking-tight text-[#0a1317]">
                      Schedule Confidential Showing
                    </DialogTitle>
                    <DialogDescription className="text-xs text-[#5d6c7b]">
                      Private access tour of {listing.address} with listing advisor {listing.agent.name}.
                    </DialogDescription>
                  </DialogHeader>

                  {isBooked ? (
                    <div className="py-6 text-center space-y-4">
                      <div className="w-14 h-14 rounded-full bg-[#31a24c]/15 text-[#31a24c] flex items-center justify-center mx-auto shadow-sm">
                        <Check className="w-7 h-7 stroke-[3]" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-[#0a1317]">VIP Tour Requested!</h4>
                        <p className="text-xs text-[#5d6c7b] max-w-sm mx-auto leading-relaxed">
                          Your reservation for <strong className="text-[#0a1317] font-semibold">{bookedDetails?.showingWindow}</strong> has been transmitted directly to <strong className="text-[#0a1317] font-semibold">{listing.agent.name}</strong>.
                        </p>
                      </div>

                      <Card className="p-3.5 bg-[#f1f4f7] border-[#dee3e9] rounded-[16px] text-left text-xs space-y-1.5">
                        <div className="flex justify-between items-center text-[#5d6c7b]">
                          <span>Guest</span>
                          <span className="font-bold text-[#0a1317]">{bookedDetails?.fullName}</span>
                        </div>
                        <div className="flex justify-between items-center text-[#5d6c7b]">
                          <span>Contact</span>
                          <span className="font-bold text-[#0a1317]">{bookedDetails?.email}</span>
                        </div>
                        <div className="flex justify-between items-center text-[#5d6c7b]">
                          <span>Status Tier</span>
                          <Badge variant="outline" className="text-[10px] bg-white border-[#31a24c] text-[#31a24c] font-bold">
                            Verified Inquiry
                          </Badge>
                        </div>
                      </Card>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setDialogOpen(false)}
                        className="rounded-full bg-[#0064e0] hover:bg-[#0457cb] text-white px-6 font-bold"
                      >
                        Done
                      </Button>
                    </div>
                  ) : (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onBookingSubmit)} className="space-y-3 mt-1">
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Legal Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g. Katherine Vance"
                                  className="rounded-full bg-[#f1f4f7] border-[#dee3e9] focus:bg-white text-xs"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    placeholder="kvance@luxury.com"
                                    className="rounded-full bg-[#f1f4f7] border-[#dee3e9] focus:bg-white text-xs"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Direct Phone</FormLabel>
                                <FormControl>
                                  <Input
                                    type="tel"
                                    placeholder="(555) 234-5678"
                                    className="rounded-full bg-[#f1f4f7] border-[#dee3e9] focus:bg-white text-xs"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <FormField
                            control={form.control}
                            name="showingWindow"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Showing Time</FormLabel>
                                <FormControl>
                                  <Select {...field}>
                                    <option value="Tomorrow, 11:00 AM (Daylight Tour)">Tomorrow, 11:00 AM (Daylight Tour)</option>
                                    <option value="Tomorrow, 2:00 PM">Tomorrow, 2:00 PM</option>
                                    <option value="Tomorrow, 5:30 PM (Sunset VIP Tour)">Tomorrow, 5:30 PM (Sunset VIP Tour)</option>
                                    <option value="This Saturday, 1:00 PM">This Saturday, 1:00 PM</option>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="buyerType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Buyer Status</FormLabel>
                                <FormControl>
                                  <Select {...field}>
                                    <option value="pre-approved">Pre-Approved Buyer</option>
                                    <option value="cash-verified">All-Cash Verified</option>
                                    <option value="buyers-broker">Licensed Buyer Agent</option>
                                    <option value="relocation">Executive Relocation</option>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setDialogOpen(false)}
                            className="rounded-md text-xs font-medium text-[#5d6c7b] hover:text-[#0a1317]"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="submit"
                            className="bg-[#0a1317] hover:bg-[#202529] active:bg-black text-white font-medium rounded-md px-5 text-xs shadow-xs cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5 mr-1.5" />
                            Confirm VIP Reservation
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigateTab('walkthrough')}
                className="bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold px-6 py-3.5 rounded-full border border-white/40 transition-colors flex items-center gap-2 text-sm backdrop-blur-sm cursor-pointer h-auto"
              >
                <Compass className="w-4 h-4 text-[#0091ff]" />
                <span>Launch 3D Walkthrough</span>
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => onNavigateTab('reels')}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3.5 rounded-full border border-white/40 transition-colors flex items-center gap-2 text-sm backdrop-blur-sm cursor-pointer h-auto"
              >
                <FilmStrip className="w-4 h-4 text-[#0091ff]" />
                <span>Watch Reel (9:16)</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Key Stats Architectural Ribbon (Clean Tabular Layout) */}
        <div className="w-full bg-[#f8f9fa] border border-[#e5e7eb] rounded-2xl p-4 sm:p-5 mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-[#e5e7eb]">
            {[
              { label: 'Offered At', value: listing.priceFormatted, meta: 'Verified MLS' },
              { label: 'Bedrooms', value: `${listing.beds} Suites`, meta: 'All En-Suite' },
              { label: 'Bathrooms', value: `${listing.baths} Baths`, meta: 'Designer Bath' },
              { label: 'Living Space', value: `${listing.sqft?.toLocaleString()} SF`, meta: 'Conditioned' },
              { label: 'Lot Coverage', value: listing.lotSize || '0.75 Acres', meta: 'Promontory' },
              { label: 'Year Built', value: `${listing.yearBuilt}`, meta: 'Custom Build' },
            ].map((stat, i) => (
              <div key={i} className={`flex flex-col ${i > 0 ? 'pt-3 sm:pt-0 sm:pl-6' : ''}`}>
                <span className="text-[10px] font-semibold text-[#5d6c7b] uppercase tracking-wider mb-1">
                  {stat.label}
                </span>
                <span className="font-mono tabular-nums text-lg sm:text-xl font-normal text-[#0a1317] tracking-tight">
                  {stat.value}
                </span>
                <span className="text-[10px] text-[#8595a4] mt-0.5 font-normal">
                  {stat.meta}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. ARCHITECTURAL HIGHLIGHTS & SPATIAL ZONES */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        <div className="max-w-2xl space-y-2 mb-10">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#5d6c7b] uppercase">
            Architectural Spatial Study
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#0a1317] tracking-tight">
            Curated Spaces &amp; Interior Artistry
          </h2>
          <p className="text-sm text-[#5d6c7b] leading-relaxed">
            Crafted with uncompromising attention to sightlines, natural daylight, and organic luxury finishes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {/* Card 1 */}
          <div className="flex flex-col group">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#0a1317] border border-[#e5e7eb]">
              <img
                src={interiorPhoto1}
                alt="Great Room"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
            </div>
            <div className="pt-4 flex flex-col flex-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5d6c7b] block mb-1">
                Living Pavilion
              </span>
              <h3 className="font-serif text-lg font-normal text-[#0a1317] mb-1.5">
                Grand Salon &amp; Pocket Walls
              </h3>
              <p className="text-xs text-[#5d6c7b] leading-relaxed mb-3 flex-1 font-normal">
                14-foot cedar ceilings with motorized Fleetwood glass pocket doors that vanish completely into the basalt perimeter columns.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab('walkthrough')}
                className="text-xs font-semibold text-[#0a1317] hover:text-[#0064e0] p-0 h-auto justify-start hover:bg-transparent flex items-center gap-1.5 cursor-pointer"
              >
                <span>Tour in 3D Space</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col group">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#0a1317] border border-[#e5e7eb]">
              <img
                src={interiorPhoto2}
                alt="Culinary Wing"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
            </div>
            <div className="pt-4 flex flex-col flex-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5d6c7b] block mb-1">
                Gourmet Center
              </span>
              <h3 className="font-serif text-lg font-normal text-[#0a1317] mb-1.5">
                Calacatta Marble Culinary Island
              </h3>
              <p className="text-xs text-[#5d6c7b] leading-relaxed mb-3 flex-1 font-normal">
                Book-matched Italian marble waterfall counter with hidden walk-in butler's pantry and integrated professional Gaggenau appliance suite.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab('reels')}
                className="text-xs font-semibold text-[#0a1317] hover:text-[#0064e0] p-0 h-auto justify-start hover:bg-transparent flex items-center gap-1.5 cursor-pointer"
              >
                <span>View in Reel Clip</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col group">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] bg-[#0a1317] border border-[#e5e7eb]">
              <img
                src={interiorPhoto3}
                alt="Outdoor Oasis"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
              />
            </div>
            <div className="pt-4 flex flex-col flex-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#5d6c7b] block mb-1">
                Resort Deck
              </span>
              <h3 className="font-serif text-lg font-normal text-[#0a1317] mb-1.5">
                Heated Zero-Edge Infinity Pool
              </h3>
              <p className="text-xs text-[#5d6c7b] leading-relaxed mb-3 flex-1 font-normal">
                Cantilevered overhang with recessed architectural illumination, integrated spa, and unobstructed sunset panoramic horizon views.
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab('carousel')}
                className="text-xs font-semibold text-[#0a1317] hover:text-[#0064e0] p-0 h-auto justify-start hover:bg-transparent flex items-center gap-1.5 cursor-pointer"
              >
                <span>Open in Carousel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5. EDITORIAL DISTRIBUTION & SYNDICATION PANEL (Impeccable Craft) */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16">
        <div className="rounded-[24px] border border-[#e5e7eb] bg-[#0a1317] text-white p-6 sm:p-10 shadow-sm">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-[#90c2ff] uppercase mb-1">
                  Syndication &amp; Reach Matrix
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-white">
                  Audience Velocity &amp; Distribution Profile
                </h3>
                <p className="text-xs sm:text-sm text-white/70 max-w-2xl mt-1">
                  High-intent private buyer engagement forecast across Instagram Reels, TikTok Architecture, and confidential real estate networks.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <Button
                  size="sm"
                  onClick={() => onNavigateTab('reels')}
                  className="rounded-full bg-white text-[#0a1317] hover:bg-white/90 font-bold text-xs shadow-xs cursor-pointer px-4"
                >
                  <FilmStrip className="w-3.5 h-3.5 mr-1.5" />
                  Produce 9:16 Video
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onNavigateTab('carousel')}
                  className="rounded-full bg-transparent hover:bg-white/10 text-white border-white/30 font-bold text-xs cursor-pointer px-4"
                >
                  <InstagramLogo className="w-3.5 h-3.5 mr-1.5" />
                  Build Carousel
                </Button>
              </div>
            </div>

            {/* 4 Clean Editorial Metric Columns (No Cockpit Slop) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
              <div className="pt-4 lg:pt-0 lg:pr-6">
                <span className="text-[11px] font-medium text-white/60 block mb-1">Projected Viewership</span>
                <div className="font-mono text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  148.2K
                </div>
                <p className="text-[11px] text-[#90c2ff] font-medium mt-1">
                  +280% vs standard MLS listing
                </p>
                <div className="text-[10px] text-white/50 mt-1 font-mono">
                  IG Reels 64% · TikTok 36%
                </div>
              </div>

              <div className="pt-4 lg:pt-0 lg:px-6">
                <span className="text-[11px] font-medium text-white/60 block mb-1">Audience Completion</span>
                <div className="font-mono text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  86.4%
                </div>
                <p className="text-[11px] text-[#90c2ff] font-medium mt-1">
                  Avg. 5.2 slides reviewed
                </p>
                <div className="text-[10px] text-white/50 mt-1 font-mono">
                  High DM share propensity
                </div>
              </div>

              <div className="pt-4 lg:pt-0 lg:px-6">
                <span className="text-[11px] font-medium text-white/60 block mb-1">Spatial Dwell Time</span>
                <div className="font-mono text-2xl sm:text-3xl font-normal text-white tracking-tight">
                  4.8 min
                </div>
                <p className="text-[11px] text-[#90c2ff] font-medium mt-1">
                  3D walkthrough session avg
                </p>
                <div className="text-[10px] text-white/50 mt-1 font-mono">
                  Terrace &amp; Primary most visited
                </div>
              </div>

              <div className="pt-4 lg:pt-0 lg:pl-6">
                <span className="text-[11px] font-medium text-white/60 block mb-1">Prime Active Window</span>
                <div className="font-mono text-xl sm:text-2xl font-normal text-white tracking-tight">
                  Tue &amp; Thu 6:30 PM
                </div>
                <p className="text-[11px] text-[#90c2ff] font-medium mt-1">
                  High-net-worth active dwell
                </p>
                <div className="text-[10px] text-white/50 mt-1 font-mono">
                  Peak target zip codes
                </div>
              </div>
            </div>

            {/* Curated Algorithmic Search Clusters: Clean Unboxed Editorial Text (Zero-Pill Discipline) */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/70">
              <span className="font-semibold text-white/90">
                Curated Syndication Tags:
              </span>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-white/70">
                <span>#LuxuryRealEstate</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>#ModernArchitecture</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>#BelAirGlassVilla</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>#InfinityPool</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>#ArchitecturalDigest</span>
                <span aria-hidden="true" className="text-white/30">·</span>
                <span>#SavantHome</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DETAILED SPECIFICATIONS TABLE & MLS DATA (shadcnblocks Tech Specs Table) */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-12 sm:pt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Full Description and Feature List */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#0064e0] uppercase tracking-wider block mb-1">
                Property Narrative
              </span>
              <h3 className="text-2xl font-bold text-[#0a1317] tracking-tight mb-3">
                Architectural Statement in {listing.neighborhood}
              </h3>
              <p className="text-sm text-[#444950] leading-relaxed whitespace-pre-wrap font-normal">
                {listing.description}
              </p>
            </div>

            <Separator className="bg-[#dee3e9]" />

            <div>
              <h4 className="text-sm font-bold text-[#0a1317] uppercase tracking-wider mb-3">
                Signature Amenities &amp; Inclusions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {listing.highlights?.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-[16px] bg-[#f1f4f7] border border-[#dee3e9] text-xs font-medium text-[#0a1317]">
                    <CheckCircle className="w-4 h-4 text-[#31a24c] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Key/Value Tech Specs Table (shadcn Card style) */}
          <div className="lg:col-span-5">
            <Card className="rounded-[24px] sm:rounded-[32px] border-[#dee3e9] shadow-sm bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-serif text-base font-normal text-[#0a1317] tracking-tight">
                  Comprehensive Specifications
                </h4>
                <span className="text-[11px] font-mono text-[#5d6c7b]">
                  Verified MLS Data
                </span>
              </div>

              <div className="rounded-[16px] border border-[#dee3e9] overflow-hidden">
                <Table>
                  <TableBody>
                    {[
                      { label: 'Property Type', value: listing.propertyType || 'Single Family Residence' },
                      { label: 'Architectural Style', value: 'Contemporary Minimalist' },
                      { label: 'Interior Living Area', value: `${listing.sqft?.toLocaleString()} Sq Ft` },
                      { label: 'Lot Coverage', value: listing.lotSize || '0.75 Acres (32,670 SF)' },
                      { label: 'Bedrooms & Baths', value: `${listing.beds} Beds  •  ${listing.baths} Baths` },
                      { label: 'Year Built', value: `${listing.yearBuilt}` },
                      { label: 'Parking & Garage', value: '3-Car Motor Court + EV Charging' },
                      { label: 'Climate Automation', value: 'Multi-Zone Nest / Savant Integration' },
                      { label: 'Water Features', value: 'Saltwater Infinity Pool & Spa' },
                      { label: 'Listing Status', value: listing.status || 'Active Private Showing' },
                    ].map((row, idx) => (
                      <TableRow key={idx} className="border-[#dee3e9] hover:bg-[#f1f4f7]/60">
                        <TableCell className="font-medium text-[#5d6c7b] py-2 text-xs">{row.label}</TableCell>
                        <TableCell className="font-mono tabular-nums text-[#0a1317] text-right py-2 text-xs font-medium">{row.value}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 pt-3 border-t border-[#dee3e9] flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-[#5d6c7b] block">Direct Listing Source</span>
                  <span className="text-xs font-semibold text-[#0a1317]">Zillow Verified MLS</span>
                </div>
                {listing.url && (
                  <a
                    href={listing.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-[#0a1317] hover:underline underline-offset-4 flex items-center gap-1 transition-colors"
                  >
                    <span>View on Zillow</span>
                    <ArrowSquareOut className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. AGENT CONTACT & SHOWING INQUIRY (Editorial Prestige) */}
      <section className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-12 sm:pt-16">
        <div className="bg-[#0a1317] text-white rounded-2xl p-8 sm:p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8 border border-white/10">
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center gap-3.5">
              <Avatar className="size-12 border border-white/20 bg-white/10 shrink-0">
                <AvatarFallback className="bg-[#1c1e21] text-white font-serif text-base">
                  {listing.agent.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2 mb-1 text-[11px] text-white/70">
                  <span className="font-semibold uppercase tracking-wider text-white/90">
                    Exclusive Representation
                  </span>
                  <span aria-hidden="true" className="text-white/30">·</span>
                  <span>{listing.agent.brokerage}</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal tracking-tight text-white">
                  Represented by {listing.agent.name}
                </h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#dee3e9] leading-relaxed font-normal">
              Private showings are conducted strictly by prior appointment for pre-qualified buyers. Contact our office directly for the confidential offering memorandum and survey maps.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-xs text-[#ced0d4] pt-2">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0091ff]" />
                <span className="font-bold text-white">{listing.agent.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0091ff]" />
                <span>License: {listing.agent.license}</span>
              </div>
              <div className="flex items-center gap-2">
                <EnvelopeSimple className="w-4 h-4 text-[#0091ff]" />
                <span className="text-[#0091ff] font-semibold">{listing.agent.instagram}</span>
              </div>
            </div>
          </div>

          <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              onClick={() => setDialogOpen(true)}
              className="bg-[#0064e0] hover:bg-[#0457cb] text-white font-bold px-8 py-4 rounded-full text-sm shadow-md cursor-pointer h-auto"
            >
              <Calendar className="w-4 h-4 mr-2" />
              <span>Schedule Showing</span>
            </Button>

            <Button
              size="lg"
              variant="outline"
              onClick={() => onNavigateTab('copy')}
              className="bg-transparent hover:bg-white/10 text-white border-2 border-white font-bold px-6 py-4 rounded-full text-sm cursor-pointer h-auto"
            >
              <PaperPlaneTilt className="w-4 h-4 mr-2" />
              <span>Copy VIP Pitch</span>
            </Button>
          </div>
        </div>
      </section>

      {/* 5. FREQUENTLY ASKED QUESTIONS (shadcn Accordion Block) */}
      <section className="w-full max-w-4xl mx-auto px-3 sm:px-6 pt-12 sm:pt-16">
        <div className="text-center space-y-2 mb-8">
          <p className="text-[11px] font-bold tracking-[0.2em] text-[#5d6c7b] uppercase">
            Buyer Advisory
          </p>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#0a1317] tracking-tight">
            Frequently Addressed Inquiries
          </h3>
          <p className="text-xs sm:text-sm text-[#5d6c7b]">
            Key details concerning private showings, architectural inclusions, and transaction protocol.
          </p>
        </div>

        <Accordion className="w-full space-y-3">
          <AccordionItem value="item-1" className="bg-[#f1f4f7] rounded-[16px] border border-[#dee3e9] px-5 py-1">
            <AccordionTrigger className="text-sm font-bold text-[#0a1317] hover:no-underline">
              How are private viewings and walkthroughs scheduled?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-[#5d6c7b] leading-relaxed pt-2">
              All private tours require 24 hours advance notification and proof of pre-qualification or proof of funds. You can submit a request directly through the "Request Private Showing" button on this showcase or contact {listing.agent.name} directly.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2" className="bg-[#f1f4f7] rounded-[16px] border border-[#dee3e9] px-5 py-1">
            <AccordionTrigger className="text-sm font-bold text-[#0a1317] hover:no-underline">
              Is the property offered with staging and custom furnishings?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-[#5d6c7b] leading-relaxed pt-2">
              The residence is delivered with all custom built-ins, Gaggenau kitchen suite, and architectural lighting. Custom Italian designer furnishings and contemporary curated artwork are available under a separate bill of sale upon request.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3" className="bg-[#f1f4f7] rounded-[16px] border border-[#dee3e9] px-5 py-1">
            <AccordionTrigger className="text-sm font-bold text-[#0a1317] hover:no-underline">
              What smart home automation and security infrastructure is installed?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-[#5d6c7b] leading-relaxed pt-2">
              The estate is wired with full Savant whole-home automation controlling Lutron architectural lighting scenes, motorized Fleetwood pocket glass walls, pool/spa temperature, motorized shades, and high-definition perimeter security cameras.
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4" className="bg-[#f1f4f7] rounded-[16px] border border-[#dee3e9] px-5 py-1">
            <AccordionTrigger className="text-sm font-bold text-[#0a1317] hover:no-underline">
              How do the interactive 3D and social reels generators work with this listing?
            </AccordionTrigger>
            <AccordionContent className="text-xs text-[#5d6c7b] leading-relaxed pt-2">
              The top tab bar provides direct access to the 3D Walkthrough (powered by Three.js with first-person and drone tour modes), the Reels Studio (producing 9:16 vertical videos with transitions and luxury Lo-Fi beats), and the Instagram Carousel Builder.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  );
};
