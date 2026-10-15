import React, { useState } from 'react';
import { RoomId, CameraMode, LightingPreset } from './WalkthroughScene';
import {
  CaretDown,
  CaretUp,
  Sun,
  SunHorizon,
  Moon,
  VideoCamera,
  Footprints,
  Cube,
  House,
  CookingPot,
  Bed,
  Bathtub,
  Waves,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface WalkthroughDockProps {
  activeRoom: RoomId;
  onSelectRoom: (room: RoomId) => void;
  cameraMode: CameraMode;
  onSelectCameraMode: (mode: CameraMode) => void;
  lightingPreset: LightingPreset;
  onSelectLightingPreset: (preset: LightingPreset) => void;
}

export const WalkthroughDock: React.FC<WalkthroughDockProps> = ({
  activeRoom,
  onSelectRoom,
  cameraMode,
  onSelectCameraMode,
  lightingPreset,
  onSelectLightingPreset,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={`absolute bottom-4 sm:bottom-6 left-0 right-0 mx-auto z-20 w-[94vw] max-w-[920px] transition-transform duration-300 pointer-events-auto ${
        collapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
      }`}
    >
      {/* Collapse/Expand Toggle using shadcn Button */}
      <div className="flex justify-center mb-1.5">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="bg-white/95 text-[#0a1317] hover:bg-[#f8f9fa] border-[#e5e7eb] px-3 py-1 h-auto rounded-lg text-[11px] font-medium flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer backdrop-blur-md"
          title="Toggle Controls (Press H)"
        >
          {collapsed ? (
            <>
              <CaretUp className="w-3.5 h-3.5 text-[#5d6c7b]" />
              <span>Show Navigation Dock</span>
            </>
          ) : (
            <>
              <CaretDown className="w-3.5 h-3.5 text-[#5d6c7b]" />
              <span>Hide Dock</span>
            </>
          )}
        </Button>
      </div>

      {/* Main Dock Container - Architectural Glassmorphic Bar */}
      <div className="bg-white/95 border border-[#e5e7eb] rounded-2xl px-3 sm:px-4 py-2 shadow-lg flex flex-wrap md:flex-nowrap items-center justify-between gap-2 sm:gap-3 text-[#0a1317] backdrop-blur-md">
        {/* Room Navigation Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 max-w-full flex-1">
          <span className="text-[10px] font-mono text-[#5d6c7b] uppercase tracking-widest mr-1 shrink-0 hidden sm:inline">
            Spatial:
          </span>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectRoom('living')}
            className={`px-3 py-1.5 h-auto rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 shrink-0 cursor-pointer active:scale-[0.98] ${
              activeRoom === 'living' && cameraMode === 'walk'
                ? 'bg-[#0a1317] hover:bg-[#202529] text-white shadow-xs font-semibold border-transparent'
                : 'bg-[#f8f9fa] border-[#e5e7eb] text-[#5d6c7b] hover:text-[#0a1317] hover:bg-white active:bg-[#f1f4f7]'
            }`}
          >
            <House className="w-3.5 h-3.5 shrink-0" />
            <span>Great Room</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectRoom('kitchen')}
            className={`px-3 py-1.5 h-auto rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 shrink-0 cursor-pointer active:scale-[0.98] ${
              activeRoom === 'kitchen' && cameraMode === 'walk'
                ? 'bg-[#0a1317] hover:bg-[#202529] text-white shadow-xs font-semibold border-transparent'
                : 'bg-[#f8f9fa] border-[#e5e7eb] text-[#5d6c7b] hover:text-[#0a1317] hover:bg-white active:bg-[#f1f4f7]'
            }`}
          >
            <CookingPot className="w-3.5 h-3.5 shrink-0" />
            <span>Kitchen</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectRoom('primary')}
            className={`px-3 py-1.5 h-auto rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 shrink-0 cursor-pointer active:scale-[0.98] ${
              activeRoom === 'primary' && cameraMode === 'walk'
                ? 'bg-[#0a1317] hover:bg-[#202529] text-white shadow-xs font-semibold border-transparent'
                : 'bg-[#f8f9fa] border-[#e5e7eb] text-[#5d6c7b] hover:text-[#0a1317] hover:bg-white active:bg-[#f1f4f7]'
            }`}
          >
            <Bed className="w-3.5 h-3.5 shrink-0" />
            <span>Primary</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectRoom('bath')}
            className={`px-3 py-1.5 h-auto rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 shrink-0 cursor-pointer active:scale-[0.98] ${
              activeRoom === 'bath' && cameraMode === 'walk'
                ? 'bg-[#0a1317] hover:bg-[#202529] text-white shadow-xs font-semibold border-transparent'
                : 'bg-[#f8f9fa] border-[#e5e7eb] text-[#5d6c7b] hover:text-[#0a1317] hover:bg-white active:bg-[#f1f4f7]'
            }`}
          >
            <Bathtub className="w-3.5 h-3.5 shrink-0" />
            <span>Spa Bath</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectRoom('terrace')}
            className={`px-3 py-1.5 h-auto rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-150 shrink-0 cursor-pointer active:scale-[0.98] ${
              activeRoom === 'terrace' && cameraMode === 'walk'
                ? 'bg-[#0a1317] hover:bg-[#202529] text-white shadow-xs font-semibold border-transparent'
                : 'bg-[#f8f9fa] border-[#e5e7eb] text-[#5d6c7b] hover:text-[#0a1317] hover:bg-white active:bg-[#f1f4f7]'
            }`}
          >
            <Waves className="w-3.5 h-3.5 shrink-0" />
            <span>Pool Terrace</span>
          </Button>
        </div>

        {/* Right side: Camera Mode & Lighting Atmosphere */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 ml-auto">
          {/* Camera View Mode Segmented Control */}
          <div className="flex items-center gap-1 bg-[#f8f9fa] p-1 rounded-lg border border-[#e5e7eb]">
            <Button
              variant={cameraMode === 'walk' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSelectCameraMode('walk')}
              className={`px-2.5 py-1 h-auto rounded-md text-xs font-medium flex items-center gap-1 transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                cameraMode === 'walk'
                  ? 'bg-[#0a1317] hover:bg-[#202529] text-white shadow-xs font-semibold'
                  : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-transparent'
              }`}
              title="First-Person Walk Navigation (Drag mouse to look)"
            >
              <Footprints className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Walk</span>
            </Button>

            <Button
              variant={cameraMode === 'cinematic' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSelectCameraMode('cinematic')}
              className={`px-2.5 py-1 h-auto rounded-md text-xs font-medium flex items-center gap-1 transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                cameraMode === 'cinematic'
                  ? 'bg-[#0a1317] hover:bg-[#202529] text-white shadow-xs font-semibold'
                  : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-transparent'
              }`}
              title="Cinematic Drone Tour (Auto fly-through all rooms)"
            >
              <VideoCamera className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Auto Tour</span>
            </Button>

            <Button
              variant={cameraMode === 'dollhouse' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onSelectCameraMode('dollhouse')}
              className={`px-2.5 py-1 h-auto rounded-md text-xs font-medium flex items-center gap-1 transition-all duration-150 cursor-pointer active:scale-[0.98] ${
                cameraMode === 'dollhouse'
                  ? 'bg-[#0a1317] hover:bg-[#202529] text-white shadow-xs font-semibold'
                  : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-transparent'
              }`}
              title="Dollhouse Cutaway Floorplan View"
            >
              <Cube className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline">Dollhouse</span>
            </Button>
          </div>

          {/* Lighting Mode Segmented Control */}
          <div className="flex items-center gap-1 bg-[#f8f9fa] p-1 rounded-lg border border-[#e5e7eb]">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onSelectLightingPreset('day')}
              className={`rounded-md transition-all duration-150 cursor-pointer size-7 active:scale-95 ${
                lightingPreset === 'day'
                  ? 'bg-[#0a1317] text-white hover:bg-[#202529] shadow-xs'
                  : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-white'
              }`}
              title="Daylight Architecture"
            >
              <Sun className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onSelectLightingPreset('sunset')}
              className={`rounded-md transition-all duration-150 cursor-pointer size-7 active:scale-95 ${
                lightingPreset === 'sunset'
                  ? 'bg-[#0a1317] text-[#e0a82e] hover:bg-[#202529] shadow-xs'
                  : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-white'
              }`}
              title="Golden Hour Sunset"
            >
              <SunHorizon className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => onSelectLightingPreset('night')}
              className={`rounded-md transition-all duration-150 cursor-pointer size-7 active:scale-95 ${
                lightingPreset === 'night'
                  ? 'bg-[#0a1317] text-[#93c5fd] hover:bg-[#202529] shadow-xs'
                  : 'text-[#5d6c7b] hover:text-[#0a1317] hover:bg-white'
              }`}
              title="Twilight Illumination"
            >
              <Moon className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

