import { PropertyListing } from '../types/property';

export const INITIAL_CURATED_LISTINGS: PropertyListing[] = [
  {
    id: 'bel-air-glass-villa',
    url: 'https://www.zillow.com/homedetails/10540-Bellagio-Rd-Los-Angeles-CA-90077/205938120_zpid/',
    title: 'The Bellagio Glass Estate',
    address: '10540 Bellagio Rd, Los Angeles, CA 90077',
    neighborhood: 'Bel Air, Los Angeles',
    price: 18500000,
    priceFormatted: '$18,500,000',
    beds: 6,
    baths: 8,
    sqft: 8450,
    lotSize: '0.82 Acres',
    yearBuilt: 2024,
    propertyType: 'Single Family Architectural',
    status: 'Active Listing',
    headline: 'Touring an $18.5M Bel Air Architectural Wonder',
    description: 'An architectural tour-de-force perched above the Bel-Air Country Club. Framed in bespoke Fleetwood floor-to-ceiling glass pocket doors, this modern sanctuary delivers uninterrupted panoramic views from Century City to Catalina Island. Features an open-concept great room with 14-foot cedar slat ceilings, dual-sided linear marble fireplace, and seamless flow into a zero-edge infinity pool terrace. The bespoke Poliform kitchen showcases book-matched Calacatta Gold marble waterfall countertops and integrated Gaggenau appliances.',
    highlights: [
      'Zero-edge infinity pool & heated spa overlooking city lights',
      'Custom Poliform kitchen with Calacatta Gold waterfall island',
      'Dual primary suites with private garden courtyards',
      'Temp-controlled 500-bottle glass wine cellar',
      'Automated Crestron smart home with hidden acoustic ceiling speakers',
    ],
    agent: {
      name: 'Julian Vance',
      brokerage: 'Vance & Co. Luxury Real Estate',
      phone: '(310) 849-2041',
      license: 'DRE #02148920',
      instagram: '@julianvance.realestate',
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
        title: 'Architectural Facade & Driveway',
        room: 'Exterior Front',
        caption: 'Cantilevered geometric volumes with bronze accents and drought-tolerant olive grove landscaping.',
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
        title: 'Grand Living Room',
        room: 'Great Room',
        caption: '14-foot cedar ceilings, recessed cove lighting, and motorized glass doors that vanish into the walls.',
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
        title: 'Chef’s Calacatta Kitchen',
        room: 'Kitchen & Dining',
        caption: 'Book-matched marble waterfall island, fluted white oak cabinetry, and hidden prep pantry.',
      },
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
        title: 'Primary Sanctuary Suite',
        room: 'Primary Bedroom',
        caption: 'Private wrap-around terrace with outdoor fire table and custom walk-in dressing room.',
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80',
        title: 'Spa-Inspired Primary Bath',
        room: 'Primary Bath',
        caption: 'Freestanding volcanic limestone soaking tub, dual rainfall showers, and heated terrazzo floors.',
      },
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
        title: 'Infinity Pool at Sunset',
        room: 'Pool Terrace',
        caption: 'Zero-edge pool reflecting the Pacific horizon with integrated swim-up bar and baja shelf.',
      },
    ],
  },
];
