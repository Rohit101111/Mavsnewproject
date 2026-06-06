import fs from 'fs';
import path from 'path';

const brands = [
  'Poly',
  'Logitech',
  'Yealink',
  'LG Commercial Display',
  'Newline Display',
  'Kramer',
  'QSC',
  'Barco'
];

const categories = [
  'Audio',
  'Video',
  'Collaboration',
  'Control',
  'Signal',
  'Displays',
  'Wireless Presentation'
];

// Product name elements for generation
const nouns = {
  Poly: ['Studio', 'Voyager', 'Sync', 'Trio', 'Edge', 'CCX', 'Blackwire', 'Polycom'],
  Logitech: ['Rally', 'MeetUp', 'Tap', 'Brio', 'Zone', 'Scribe', 'Swytch', 'Sight'],
  Yealink: ['MeetingBar', 'DeskPhone', 'MeetingBoard', 'Speakerphone', 'RoomPanel', 'UVC', 'WPP'],
  'LG Commercial Display': ['UltraHD Signage', 'OLED Video Wall', 'Interactive Board', 'Stretch Display', 'High Brightness', 'Smart Signage'],
  'Newline Display': ['Lyra Touch', 'Elara Screen', 'Q Series', 'Flex Desktop', 'Naos IP', 'Atlas Board'],
  Kramer: ['Matrix Switcher', 'AV-over-IP Transceiver', 'Presentation Scaler', 'HDBaseT Extender', 'Active Cable', 'VIA Connect'],
  QSC: ['Q-SYS Core Processor', 'AcousticDesign Speaker', 'CX-Q Amplifier', 'TSC Touch Screen', 'NL-SB Soundbar', 'Attero Tech Endpoint'],
  Barco: ['ClickShare', 'UDX Projector', 'F80 Laser Projector', 'UniSee LCD Wall', 'XT LED Module', 'Demco Display']
};

const suffixes = ['Pro', 'Max', 'Ultra', 'Plus', 'Lite', 'X', 'Prime', 'Elite', '2', '3', '4K', 'Gen 2'];

const featuresByCategory = {
  Audio: [
    'Dynamic noise cancellation for crystal clear meetings',
    'Acoustic echo cancellation and automatic gain control',
    'Wideband audio frequency response for natural voice reproduction',
    'Daisy-chain support for expanding audio coverage in large rooms',
    'Omnidirectional microphone array with 360-degree pickup'
  ],
  Video: [
    'Stunning 4K Ultra HD resolution at 30/60 fps',
    'AI-powered auto-framing and speaker tracking technology',
    'Wide field-of-view lens capturing everyone in the room',
    'Low-light optimization and high dynamic range (HDR) support',
    'PTZ motorized zoom with multiple preset recalls'
  ],
  Collaboration: [
    'All-in-one bar design integrating camera, speakers, and mics',
    'Native support for Zoom Rooms and Microsoft Teams Rooms',
    'One-touch join functionality with intuitive room controllers',
    'Wireless content sharing from laptops, tablets, and phones',
    'Cloud-managed diagnostics and automated firmware updates'
  ],
  Control: [
    'Highly intuitive touchscreen interface with custom UI options',
    'Power over Ethernet (PoE) for clean, single-cable installation',
    'Seamless integration with third-party lighting and shading systems',
    'Proximity sensors that wake the device automatically upon entry',
    'Enterprise-grade security with LDAP, 802.1X, and SSL encryption'
  ],
  Signal: [
    'Zero-latency AV-over-IP signal distribution over 1G/10G networks',
    'HDMI 2.0 and HDCP 2.2 compliant pathing',
    'Advanced scaling technology ensuring optimal display fit',
    'Analog audio embedding and de-embedding',
    'Bi-directional RS-232, IR, and Ethernet control pass-through'
  ],
  Displays: [
    '24/7 continuous operation rating for mission-critical apps',
    'Anti-glare panel surface with high haze rating',
    'Ultra-narrow bezel designs for seamless multi-screen configurations',
    'Built-in system-on-chip (SoC) media player with local storage',
    'Crestron Connected and Cisco Webex integration certified'
  ],
  'Wireless Presentation': [
    'One-click USB button pairing for instant screen projection',
    'Interactive whiteboarding and blackboarding annotations',
    'Split-screen support displaying up to four content sources simultaneously',
    'Dual-network separation keeping guests isolated from secure corporate LAN',
    'Low latency screen mirroring for smooth fluid presentations'
  ]
};

const specsByCategory = {
  Audio: {
    'Frequency Response': '20Hz - 20kHz',
    Impedance: '8 Ohms nominal',
    'Max SPL': '96 dB @ 1m',
    'Microphone Pickup': 'Up to 6 meters (20 feet)',
    Connectivity: 'USB-C, Bluetooth 5.2, 3.5mm Aux'
  },
  Video: {
    Resolution: '4K Ultra HD (3840 x 2160)',
    'Field of View': '120° Diagonal, 110° Horizontal',
    Zoom: '5x Digital Zoom',
    'Frame Rate': '60 fps @ 1080p, 30 fps @ 4K',
    Sensor: '1/2.5" CMOS Sensor'
  },
  Collaboration: {
    OS: 'Android 10 / Microsoft Teams Rooms on Android',
    VideoOutputs: '2x HDMI Out (dual screen support)',
    Network: '1x RJ45 Gigabit Ethernet, Wi-Fi 802.11ac',
    Microphones: 'Built-in 6-mic beamforming array',
    Speakers: 'Stereo speakers with passive radiator design'
  },
  Control: {
    Display: '10.1-inch IPS Touch Panel',
    Resolution: '1280 x 800 WXGA',
    Power: 'IEEE 802.3af PoE Class 3',
    Mounting: 'Tabletop stand or wall mount included',
    Sensors: 'Ambient light sensor, Motion detection'
  },
  Signal: {
    Inputs: '4x HDMI Type A, 1x USB-C Alt-Mode',
    Outputs: '1x HDBaseT RJ-45, 1x HDMI Loop Out',
    'Max Distance': '100m over Cat6a cable',
    Bandwidth: '18 Gbps (HDMI 2.0)',
    'HDCP Version': 'HDCP 2.2 / 1.4 compliant'
  },
  Displays: {
    Brightness: '500 cd/m² (Typical)',
    'Operation Hours': '24 Hours / 7 Days',
    Orientation: 'Landscape and Portrait supported',
    'Bezel Width': '1.1 mm (Even bezel)',
    Inputs: '2x HDMI 2.0, 1x DisplayPort 1.2, 1x USB 2.0'
  },
  'Wireless Presentation': {
    'Wireless Protocol': 'Wi-Fi 802.11 a/g/n/ac/ax',
    'Outputs Supported': '1x HDMI 4K UHD @ 30Hz',
    'Simultaneous Connections': 'Up to 32 users',
    Encryption: 'WPA2-PSK (AES-128 bit)',
    Range: 'Up to 30m (100 feet) line of sight'
  }
};

const categoryByNoun = {
  // Poly
  Studio: 'Collaboration',
  Voyager: 'Audio',
  Sync: 'Audio',
  Trio: 'Audio',
  Edge: 'Collaboration',
  CCX: 'Collaboration',
  Blackwire: 'Audio',
  Polycom: 'Collaboration',

  // Logitech
  Rally: 'Collaboration',
  MeetUp: 'Collaboration',
  Tap: 'Control',
  Brio: 'Video',
  Zone: 'Audio',
  Scribe: 'Video',
  Swytch: 'Signal',
  Sight: 'Video',

  // Yealink
  MeetingBar: 'Collaboration',
  DeskPhone: 'Collaboration',
  MeetingBoard: 'Displays',
  Speakerphone: 'Audio',
  RoomPanel: 'Control',
  UVC: 'Video',
  WPP: 'Wireless Presentation',

  // LG
  'UltraHD Signage': 'Displays',
  'OLED Video Wall': 'Displays',
  'Interactive Board': 'Displays',
  'Stretch Display': 'Displays',
  'High Brightness': 'Displays',
  'Smart Signage': 'Displays',

  // Newline
  'Lyra Touch': 'Displays',
  'Elara Screen': 'Displays',
  'Q Series': 'Displays',
  'Flex Desktop': 'Displays',
  'Naos IP': 'Displays',
  'Atlas Board': 'Displays',

  // Kramer
  'Matrix Switcher': 'Signal',
  'AV-over-IP Transceiver': 'Signal',
  'Presentation Scaler': 'Signal',
  'HDBaseT Extender': 'Signal',
  'Active Cable': 'Signal',
  'VIA Connect': 'Wireless Presentation',

  // QSC
  'Q-SYS Core Processor': 'Control',
  'AcousticDesign Speaker': 'Audio',
  'CX-Q Amplifier': 'Audio',
  'TSC Touch Screen': 'Control',
  'NL-SB Soundbar': 'Audio',
  'Attero Tech Endpoint': 'Audio',

  // Barco
  ClickShare: 'Wireless Presentation',
  'UDX Projector': 'Video',
  'F80 Laser Projector': 'Video',
  'UniSee LCD Wall': 'Displays',
  'XT LED Module': 'Displays',
  'Demco Display': 'Displays'
};

const brandShortcodes = {
  Poly: 'POLY',
  Logitech: 'LOGI',
  Yealink: 'YEAL',
  'LG Commercial Display': 'LGCD',
  'Newline Display': 'NEWL',
  Kramer: 'KRAM',
  QSC: 'QSYS',
  Barco: 'BARC'
};

function generateUniqueId(brand, sku) {
  return `${brandShortcodes[brand]}-${sku}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
}

function generateProducts() {
  const products = [];
  const targetCount = 600;

  // Let's generate ~75 products per brand to hit ~600
  const productsPerBrand = Math.ceil(targetCount / brands.length);

  for (const brand of brands) {
    const brandNouns = nouns[brand];
    
    for (let i = 1; i <= productsPerBrand; i++) {
      const noun = brandNouns[(i - 1) % brandNouns.length];
      const suffix = suffixes[(i * 3 + 7) % suffixes.length];
      const modelNum = 100 + (i * 10);
      
      const name = `${brand} ${noun} ${suffix} ${modelNum}`;
      const sku = `${brandShortcodes[brand]}-${noun.substring(0, 3).toUpperCase()}-${modelNum}-${suffix.toUpperCase().replace(/\s/g, '')}`;
      
      const category = categoryByNoun[noun] || 'Collaboration';
      const id = generateUniqueId(brand, sku);
      
      // Select base specifications for this category and tweak them slightly
      const baseSpecs = specsByCategory[category];
      const specifications = {};
      for (const [key, value] of Object.entries(baseSpecs)) {
        // Add slight variations based on model number or index
        if (key === 'Resolution' && i % 3 === 0) {
          specifications[key] = '1080p Full HD (1920 x 1080)';
        } else if (key === 'Brightness' && category === 'Displays') {
          specifications[key] = `${400 + (i % 5) * 100} cd/m²`;
        } else if (key === 'Max Distance' && category === 'Signal') {
          specifications[key] = `${70 + (i % 4) * 15}m over Cat6a`;
        } else {
          specifications[key] = value;
        }
      }

      // Generate features
      const catFeatures = featuresByCategory[category] || [];
      const features = [
        `High-performance ${brand} hardware optimized for modern professional workspaces.`,
        ...catFeatures.slice(0, 3),
        `Designed for rapid installation and seamless interoperability in ${category} workflows.`
      ];

      // Quote ranges
      const lowPrice = 250 + (i % 20) * 150;
      const highPrice = lowPrice + 100 + (i % 10) * 80;
      const priceRange = `$${lowPrice} - $${highPrice}`;

      products.push({
        id,
        sku,
        name,
        brand,
        category,
        priceRange,
        description: `The ${name} is a high-grade ${category.toLowerCase()} solution developed specifically to meet the high demands of enterprise systems integrators. Engineered with ${brand}'s proprietary technology, it delivers exceptional reliability, easy management, and robust integration support. This model is ideal for upgrading conference rooms, lecture halls, executive spaces, or digital signage deployments.`,
        features,
        specifications,
        inTheBox: [
          `1x ${name} unit`,
          '1x Region-specific Power Supply & Cord',
          '1x Mounting kit / hardware template',
          '1x Premium connection cable (HDMI/USB/CAT)',
          '1x Quick Start Installation Guide'
        ],
        resources: [
          { name: 'Product Datasheet (PDF)', type: 'PDF' },
          { name: 'Installation & User Manual (PDF)', type: 'PDF' },
          { name: 'CAD Drawing Reference (DWG)', type: 'CAD' },
          { name: 'Control Protocol Driver API (TXT)', type: 'API' }
        ]
      });
    }
  }

  // Create directories if they don't exist
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const dbPath = path.join(dataDir, 'products.json');
  fs.writeFileSync(dbPath, JSON.stringify(products, null, 2), 'utf-8');
  console.log(`Generated ${products.length} products successfully in ${dbPath}`);
}

generateProducts();
