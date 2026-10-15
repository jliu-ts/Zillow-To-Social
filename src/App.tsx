import React, { useState, useEffect } from 'react';
import { PropertyListing, AICopyOutput } from './types/property';
import { Navbar } from './components/Navbar';
import { ListingHeroBar, ActiveTab } from './components/ListingHeroBar';
import { WalkthroughScene } from './components/Walkthrough3D/WalkthroughScene';
import { ReelStudio } from './components/ReelStudio/ReelStudio';
import { CarouselStudio } from './components/CarouselStudio/CarouselStudio';
import { CopyStudio } from './components/CopyStudio/CopyStudio';
import { GalleryView } from './components/GalleryView';
import { PropertyShowcase } from './components/Showcase/PropertyShowcase';
import { CheckCircle, WarningCircle, CircleNotch } from '@phosphor-icons/react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { INITIAL_CURATED_LISTINGS } from './data/initialListing';

export default function App() {
  const [curatedListings, setCuratedListings] = useState<PropertyListing[]>(INITIAL_CURATED_LISTINGS);
  const [activeListing, setActiveListing] = useState<PropertyListing | null>(INITIAL_CURATED_LISTINGS[0]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('walkthrough');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [aiCopy, setAiCopy] = useState<AICopyOutput | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Load curated listings on mount
  useEffect(() => {
    fetch('/api/curated-listings')
      .then((res) => res.json())
      .then((data) => {
        if (data.listings && data.listings.length > 0) {
          setCuratedListings(data.listings);
          setActiveListing((prev) => prev || data.listings[0]);
          fetchAICopy(data.listings[0]);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch curated listings from API:', err);
      });
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Fetch AI copy from backend
  const fetchAICopy = async (listing: PropertyListing, tone: string = 'luxury') => {
    setIsGeneratingCopy(true);
    try {
      const res = await fetch('/api/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listing, tone }),
      });
      const data = await res.json();
      if (data && !data.error) {
        setAiCopy(data);
      }
    } catch (err) {
      console.warn('Copy generation error:', err);
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  // Handle URL parsing
  const handleLoadUrl = async (url: string) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/parse-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data.listing) {
        setActiveListing(data.listing);
        showNotification(`Loaded listing: ${data.listing.title}`);
        fetchAICopy(data.listing);
      } else {
        showNotification(data.error || 'Failed to extract listing from URL.', 'error');
      }
    } catch (err: any) {
      showNotification(err.message || 'Error parsing listing URL.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCurated = (listing: PropertyListing) => {
    setActiveListing(listing);
    fetchAICopy(listing);
    showNotification(`Switched to ${listing.neighborhood}`);
  };

  if (!activeListing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="text-center space-y-4 p-8 border-[#e5e7eb] shadow-xs max-w-sm rounded-xl">
          <CircleNotch className="w-8 h-8 text-[#0a1317] animate-spin mx-auto" />
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] block mb-1">
              Media Studio
            </span>
            <h3 className="font-serif text-lg font-normal text-[#0a1317]">Initializing Architectural Engine</h3>
            <p className="text-xs text-[#5d6c7b] mt-1 font-normal">Loading spatial assets &amp; listing portfolio...</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`bg-white text-[#0a1317] flex flex-col ${
        activeTab === 'walkthrough' ? 'h-screen overflow-hidden' : 'min-h-screen overflow-x-hidden'
      }`}
    >
      {/* Toast Notification with Zero-Pill Discipline */}
      {notification && (
        <div
          className={`fixed top-16 right-4 z-50 px-3.5 py-2 rounded-lg text-xs font-medium shadow-md border flex items-center gap-2 animate-in fade-in slide-in-from-top-2 backdrop-blur-md ${
            notification.type === 'error'
              ? 'bg-[#0a1317] text-white border-rose-500/50'
              : 'bg-[#0a1317] text-white border-[#e5e7eb]/20'
          }`}
        >
          {notification.type === 'error' ? (
            <WarningCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Navigation Header with Top Promo Banner & URL bar */}
      <Navbar
        onLoadUrl={handleLoadUrl}
        isLoading={isLoading}
        curatedListings={curatedListings}
        onSelectCurated={handleSelectCurated}
        activeListingId={activeListing.id}
        activeListing={activeListing}
        onUpdateAgent={(updatedAgent) => {
          setActiveListing((prev) => (prev ? { ...prev, agent: updatedAgent } : prev));
          showNotification(`Brand kit updated for ${updatedAgent.name}`);
        }}
      />

      {/* Property Overview & Pill Tab Bar */}
      <ListingHeroBar
        listing={activeListing}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Viewports */}
      <main className={`w-full flex flex-col ${activeTab === 'walkthrough' ? 'flex-1 overflow-hidden' : 'flex-1 overflow-y-auto bg-[#ffffff]'}`}>
        {activeTab === 'showcase' && (
          <PropertyShowcase
            listing={activeListing}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'walkthrough' && (
          <WalkthroughScene listing={activeListing} />
        )}

        {activeTab === 'reels' && (
          <ReelStudio
            listing={activeListing}
            suggestedHook={aiCopy?.reelsHook}
            suggestedVoiceover={aiCopy?.reelsVoiceoverScript}
          />
        )}

        {activeTab === 'carousel' && (
          <CarouselStudio
            listing={activeListing}
            suggestedHook={aiCopy?.carouselHook}
            suggestedSlidesContent={aiCopy?.carouselSlidesContent}
          />
        )}

        {activeTab === 'copy' && (
          <CopyStudio
            listing={activeListing}
            initialCopy={aiCopy}
            onRefreshCopy={(tone) => fetchAICopy(activeListing, tone)}
            isLoading={isGeneratingCopy}
          />
        )}

        {activeTab === 'gallery' && (
          <GalleryView
            listing={activeListing}
            onUpdateListing={setActiveListing}
            onNavigateTab={setActiveTab}
          />
        )}
      </main>
    </div>
  );
}
