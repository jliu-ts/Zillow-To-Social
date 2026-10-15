import React from 'react';
import { RoomId } from './WalkthroughScene';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Compass, ArrowsOutSimple, House, CookingPot, Bed, Bathtub, Waves } from '@phosphor-icons/react';

export interface FloorRadarProps {
  activeRoom: RoomId;
  onSelectRoom: (roomId: RoomId) => void;
  onClose: () => void;
  cameraMode?: string;
}

interface RoomZone {
  id: RoomId;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  x: number;
  y: number;
  w: number;
  h: number;
  beaconX: number;
  beaconY: number;
  feature: string;
}

const ROOM_ZONES: RoomZone[] = [
  {
    id: 'terrace',
    label: 'Pool Terrace',
    sublabel: 'Sunset View',
    icon: Waves,
    x: 42,
    y: 12,
    w: 156,
    h: 36,
    beaconX: 120,
    beaconY: 30,
    feature: 'Infinity Edge Pool',
  },
  {
    id: 'living',
    label: 'Great Room',
    sublabel: '14ft Ceilings',
    icon: House,
    x: 82,
    y: 52,
    w: 76,
    h: 62,
    beaconX: 120,
    beaconY: 82,
    feature: 'Linear Basalt Hearth',
  },
  {
    id: 'kitchen',
    label: 'Chef Kitchen',
    sublabel: 'Calacatta Wing',
    icon: CookingPot,
    x: 162,
    y: 52,
    w: 66,
    h: 62,
    beaconX: 195,
    beaconY: 82,
    feature: '14ft Waterfall Island',
  },
  {
    id: 'primary',
    label: 'Primary Suite',
    sublabel: 'Sanctuary',
    icon: Bed,
    x: 12,
    y: 52,
    w: 66,
    h: 56,
    beaconX: 45,
    beaconY: 80,
    feature: 'Private Balcony',
  },
  {
    id: 'bath',
    label: 'Spa Bath',
    sublabel: 'Freestanding Tub',
    icon: Bathtub,
    x: 12,
    y: 112,
    w: 66,
    h: 52,
    beaconX: 45,
    beaconY: 138,
    feature: 'Dual Rain Shower',
  },
];

export const FloorRadar: React.FC<FloorRadarProps> = ({
  activeRoom,
  onSelectRoom,
  onClose,
}) => {
  const currentZone = ROOM_ZONES.find((z) => z.id === activeRoom) || ROOM_ZONES[1];

  return (
    <Card className="absolute top-3 right-3 z-20 bg-white/95 border-[#e5e7eb] rounded-xl shadow-lg w-[260px] sm:w-[280px] text-[#0a1317] backdrop-blur-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
      {/* Architectural Header with Compass */}
      <CardHeader className="p-3 pb-2 flex flex-row items-center justify-between border-b border-[#f1f4f7] space-y-0">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-[#0a1317] animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#5d6c7b] font-semibold">
            Floor Radar · Level 01
          </span>
        </div>
        <div className="flex items-center gap-1">
          {/* North Orientation Indicator */}
          <div
            className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#f8f9fa] border border-[#e5e7eb] text-[9px] font-mono text-[#5d6c7b]"
            title="Estate Orientation: North facing panoramic valley views"
          >
            <Compass className="w-2.5 h-2.5 text-[#0a1317]" />
            <span className="font-semibold text-[#0a1317]">N</span>
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            aria-label="Close Floor Radar"
            className="hover:text-[#0a1317] text-[#8595a4] size-6 rounded-md hover:bg-[#f8f9fa] transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>
      </CardHeader>

      {/* Interactive 2D Blueprint Schematic */}
      <div className="p-3">
        <div className="relative w-full aspect-[4/3] bg-[#f8f9fa] rounded-lg border border-[#e5e7eb] overflow-hidden p-1 select-none">
          {/* Architectural Grid Background */}
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
              backgroundSize: '12px 12px',
            }}
          />

          <svg
            viewBox="0 0 240 174"
            className="w-full h-full relative z-10"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Gallery Hallway & Entrance Plinth */}
            <rect
              x="82"
              y="118"
              width="76"
              height="46"
              fill="#ffffff"
              stroke="#e5e7eb"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <text
              x="120"
              y="142"
              fill="#8595a4"
              fontSize="7"
              fontFamily="system-ui"
              textAnchor="middle"
              className="pointer-events-none"
            >
              FOYER & GALLERY
            </text>

            {/* Room Zones */}
            {ROOM_ZONES.map((zone) => {
              const isActive = zone.id === activeRoom;
              return (
                <g
                  key={zone.id}
                  onClick={() => onSelectRoom(zone.id)}
                  className="cursor-pointer group"
                >
                  {/* Room Footprint */}
                  <rect
                    x={zone.x}
                    y={zone.y}
                    width={zone.w}
                    height={zone.h}
                    rx="4"
                    className={`transition-all duration-150 ${
                      isActive
                        ? 'fill-[#0a1317]/10 stroke-[#0a1317] stroke-[1.5]'
                        : 'fill-white hover:fill-[#0a1317]/5 stroke-[#d1d5db] hover:stroke-[#0a1317] stroke-[1]'
                    }`}
                  />

                  {/* Room Label */}
                  <text
                    x={zone.x + zone.w / 2}
                    y={zone.y + (zone.id === 'terrace' ? 18 : 22)}
                    textAnchor="middle"
                    className={`transition-colors text-[8px] font-sans ${
                      isActive
                        ? 'fill-[#0a1317] font-semibold'
                        : 'fill-[#5d6c7b] group-hover:fill-[#0a1317] font-medium'
                    }`}
                  >
                    {zone.label.toUpperCase()}
                  </text>

                  {/* Sublabel / Metric */}
                  <text
                    x={zone.x + zone.w / 2}
                    y={zone.y + (zone.id === 'terrace' ? 28 : 34)}
                    textAnchor="middle"
                    className="fill-[#8595a4] text-[6.5px] font-mono pointer-events-none"
                  >
                    {zone.sublabel}
                  </text>

                  {/* Active Radar Beacon Ripple & Dot */}
                  {isActive && (
                    <g className="pointer-events-none">
                      {/* Radiating Radar Wave */}
                      <circle
                        cx={zone.beaconX}
                        cy={zone.beaconY}
                        r="9"
                        fill="none"
                        stroke="#0a1317"
                        strokeWidth="1"
                        opacity="0.3"
                      >
                        <animate
                          attributeName="r"
                          values="4;14;4"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.6;0;0.6"
                          dur="2.5s"
                          repeatCount="indefinite"
                        />
                      </circle>
                      {/* Core Position Dot */}
                      <circle
                        cx={zone.beaconX}
                        cy={zone.beaconY}
                        r="3.5"
                        fill="#0a1317"
                      />
                      <circle
                        cx={zone.beaconX}
                        cy={zone.beaconY}
                        r="1.5"
                        fill="#ffffff"
                      />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Active Zone Detail Card */}
        <div className="mt-2.5 p-2 rounded-lg bg-[#f8f9fa] border border-[#e5e7eb] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-md bg-[#0a1317] text-white flex items-center justify-center shrink-0">
              <currentZone.icon className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#0a1317] truncate leading-tight">
                {currentZone.label}
              </p>
              <p className="text-[10px] text-[#5d6c7b] truncate font-mono">
                {currentZone.feature}
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-white border border-[#e5e7eb] text-[#0a1317] shrink-0">
            LIVE 3D
          </span>
        </div>

        {/* Quick Room Teleport Strip */}
        <div className="mt-2 flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {ROOM_ZONES.map((zone) => {
            const isActive = zone.id === activeRoom;
            return (
              <Button
                key={zone.id}
                variant={isActive ? 'default' : 'outline'}
                size="xs"
                onClick={() => onSelectRoom(zone.id)}
                className={`text-[9.5px] px-2 py-0.5 h-auto rounded-md shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0a1317] hover:bg-[#202529] text-white font-medium border-transparent shadow-2xs'
                    : 'bg-white hover:bg-[#f8f9fa] hover:text-[#0a1317] text-[#5d6c7b] border-[#e5e7eb]'
                }`}
              >
                {zone.label}
              </Button>
            );
          })}
        </div>
      </div>
    </Card>
  );
};
