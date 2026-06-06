import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const dbPath = path.join(__dirname, 'data', 'products.json');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin@mavs';

// Simple auth middleware for write/sensitive endpoints
function authMiddleware(req, res, next) {
  if (req.method === 'OPTIONS') return next();
  
  const authHeader = req.headers['authorization'];
  if (!authHeader || authHeader !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or missing administrator password.' });
  }
  next();
}

// Helper to read database
function readDB() {
  try {
    if (!fs.existsSync(dbPath)) {
      return [];
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return [];
  }
}

// Helper to write database
function writeDB(data) {
  try {
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to database:', error);
    return false;
  }
}

// API Routes

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'active',
    name: 'Mahavir AV Solutions API Server',
    message: 'Backend server is running successfully.',
    endpoints: {
      products: '/api/products',
      scrape: '/api/scrape'
    }
  });
});

// Direct Image Upload Endpoint (Base64)
app.post('/api/upload', authMiddleware, async (req, res) => {
  const { filename, base64Data } = req.body;

  if (!filename || !base64Data) {
    return res.status(400).json({ error: 'filename and base64Data are required' });
  }

  try {
    const productsDir = path.join(__dirname, 'public', 'images', 'products');
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
    }

    // Clean and sanitize the filename
    const ext = path.extname(filename) || '.png';
    const baseName = path.basename(filename, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-');
    const sanitizedFilename = `${baseName}-${Date.now()}${ext}`;
    const filepath = path.join(productsDir, sanitizedFilename);

    // Decode base64 data
    // Remove metadata prefix if present (e.g., "data:image/png;base64,")
    const base64Content = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Content, 'base64');

    // Write binary file
    fs.writeFileSync(filepath, buffer);

    res.json({ success: true, localPath: `/images/products/${sanitizedFilename}` });
  } catch (err) {
    console.error('Failed to save uploaded image:', err);
    res.status(500).json({ error: `Failed to save image: ${err.message}` });
  }
});

// Direct Document Upload Endpoint (Base64)
app.post('/api/upload-document', authMiddleware, async (req, res) => {
  const { filename, base64Data } = req.body;

  if (!filename || !base64Data) {
    return res.status(400).json({ error: 'filename and base64Data are required' });
  }

  try {
    const docsDir = path.join(__dirname, 'public', 'documents');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Clean and sanitize the filename
    const ext = path.extname(filename) || '.pdf';
    const baseName = path.basename(filename, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-');
    const sanitizedFilename = `${baseName}-${Date.now()}${ext}`;
    const filepath = path.join(docsDir, sanitizedFilename);

    // Decode base64 data
    // Remove metadata prefix (e.g., "data:application/pdf;base64,")
    const base64Content = base64Data.replace(/^data:[a-zA-Z0-9-\/]+;base64,/, "");
    const buffer = Buffer.from(base64Content, 'base64');

    // Write binary file
    fs.writeFileSync(filepath, buffer);

    res.json({ success: true, localPath: `/documents/${sanitizedFilename}` });
  } catch (err) {
    console.error('Failed to save uploaded document:', err);
    res.status(500).json({ error: `Failed to save document: ${err.message}` });
  }
});

// Direct Video Upload Endpoint (Base64)
app.post('/api/upload-video', authMiddleware, async (req, res) => {
  const { filename, base64Data } = req.body;

  if (!filename || !base64Data) {
    return res.status(400).json({ error: 'filename and base64Data are required' });
  }

  try {
    const videosDir = path.join(__dirname, 'public', 'videos');
    if (!fs.existsSync(videosDir)) {
      fs.mkdirSync(videosDir, { recursive: true });
    }

    // Clean and sanitize the filename
    const ext = path.extname(filename) || '.mp4';
    const baseName = path.basename(filename, ext)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-');
    const sanitizedFilename = `${baseName}-${Date.now()}${ext}`;
    const filepath = path.join(videosDir, sanitizedFilename);

    // Decode base64 data
    // Remove metadata prefix if present (e.g., "data:video/mp4;base64,")
    const base64Content = base64Data.replace(/^data:[a-zA-Z0-9-\/]+;base64,/, "");
    const buffer = Buffer.from(base64Content, 'base64');

    // Write binary file
    fs.writeFileSync(filepath, buffer);

    res.json({ success: true, localPath: `/videos/${sanitizedFilename}` });
  } catch (err) {
    console.error('Failed to save uploaded video:', err);
    res.status(500).json({ error: `Failed to save video: ${err.message}` });
  }
});

// Admin Authentication Verification
app.post('/api/auth/verify', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true });
  }
  return res.status(401).json({ success: false, error: 'Incorrect administrator password.' });
});

// Get all products
app.get('/api/products', (req, res) => {
  const products = readDB();
  res.json(products);
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  const products = readDB();
  const product = products.find(p => p.id && p.id.toLowerCase() === req.params.id.toLowerCase());
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Helper to download remote image locally
async function downloadProductImage(imageUrl, productId) {
  if (!imageUrl || !imageUrl.startsWith('http')) {
    return imageUrl;
  }
  try {
    const productsDir = path.join(__dirname, 'public', 'images', 'products');
    if (!fs.existsSync(productsDir)) {
      fs.mkdirSync(productsDir, { recursive: true });
    }
    const filename = `${productId.toLowerCase().replace(/[^a-z0-9-]/g, '-')}.png`;
    const filepath = path.join(productsDir, filename);

    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
      timeout: 10000
    });

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });

    return `/images/products/${filename}`;
  } catch (err) {
    console.error(`Failed to download product image from ${imageUrl}:`, err.message);
    return imageUrl; // Fallback to remote URL on failure
  }
}

// Add a new product
app.post('/api/products', authMiddleware, async (req, res) => {
  const products = readDB();
  const newProduct = req.body;

  if (!newProduct.name || !newProduct.brand || !newProduct.category) {
    return res.status(400).json({ error: 'Name, Brand, and Category are required' });
  }

  // Generate ID if missing
  if (!newProduct.id) {
    newProduct.id = `${newProduct.brand}-${newProduct.sku || newProduct.name}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-');
  }

  // Prevent duplicate IDs
  if (products.some(p => p.id === newProduct.id)) {
    newProduct.id = `${newProduct.id}-${Date.now()}`;
  }

  // Auto-download remote image
  if (newProduct.image && newProduct.image.startsWith('http')) {
    newProduct.image = await downloadProductImage(newProduct.image, newProduct.id);
  }

  products.unshift(newProduct); // Add to the front
  writeDB(products);
  res.status(201).json(newProduct);
});

// Update a product
app.put('/api/products/:id', authMiddleware, async (req, res) => {
  const products = readDB();
  const index = products.findIndex(p => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const updatedProduct = { ...products[index], ...req.body };

  // Auto-download remote image if updated
  if (req.body.image && req.body.image.startsWith('http')) {
    updatedProduct.image = await downloadProductImage(req.body.image, req.params.id);
  }

  products[index] = updatedProduct;
  writeDB(products);
  res.json(products[index]);
});

// Delete a product
app.delete('/api/products/:id', authMiddleware, (req, res) => {
  const products = readDB();
  const filtered = products.filter(p => p.id !== req.params.id);
  if (products.length === filtered.length) {
    return res.status(404).json({ error: 'Product not found' });
  }
  writeDB(filtered);
  res.json({ success: true, message: 'Product deleted' });
});

// AI Scraper API Endpoint
app.post('/api/scrape', authMiddleware, async (req, res) => {
  const { url, apiKey } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Fetch target URL HTML
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      },
      timeout: 10000
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract product image from the HTML
    let scrapedImage = '';
    
    // Check standard meta image tags first
    scrapedImage = $('meta[property="og:image"]').attr('content') || 
                   $('meta[name="twitter:image"]').attr('content') || 
                   $('meta[property="og:image:secure_url"]').attr('content') || 
                   $('link[rel="image_src"]').attr('href') || '';
                   
    // Resolve relative URL to absolute URL
    if (scrapedImage && !scrapedImage.startsWith('http')) {
      try {
        const parsedUrl = new URL(url);
        scrapedImage = new URL(scrapedImage, parsedUrl.origin).href;
      } catch (e) {
        console.error('Failed to parse relative og:image:', e);
      }
    }

    // Extract product YouTube URL from the HTML
    let scrapedYoutubeUrl = '';
    $('iframe').each((i, el) => {
      const src = $(el).attr('src') || '';
      if (src.includes('youtube.com') || src.includes('youtu.be')) {
        scrapedYoutubeUrl = src.startsWith('//') ? `https:${src}` : src;
      }
    });
    if (!scrapedYoutubeUrl) {
      $('a').each((i, el) => {
        const href = $(el).attr('href') || '';
        if (href.includes('youtube.com/watch') || href.includes('youtu.be/')) {
          scrapedYoutubeUrl = href;
        }
      });
    }
    
    // Heuristic image finder if meta tags fail
    if (!scrapedImage) {
      const imgCandidates = [];
      $('img').each((i, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src') || $(el).attr('data-lazy-src') || '';
        const alt = $(el).attr('alt') || '';
        const className = $(el).attr('class') || '';
        const id = $(el).attr('id') || '';
        
        if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('avatar') && !src.includes('banner')) {
          const isProductHint = /product|hero|gallery|main|large|feature/i.test(src + alt + className + id);
          if (isProductHint) {
            let absoluteSrc = src;
            if (!src.startsWith('http')) {
              try {
                const parsedUrl = new URL(url);
                absoluteSrc = new URL(src, parsedUrl.origin).href;
              } catch (e) {}
            }
            imgCandidates.push(absoluteSrc);
          }
        }
      });
      if (imgCandidates.length > 0) {
        scrapedImage = imgCandidates[0];
      }
    }

    // Extract raw text for standard parser
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'Scraped Product';
    const metaDescription = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    
    // Extract list items to identify potential features, ignoring menus/navs/headers/footers
    const listItems = [];
    const contentArea = $('body').clone();
    contentArea.find('script, style, nav, footer, header, [role="navigation"], .menu, .nav, #header, #footer, .footer, .header, .breadcrumbs, .breadcrumb').remove();
    
    contentArea.find('ul li, ol li').each((i, el) => {
      const txt = $(el).text().trim().replace(/\s+/g, ' ');
      // Filter out typical navigation, support pages, social, search, etc.
      const isMenuWord = /sign in|log in|register|my account|cart|checkout|privacy policy|terms of|cookies|search|newsletter|language|country|all rights reserved|contact us|about us|careers|visit|support/i.test(txt);
      // Filter out raw URLs
      const hasUrl = /www\.|http:|https:|\.com/i.test(txt);
      // Filter out breadcrumbs/very short categories
      const isTooShort = txt.length < 30 && !txt.includes(':');
      
      if (txt.length > 15 && txt.length < 250 && !isMenuWord && !hasUrl && !isTooShort && listItems.length < 10) {
        listItems.push(txt);
      }
    });

    // Detect brand based on page title or content
    let detectedBrand = 'Other';
    const brandsList = ['Poly', 'Logitech', 'Yealink', 'LG', 'Newline', 'Kramer', 'QSC', 'Barco'];
    for (const b of brandsList) {
      if (title.toLowerCase().includes(b.toLowerCase()) || html.toLowerCase().includes(b.toLowerCase())) {
        detectedBrand = b === 'LG' ? 'LG Commercial Display' : b === 'Newline' ? 'Newline Display' : b;
        break;
      }
    }

    // Attempt to extract specs from tables, definition lists, or lists with colons
    const specsMap = {};
    
    // 1. Scan tables
    contentArea.find('table tr').each((i, el) => {
      const cells = $(el).find('td, th');
      if (cells.length === 2) {
        const key = $(cells[0]).text().trim().replace(/\s+/g, ' ').replace(/:$/, '');
        const val = $(cells[1]).text().trim().replace(/\s+/g, ' ');
        if (key && val && key.length < 50 && val.length < 250) {
          specsMap[key] = val;
        }
      }
    });

    // 2. Scan definition lists (dl, dt, dd)
    contentArea.find('dl').each((i, dlEl) => {
      const dts = $(dlEl).find('dt');
      const dds = $(dlEl).find('dd');
      dts.each((idx, dtEl) => {
        if (idx < dds.length) {
          const key = $(dtEl).text().trim().replace(/\s+/g, ' ').replace(/:$/, '');
          const val = $(dds[idx]).text().trim().replace(/\s+/g, ' ');
          if (key && val && key.length < 50 && val.length < 250) {
            specsMap[key] = val;
          }
        }
      });
    });

    // 3. Scan list items or divs that have a colon "Label: Value" format
    contentArea.find('ul li, ol li, .spec-item, .specs-item').each((i, el) => {
      const txt = $(el).text().trim();
      const colonIdx = txt.indexOf(':');
      if (colonIdx > 0 && colonIdx < 50) {
        const key = txt.substring(0, colonIdx).trim().replace(/\s+/g, ' ');
        const val = txt.substring(colonIdx + 1).trim().replace(/\s+/g, ' ');
        if (key.length > 3 && key.length < 50 && val.length > 2 && val.length < 250) {
          specsMap[key] = val;
        }
      }
    });

    // Handle Gemini Parsing if API key is provided
    const keyToUse = apiKey || process.env.GEMINI_API_KEY;
    if (keyToUse) {
      try {
        // Collect page text content
        const bodyText = $('body').clone().find('script, style, nav, footer').remove().end().text().replace(/\s+/g, ' ').substring(0, 10000);
        
        const ai = new GoogleGenerativeAI(keyToUse);
        const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `
Analyze the following text content scraped from a product webpage.
Extract the product details and format them exactly in the JSON format specified below.
Ensure the details are accurate. If certain fields are missing, infer or create realistic default values based on the product type.
Extract exactly 4 high-quality key features, and 3-4 quick bulleted highlights.

Target JSON Schema:
{
  "name": "Product Name (e.g. Logitech Rally Bar Pro)",
  "sku": "Product SKU (e.g. LOGI-RALLY-PRO-01)",
  "brand": "One of: Poly, Logitech, Yealink, LG Commercial Display, Newline Display, Kramer, QSC, Barco (select the closest match)",
  "category": "One of: Audio, Video, Collaboration, Control, Signal, Displays, Wireless Presentation, Camera",
  "subCategory": "Sub-category name (e.g. All In One Videobar, Huddle Room Video Bar, DSP, etc.) if applicable, or empty string.",
  "priceRange": "Price range (e.g. $1200 - $1400)",
  "description": "A detailed 2-3 sentence product overview description.",
  "youtubeUrl": "YouTube video link if present (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ), or empty string if not found.",
  "highlights": [
    "Quick highlight bullet 1 (e.g. 4K Ultra-HD camera with 120-degree FOV)",
    "Quick highlight bullet 2 (e.g. Integrates native Zoom and Teams rooms support)",
    "Quick highlight bullet 3 (e.g. AI-powered auto framing and speaker tracking)"
  ],
  "features": [
    {
      "title": "Clear and concise title for Feature 1 (e.g. Ultra-HD 4K Camera)",
      "description": "Engaging description explaining what Feature 1 is and why it matters."
    },
    {
      "title": "Clear and concise title for Feature 2 (e.g. Smart Beamforming Mics)",
      "description": "Engaging description explaining what Feature 2 is and why it matters."
    },
    {
      "title": "Clear and concise title for Feature 3",
      "description": "Engaging description explaining what Feature 3 is and why it matters."
    },
    {
      "title": "Clear and concise title for Feature 4",
      "description": "Engaging description explaining what Feature 4 is and why it matters."
    }
  ],
  "specifications": {
    "Specific Specification Label (e.g. Resolution)": "Value (e.g. 4K Ultra HD)",
    "Specific Specification Label 2": "Value 2"
  },
  "inTheBox": [
    "1x Product main unit",
    "Power Cable",
    "Mounting Brackets"
  ]
}

Scraped webpage text content:
${bodyText}
`;

        const aiResult = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json'
          }
        });

        const parsedResult = JSON.parse(aiResult.response.text);
        if (scrapedImage && !parsedResult.image) {
          parsedResult.image = scrapedImage;
        }
        return res.json({ success: true, source: 'gemini', data: parsedResult });
      } catch (aiErr) {
        console.error('Gemini extraction failed, falling back to heuristics:', aiErr);
      }
    }

    // Heuristics Fallback if no Gemini key or Gemini fails
    const cleanSpecs = Object.keys(specsMap).length > 0 ? specsMap : {
      'Connection Type': 'HDMI / USB',
      'Resolution Supported': '4K UHD / 1080p',
      'Compatibility': 'Universal'
    };

    const fallbackFeatures = [
      {
        title: 'Premium Build Quality',
        description: listItems[0] || 'Designed for continuous commercial application in demanding AV environments.'
      },
      {
        title: 'High Interoperability',
        description: listItems[1] || 'Ensures seamless connectivity with major AV and Unified Communications brands.'
      },
      {
        title: 'Simplified Integration',
        description: listItems[2] || 'Engineered for rapid installation and configuration in corporate or educational setups.'
      },
      {
        title: 'Smart Capabilities',
        description: listItems[3] || 'Equipped with robust, enterprise-grade capabilities for professional collaboration.'
      }
    ];

    const rawHighlights = listItems.slice(0, 3).map(item => item.replace(/^[•\s\-\*]+\s*/, ''));
    const fallbackHighlights = rawHighlights.length > 0 ? rawHighlights : [
      'Commercial-grade reliability built for enterprise spaces.',
      'Flexible deployment options with unified platform compatibility.',
      'Intuitive user controls and simplified cabling.'
    ];

    const fallbackProduct = {
      name: title.replace(/ - Products.*| \| .*/g, ''),
      sku: `${detectedBrand.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      brand: detectedBrand,
      category: 'Collaboration',
      priceRange: '$500 - $800',
      description: metaDescription || `High-performance AV equipment from ${detectedBrand}. Integrates seamlessly into enterprise infrastructure for standard audio-visual communications and presentation workflows.`,
      image: scrapedImage,
      youtubeUrl: scrapedYoutubeUrl,
      highlights: fallbackHighlights,
      features: fallbackFeatures,
      specifications: cleanSpecs,

      inTheBox: [
        `1x ${title}`,
        '1x Power Adapter & Cables',
        '1x Mounting / setup guidelines kit'
      ]
    };

    res.json({ success: true, source: 'heuristics', data: fallbackProduct });

  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ error: `Failed to retrieve page content: ${error.message}` });
  }
});

// Serve static assets in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Serve public upload folders
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));
app.use('/documents', express.static(path.join(__dirname, 'public', 'documents')));
app.use('/videos', express.static(path.join(__dirname, 'public', 'videos')));

// Catch-all route to serve the React SPA index.html for hash routing
app.get('*', (req, res) => {
  const indexFile = path.join(distPath, 'index.html');
  if (fs.existsSync(indexFile)) {
    res.sendFile(indexFile);
  } else {
    res.status(404).send('Frontend build folder "dist" is missing. Please run "npm run build" first.');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
