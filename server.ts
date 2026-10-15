import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Curated luxury listings for instant testing and high-fidelity demoing
const CURATED_LISTINGS = [
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
      'Automated Crestron smart home with hidden acoustic ceiling speakers'
    ],
    agent: {
      name: 'Julian Vance',
      brokerage: 'Vance & Co. Luxury Real Estate',
      phone: '(310) 849-2041',
      license: 'DRE #02148920',
      instagram: '@julianvance.realestate'
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
        title: 'Architectural Facade & Driveway',
        room: 'Exterior Front',
        caption: 'Cantilevered geometric volumes with bronze accents and drought-tolerant olive grove landscaping.'
      },
      {
        url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
        title: 'Grand Living Room',
        room: 'Great Room',
        caption: '14-foot cedar ceilings, recessed cove lighting, and motorized glass doors that vanish into the walls.'
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
        title: 'Chef’s Calacatta Kitchen',
        room: 'Kitchen & Dining',
        caption: 'Book-matched marble waterfall island, fluted white oak cabinetry, and hidden prep pantry.'
      },
      {
        url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
        title: 'Primary Sanctuary Suite',
        room: 'Primary Bedroom',
        caption: 'Private wrap-around terrace with outdoor fire table and custom walk-in dressing room.'
      },
      {
        url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80',
        title: 'Spa-Inspired Primary Bath',
        room: 'Primary Bath',
        caption: 'Freestanding volcanic limestone soaking tub, dual rainfall showers, and heated terrazzo floors.'
      },
      {
        url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
        title: 'Infinity Pool at Sunset',
        room: 'Pool Terrace',
        caption: 'Zero-edge pool reflecting the Pacific horizon with integrated swim-up bar and baja shelf.'
      }
    ]
  },
  {
    id: 'tribeca-cast-iron-penthouse',
    url: 'https://www.zillow.com/homedetails/45-Franklin-St-PH-New-York-NY-10013/18472941_zpid/',
    title: 'The Franklin Cast-Iron Penthouse',
    address: '45 Franklin St, PH, New York, NY 10013',
    neighborhood: 'Tribeca, New York',
    price: 9450000,
    priceFormatted: '$9,450,000',
    beds: 4,
    baths: 4.5,
    sqft: 4200,
    lotSize: 'N/A (Full Floor PH)',
    yearBuilt: 1910,
    propertyType: 'Historic Loft Penthouse',
    status: 'Exclusive Listing',
    headline: 'Step Inside a $9.45M Tribeca Architectural Loft',
    description: 'A museum-quality duplex penthouse in a historic 1910 cast-iron building. Direct key-locked elevator access opens into dramatic 22-foot timber-beamed ceilings, original exposed brick, and 12 monumental arched windows flooding the home with Southern light. Private 1,400 sq ft landscaped rooftop terrace featuring outdoor kitchen, pergola, and direct Empire State views.',
    highlights: [
      'Private 1,400 sq ft landscaped ipe wood rooftop terrace',
      'Original restored 1910 Corinthian cast-iron columns',
      'Boffi minimalist kitchen with Corian counters & Sub-Zero refrigeration',
      'Primary retreat with double-sided gas fireplace & glass solarium',
      'Deeded subterranean garage parking space & private wine cellar'
    ],
    agent: {
      name: 'Elena Rostova',
      brokerage: 'Manhattan Prime Properties',
      phone: '(212) 555-0199',
      license: 'NY RE #4910284',
      instagram: '@elenarostova.nyc'
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
        title: 'Dramatic Great Room & Columns',
        room: 'Great Room',
        caption: '22-foot timber beamed ceiling with restored 1910 cast iron Corinthian pillars.'
      },
      {
        url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
        title: 'Boffi Architectural Kitchen',
        room: 'Kitchen',
        caption: 'Monolithic Corian island with seamless induction elements and integrated wine columns.'
      },
      {
        url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1600&q=80',
        title: 'Sun-Drenched Dining Gallery',
        room: 'Dining Room',
        caption: 'Arched industrial windows overlooking cobblestone Tribeca streetscapes.'
      },
      {
        url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=80',
        title: 'Upper Level Solarium & Primary',
        room: 'Primary Suite',
        caption: 'Private steel-framed glass bedroom enclosure opening directly to the private rooftop.'
      },
      {
        url: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1600&q=80',
        title: 'Private Rooftop Oasis',
        room: 'Rooftop Terrace',
        caption: '1,400 sq ft Brazilian ipe deck with outdoor kitchen, plunge pool, and Manhattan skyline backdrop.'
      }
    ]
  },
  {
    id: 'miami-biscayne-modern',
    url: 'https://www.zillow.com/homedetails/4320-N-Bay-Rd-Miami-Beach-FL-33140/39281744_zpid/',
    title: 'The North Bay Road Waterfront Villa',
    address: '4320 N Bay Rd, Miami Beach, FL 33140',
    neighborhood: 'Miami Beach, Florida',
    price: 14800000,
    priceFormatted: '$14,800,000',
    beds: 5,
    baths: 7,
    sqft: 7100,
    lotSize: '100 ft Bay Frontage',
    yearBuilt: 2023,
    propertyType: 'Waterfront Modern Villa',
    status: 'Active Listing',
    headline: 'Inside a $14.8M Miami Waterfront Mega-Mansion',
    description: 'Ultra-luxurious tropical modern estate on prestigious North Bay Road boasting 100 feet of prime Biscayne Bay frontage. Architecturally designed with organic warm stone, louvered teak screens, and floating concrete stairs over tranquil reflection ponds. Features a commercial dock accommodating up to a 90-foot yacht, custom rooftop lounge, and outdoor entertaining pavilion.',
    highlights: [
      '100 feet of wide Biscayne Bay water frontage with private yacht dock',
      'Infinity pool with underwater viewing window into subterranean lounge',
      'Molteni&C Italian kitchen with double islands & Dornbracht fixtures',
      'Second-floor primary suite with dual walk-in boutiques & private terrace',
      'Whole-house backup generator & category 5 hurricane impact glazing'
    ],
    agent: {
      name: 'Marco Alverez',
      brokerage: 'Riviera South Florida Realty',
      phone: '(305) 790-4412',
      license: 'FL RE #3194012',
      instagram: '@marco.miamilux'
    },
    photos: [
      {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
        title: 'Bayfront Elevation & Dock',
        room: 'Exterior Waterfront',
        caption: '100 feet of prime deep-water frontage with direct boat access to Biscayne Bay.'
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
        title: 'Double-Height Living Gallery',
        room: 'Great Room',
        caption: 'Continuous travertine floors extending from interior gallery to outdoor pool deck.'
      },
      {
        url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1600&q=80',
        title: 'Dual-Island Italian Kitchen',
        room: 'Kitchen',
        caption: 'Custom matte graphite cabinetry with brushed bronze accents and integrated breakfast bar.'
      },
      {
        url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=80',
        title: 'Bayview Primary Bedroom',
        room: 'Primary Suite',
        caption: 'Unobstructed morning sunrise views over the bay with automated motorized blackout shades.'
      },
      {
        url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80',
        title: 'Bayside Infinity Pool & Daybeds',
        room: 'Pool Deck',
        caption: 'Resort-style pool with sunken firepit lounge and outdoor summer kitchen.'
      }
    ]
  }
];

// Helper: Parse URL or match curated listing
app.post('/api/parse-listing', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid listing URL.' });
    }

    const cleanUrl = url.trim().toLowerCase();

    // Check if matching one of our curated high-profile properties
    const matchedCurated = CURATED_LISTINGS.find(
      (item) => cleanUrl.includes(item.id) || cleanUrl.includes(item.url.toLowerCase())
    );
    if (matchedCurated) {
      return res.json({ listing: matchedCurated, source: 'curated-cache' });
    }

    // Try extracting address and info from the URL structure (e.g. zillow.com/homedetails/123-Main-St-City-ST-12345/...)
    let parsedAddress = '742 Evergreen Terrace, Beverly Hills, CA 90210';
    let parsedCity = 'Beverly Hills, CA';
    let zpid = '';

    const zpidMatch = url.match(/(\d{6,12})_zpid/i);
    if (zpidMatch) {
      zpid = zpidMatch[1];
    }

    const homedetailsMatch = url.match(/homedetails\/([^/]+)\//i);
    if (homedetailsMatch) {
      const slug = homedetailsMatch[1];
      const addressFromSlug = slug
        .replace(/-\d+.*$/, '')
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      if (addressFromSlug.length > 5) {
        parsedAddress = addressFromSlug;
      }
    }

    // If Gemini is available, we can parse or synthesize a high-converting listing based on the real URL
    let dynamicListing = null;
    if (ai) {
      try {
        const prompt = `Analyze this real estate listing URL: "${url}".
Extract or synthesize a realistic, luxury listing profile in JSON format:
{
  "title": "Title of property",
  "address": "Full street address",
  "neighborhood": "City, State or Neighborhood",
  "price": 4250000,
  "beds": 4,
  "baths": 5,
  "sqft": 4500,
  "lotSize": "0.45 Acres",
  "yearBuilt": 2022,
  "propertyType": "Modern Architectural Single Family",
  "headline": "A viral social media headline (under 60 chars)",
  "description": "Engaging, high-end 3-4 sentence property description highlighting architecture, natural light, chef's kitchen, and indoor-outdoor living.",
  "highlights": ["3 to 5 key features like infinity pool, custom kitchen, primary suite, etc."]
}
Only output valid JSON.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          dynamicListing = {
            id: 'listing-' + Date.now(),
            url,
            ...parsed,
            priceFormatted: '$' + (parsed.price || 3500000).toLocaleString(),
            status: 'Active Listing',
            agent: {
              name: 'Taylor Jordan',
              brokerage: 'Prestige Realty Group',
              phone: '(555) 234-8901',
              license: 'DRE #01928374',
              instagram: '@prestige.realty',
            },
            photos: [
              {
                url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
                title: 'Front Elevation & Entrance',
                room: 'Exterior Front',
                caption: 'Stunning contemporary facade with floating architectural stone overhangs.',
              },
              {
                url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
                title: 'Open Great Room',
                room: 'Living Room',
                caption: 'Expansive volume with walls of glass that disappear into perimeter pockets.',
              },
              {
                url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
                title: 'Culinary Center & Island',
                room: 'Kitchen',
                caption: 'Waterfall marble island with custom integrated panel-ready appliances.',
              },
              {
                url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
                title: 'Primary Sanctuary',
                room: 'Primary Suite',
                caption: 'Serene retreat featuring wide-plank oak flooring and private outdoor balcony.',
              },
              {
                url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
                title: 'Outdoor Entertainment Terrace',
                room: 'Terrace & Pool',
                caption: 'Heated resort pool and spa with built-in summer kitchen and gas fire pit.',
              },
            ],
          };
        }
      } catch (err) {
        console.warn('Gemini extraction fallback:', err);
      }
    }

    if (!dynamicListing) {
      // Fallback structured property
      dynamicListing = {
        id: 'listing-' + (zpid || Date.now()),
        url,
        title: parsedAddress.split(',')[0] + ' Luxury Residence',
        address: parsedAddress,
        neighborhood: parsedCity,
        price: 5950000,
        priceFormatted: '$5,950,000',
        beds: 5,
        baths: 6,
        sqft: 5800,
        lotSize: '0.5 Acres',
        yearBuilt: 2023,
        propertyType: 'Custom Architectural Home',
        status: 'Active Listing',
        headline: `Inside This Stunning $5.95M Architectural Oasis`,
        description: `Experience premier modern design with panoramic natural light, soaring ceilings, and effortless indoor-outdoor flow. Featuring an entertainer's grand salon, bespoke Italian kitchen with book-matched stone waterfall island, and a private primary wing overlooking the secluded pool terrace.`,
        highlights: [
          'Indoor-outdoor open concept with pocketing glass walls',
          'Designer kitchen with custom white-oak millwork and marble',
          'Primary suite with private terrace and spa bath',
          'Heated pool, spa, and covered alfresco outdoor dining room',
          'Complete smart home integration with architectural lighting'
        ],
        agent: {
          name: 'Taylor Jordan',
          brokerage: 'Prestige Realty Group',
          phone: '(555) 234-8901',
          license: 'DRE #01928374',
          instagram: '@prestige.realty'
        },
        photos: [
          {
            url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80',
            title: 'Modern Exterior & Courtyard',
            room: 'Exterior Front',
            caption: 'Clean architectural lines and manicured arrival courtyard.'
          },
          {
            url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=80',
            title: 'Double-Height Living Salon',
            room: 'Living Room',
            caption: 'Warm cedar ceiling with integrated linear LED architectural channels.'
          },
          {
            url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1600&q=80',
            title: 'Waterfall Marble Island Kitchen',
            room: 'Kitchen',
            caption: 'Sub-Zero refrigeration and custom induction cooktop with downdraft ventilation.'
          },
          {
            url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
            title: 'Primary Penthouse Suite',
            room: 'Primary Bedroom',
            caption: 'Spacious tranquil bedroom suite with private balcony and gas fireplace.'
          },
          {
            url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80',
            title: 'Resort Pool & Sun Deck',
            room: 'Backyard Pool',
            caption: 'Zero-edge pool with integrated spa and custom architectural sun loungers.'
          }
        ]
      };
    }

    return res.json({ listing: dynamicListing, source: 'parsed' });
  } catch (error: any) {
    console.error('Error in /api/parse-listing:', error);
    return res.status(500).json({ error: error.message || 'Failed to parse listing.' });
  }
});

// AI Copy Generator endpoint for Reels, Carousels, Captions, Hooks & Hashtags
app.post('/api/generate-copy', async (req, res) => {
  try {
    const { listing, tone = 'luxury' } = req.body;
    if (!listing) {
      return res.status(400).json({ error: 'Property data is required.' });
    }

    if (!ai) {
      // Provide high-grade intelligent templated copy if no API key
      return res.json({
        reelsHook: `Wait until you see the primary suite in this ${listing.priceFormatted} estate...`,
        reelsVoiceoverScript: [
          `Stop scrolling because this might be the cleanest architectural home on the market right now.`,
          `Welcome to ${listing.address}, listed at ${listing.priceFormatted}.`,
          `Notice how the entire living room opens up with zero-threshold pocket doors straight into the pool terrace.`,
          `And check out this kitchen — book-matched Italian marble, dual dishwashers, and a hidden butler's pantry.`,
          `Would you live here? Drop a comment below or DM me for private showing access!`
        ],
        instagramCaption: `✨ JUST LISTED | ${listing.address} ✨\n\nOffered at ${listing.priceFormatted}\n\n📍 ${listing.neighborhood}\n🛏️ ${listing.beds} Beds | 🛁 ${listing.baths} Baths | 📐 ${listing.sqft?.toLocaleString()} Sq Ft\n\nStep into pure architectural refinement. From the soaring 14-foot ceilings to the bespoke chef's kitchen and sunset infinity pool, every inch was curated for seamless California luxury living.\n\nKey Highlights:\n• ${listing.highlights?.slice(0, 3).join('\n• ')}\n\n📩 DM "@${listing.agent?.instagram?.replace('@', '') || 'agent'}" for the private tour link & floor plan.\n\n#LuxuryRealEstate #ArchitectureLovers #DreamHome #InteriorDesign #MillionDollarListing #ModernHome #TourWithMe`,
        carouselHook: `Is this the most beautiful ${listing.neighborhood} home for sale? 🕊️`,
        carouselSlidesContent: [
          { slide: 1, title: listing.title, subtitle: `${listing.priceFormatted} • ${listing.neighborhood}` },
          { slide: 2, title: 'The Specs', subtitle: `${listing.beds} Beds • ${listing.baths} Baths • ${listing.sqft} SqFt` },
          { slide: 3, title: 'The Great Room', subtitle: 'Disappearing walls of glass & 14ft cedar ceilings' },
          { slide: 4, title: 'The Chef’s Kitchen', subtitle: 'Book-matched Calacatta Gold waterfall island' },
          { slide: 5, title: 'The Primary Wing', subtitle: 'Private courtyard & boutique dressing lounge' },
          { slide: 6, title: 'The Pool Terrace', subtitle: 'Zero-edge infinity pool & sunset views' },
          { slide: 7, title: 'Private Tour Available', subtitle: `Contact ${listing.agent?.name} at ${listing.agent?.phone}` },
        ],
        hashtags: ['#LuxuryRealEstate', '#DreamHome', '#Architecture', '#ModernLiving', '#HouseTour', '#PropertyTour', '#MegaMansion', '#RealEstateReels']
      });
    }

    const prompt = `You are a world-class luxury real estate digital marketing director.
Generate viral social media marketing assets for this listing:
Address: ${listing.address}
Price: ${listing.priceFormatted}
Specs: ${listing.beds} Beds, ${listing.baths} Baths, ${listing.sqft} Sq Ft
Neighborhood: ${listing.neighborhood}
Tone: ${tone} (e.g., luxury editorial, high energy, architectural connoisseur)
Description: ${listing.description}
Highlights: ${listing.highlights?.join(', ')}

Output a JSON object with:
{
  "reelsHook": "Viral high-retention 1-line hook for Instagram Reel / TikTok",
  "reelsVoiceoverScript": ["5-6 punchy, engaging spoken sentences for a 20-30s voiceover"],
  "instagramCaption": "Full formatted Instagram caption with emojis, specs table, bullet points, call to action, and agent credit",
  "carouselHook": "Engaging question or statement for Slide 1 of a multi-slide carousel",
  "carouselSlidesContent": [
    { "slide": 1, "title": "...", "subtitle": "..." },
    { "slide": 2, "title": "...", "subtitle": "..." },
    { "slide": 3, "title": "...", "subtitle": "..." },
    { "slide": 4, "title": "...", "subtitle": "..." },
    { "slide": 5, "title": "...", "subtitle": "..." },
    { "slide": 6, "title": "...", "subtitle": "..." },
    { "slide": 7, "title": "...", "subtitle": "..." }
  ],
  "hashtags": ["list of 8-10 high-performing real estate hashtags"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (!response.text) {
      throw new Error('No response generated from AI.');
    }

    const data = JSON.parse(response.text);
    return res.json(data);
  } catch (error: any) {
    console.error('Error in /api/generate-copy:', error);
    return res.status(500).json({ error: error.message || 'Generation failed.' });
  }
});

// Provide list of curated listings directly
app.get('/api/curated-listings', (_req, res) => {
  res.json({ listings: CURATED_LISTINGS });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ZillowReel Studio running on http://0.0.0.0:${port}`);
  });
}

startServer();
