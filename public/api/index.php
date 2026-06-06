<?php
/**
 * Mahavir AV Solutions - PHP API Server
 * Replacement for server.js for standard PHP/Apache shared hosting (e.g., DreamHost)
 */

// 1. CORS Headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=UTF-8");

// 2. Configuration & Paths
$adminPassword = getenv('ADMIN_PASSWORD') ?: 'admin@mavs';
$dbPath = dirname(__DIR__) . '/data/products.json';

// Helper: Get Authorization Header (handles FastCGI / Apache environments)
function getAuthHeader() {
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        return $_SERVER['HTTP_AUTHORIZATION'];
    }
    if (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        return $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    if (function_exists('getallheaders')) {
        $headers = getallheaders();
        foreach ($headers as $key => $val) {
            if (strtolower($key) === 'authorization') {
                return $val;
            }
        }
    }
    return null;
}

// Middleware: Authenticate Request
function verifyAuth($expectedPassword) {
    $authHeader = getAuthHeader();
    if (!$authHeader || $authHeader !== $expectedPassword) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized: Invalid or missing administrator password.']);
        exit;
    }
}

// Helper: Read Database
function readDB($dbPath) {
    if (!file_exists($dbPath)) {
        return [];
    }
    $content = file_get_contents($dbPath);
    $data = json_decode($content, true);
    return is_array($data) ? $data : [];
}

// Helper: Write Database
function writeDB($dbPath, $data) {
    $dir = dirname($dbPath);
    if (!file_exists($dir)) {
        mkdir($dir, 0755, true);
    }
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    return file_put_contents($dbPath, $json) !== false;
}

// Helper: Download Remote Image Locally
function downloadProductImage($imageUrl, $productId) {
    if (!$imageUrl || stripos($imageUrl, 'http') !== 0) {
        return $imageUrl;
    }
    try {
        $targetDir = dirname(__DIR__) . '/images/products';
        if (!file_exists($targetDir)) {
            mkdir($targetDir, 0755, true);
        }
        // Sanitize product ID to use as filename
        $safeId = preg_replace('/[^a-z0-9-]/', '-', strtolower($productId));
        $filename = $safeId . '.png';
        $filepath = $targetDir . '/' . $filename;

        // Download via cURL
        $ch = curl_init($imageUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        $data = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200 && $data) {
            file_put_contents($filepath, $data);
            return '/images/products/' . $filename;
        }
    } catch (Exception $e) {
        // Fallback to remote URL on error
    }
    return $imageUrl;
}

// Helper: Clean JSON Markdown formatting from LLM responses
function cleanJsonMarkdown($str) {
    if (preg_match('/^\s*```(?:json)?\s+(.*?)\s*```\s*$/s', $str, $matches)) {
        return $matches[1];
    }
    return $str;
}

// 3. Routing Setup
$requestUri = strtok($_SERVER['REQUEST_URI'], '?');
$scriptName = dirname($_SERVER['SCRIPT_NAME']); // e.g. "/api" or "/sub/api"
$path = substr($requestUri, strlen($scriptName));
$path = '/' . ltrim($path, '/');
$method = $_SERVER['REQUEST_METHOD'];

// Parse incoming JSON body
$inputData = json_decode(file_get_contents('php://input'), true) ?: [];

// 4. API Endpoints

// Root/Status Endpoint
if ($path === '/' || $path === '') {
    echo json_encode([
        'status' => 'active',
        'name' => 'Mahavir AV Solutions PHP API Server',
        'message' => 'Backend PHP server is running successfully.',
        'endpoints' => [
            'products' => '/api/products',
            'scrape' => '/api/scrape',
            'upload' => '/api/upload'
        ]
    ]);
    exit;
}

// Admin Password Verification
if ($path === '/auth/verify' && $method === 'POST') {
    $password = $inputData['password'] ?? '';
    if ($password === $adminPassword) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Incorrect administrator password.']);
    }
    exit;
}

// Base64 File Uploads (Image, Document, Video)
if (($path === '/upload' || $path === '/upload-document' || $path === '/upload-video') && $method === 'POST') {
    verifyAuth($adminPassword);

    $filename = $inputData['filename'] ?? '';
    $base64Data = $inputData['base64Data'] ?? '';

    if (!$filename || !$base64Data) {
        http_response_code(400);
        echo json_encode(['error' => 'filename and base64Data are required']);
        exit;
    }

    // Determine targets
    if ($path === '/upload') {
        $subDir = '/images/products';
        $defaultExt = 'png';
    } elseif ($path === '/upload-document') {
        $subDir = '/documents';
        $defaultExt = 'pdf';
    } else {
        $subDir = '/videos';
        $defaultExt = 'mp4';
    }

    $targetDir = dirname(__DIR__) . $subDir;
    if (!file_exists($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    // Sanitize filename
    $ext = pathinfo($filename, PATHINFO_EXTENSION) ?: $defaultExt;
    $baseName = pathinfo($filename, PATHINFO_FILENAME);
    $sanitizedBase = preg_replace('/[^a-z0-9-]/', '-', strtolower($baseName));
    $uniqueFilename = $sanitizedBase . '-' . round(microtime(true) * 1000) . '.' . $ext;
    $filepath = $targetDir . '/' . $uniqueFilename;

    // Remove base64 data prefix if present (e.g. "data:image/png;base64,")
    if (preg_match('/^data:[^;]+;base64,(.*)$/', $base64Data, $matches)) {
        $base64Content = $matches[1];
    } else {
        $base64Content = $base64Data;
    }

    $binaryContent = base64_decode($base64Content);
    if ($binaryContent === false) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid base64 payload']);
        exit;
    }

    if (file_put_contents($filepath, $binaryContent) !== false) {
        echo json_encode([
            'success' => true,
            'localPath' => $subDir . '/' . $uniqueFilename
        ]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to write file to storage. Ensure directory permissions are writeable.']);
    }
    exit;
}

// Scrape Webpage Product Details
if ($path === '/scrape' && $method === 'POST') {
    verifyAuth($adminPassword);

    $url = $inputData['url'] ?? '';
    $apiKey = $inputData['apiKey'] ?? '';

    if (!$url) {
        http_response_code(400);
        echo json_encode(['error' => 'URL is required']);
        exit;
    }

    try {
        // Fetch target webpage HTML via cURL
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        ]);
        $html = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200 || !$html) {
            throw new Exception("HTTP request failed with status code " . $httpCode);
        }

        // Parse HTML using DOMDocument and DOMXPath
        libxml_use_internal_errors(true);
        $dom = new DOMDocument();
        // Force UTF-8 encoding
        $dom->loadHTML(mb_convert_encoding($html, 'HTML-ENTITIES', 'UTF-8'));
        $xpath = new DOMXPath($dom);

        // 1. Extract Title
        $titleNode = $xpath->query('//title');
        $title = ($titleNode && $titleNode->length > 0) ? trim($titleNode->item(0)->textContent) : '';
        if (!$title) {
            $h1Node = $xpath->query('//h1');
            $title = ($h1Node && $h1Node->length > 0) ? trim($h1Node->item(0)->textContent) : 'Scraped Product';
        }

        // 2. Extract Description
        $descNode = $xpath->query('//meta[@name="description"]/@content | //meta[@property="og:description"]/@content');
        $metaDescription = ($descNode && $descNode->length > 0) ? trim($descNode->item(0)->value) : '';

        // 3. Extract OpenGraph Image
        $imgNode = $xpath->query('//meta[@property="og:image"]/@content | //meta[@name="twitter:image"]/@content | //meta[@property="og:image:secure_url"]/@content | //link[@rel="image_src"]/@href');
        $scrapedImage = ($imgNode && $imgNode->length > 0) ? trim($imgNode->item(0)->value) : '';

        // Convert relative image path to absolute
        if ($scrapedImage && stripos($scrapedImage, 'http') !== 0) {
            try {
                $parsedUrl = parse_url($url);
                $origin = $parsedUrl['scheme'] . '://' . $parsedUrl['host'] . (isset($parsedUrl['port']) ? ':' . $parsedUrl['port'] : '');
                if (strpos($scrapedImage, '/') === 0) {
                    $scrapedImage = $origin . $scrapedImage;
                } else {
                    $scrapedImage = $origin . '/' . $scrapedImage;
                }
            } catch (Exception $e) {}
        }

        // 4. Extract YouTube Video
        $scrapedYoutubeUrl = '';
        $iframes = $xpath->query('//iframe/@src');
        foreach ($iframes as $iframe) {
            $src = $iframe->value;
            if (stripos($src, 'youtube.com') !== false || stripos($src, 'youtu.be') !== false) {
                $scrapedYoutubeUrl = (strpos($src, '//') === 0) ? 'https:' . $src : $src;
                break;
            }
        }
        if (!$scrapedYoutubeUrl) {
            $anchors = $xpath->query('//a/@href');
            foreach ($anchors as $anchor) {
                $href = $anchor->value;
                if (stripos($href, 'youtube.com/watch') !== false || stripos($href, 'youtu.be/') !== false) {
                    $scrapedYoutubeUrl = $href;
                    break;
                }
            }
        }

        // 5. Heuristic Image Fallback
        if (!$scrapedImage) {
            $imgs = $xpath->query('//img');
            foreach ($imgs as $img) {
                $src = $img->getAttribute('src') ?: $img->getAttribute('data-src') ?: $img->getAttribute('data-lazy-src') ?: '';
                $alt = $img->getAttribute('alt') ?: '';
                $class = $img->getAttribute('class') ?: '';
                $imgId = $img->getAttribute('id') ?: '';
                
                if ($src && !preg_match('/logo|icon|avatar|banner/i', $src)) {
                    if (preg_match('/product|hero|gallery|main|large|feature/i', $src . $alt . $class . $imgId)) {
                        if (stripos($src, 'http') !== 0) {
                            try {
                                $parsedUrl = parse_url($url);
                                $origin = $parsedUrl['scheme'] . '://' . $parsedUrl['host'] . (isset($parsedUrl['port']) ? ':' . $parsedUrl['port'] : '');
                                if (strpos($src, '/') === 0) {
                                    $src = $origin . $src;
                                } else {
                                    $src = $origin . '/' . $src;
                                }
                            } catch (Exception $e) {}
                        }
                        $scrapedImage = $src;
                        break;
                    }
                }
            }
        }

        // 6. Brand Detection
        $detectedBrand = 'Other';
        $brandsList = ['Poly', 'Logitech', 'Yealink', 'LG', 'Newline', 'Kramer', 'QSC', 'Barco'];
        foreach ($brandsList as $b) {
            if (stripos($title, $b) !== false || stripos($html, $b) !== false) {
                $detectedBrand = ($b === 'LG') ? 'LG Commercial Display' : (($b === 'Newline') ? 'Newline Display' : $b);
                break;
            }
        }

        // 7. Specs & Lists Parsing
        $specsMap = [];
        $listItems = [];

        // Scan Tables
        $rows = $xpath->query('//table//tr');
        foreach ($rows as $row) {
            $cells = $xpath->query('.//td | .//th', $row);
            if ($cells->length === 2) {
                $key = trim(preg_replace('/\s+/', ' ', $cells->item(0)->textContent));
                $key = rtrim($key, ':');
                $val = trim(preg_replace('/\s+/', ' ', $cells->item(1)->textContent));
                if ($key && $val && strlen($key) < 50 && strlen($val) < 250) {
                    $specsMap[$key] = $val;
                }
            }
        }

        // Scan DL/DT/DD definition lists
        $dls = $xpath->query('//dl');
        foreach ($dls as $dl) {
            $dts = $xpath->query('.//dt', $dl);
            $dds = $xpath->query('.//dd', $dl);
            for ($i = 0; $i < $dts->length && $i < $dds->length; $i++) {
                $key = trim(preg_replace('/\s+/', ' ', $dts->item($i)->textContent));
                $key = rtrim($key, ':');
                $val = trim(preg_replace('/\s+/', ' ', $dds->item($i)->textContent));
                if ($key && $val && strlen($key) < 50 && strlen($val) < 250) {
                    $specsMap[$key] = $val;
                }
            }
        }

        // Scan list items and items with colons
        $lis = $xpath->query('//ul//li | //ol//li | //*[contains(@class, "spec-item")] | //*[contains(@class, "specs-item")]');
        foreach ($lis as $li) {
            $txt = trim(preg_replace('/\s+/', ' ', $li->textContent));
            if (!$txt) continue;

            // Exclude common header/navigation texts
            if (preg_match('/sign in|log in|register|my account|cart|checkout|privacy policy|terms of|cookies|search|newsletter|language|country|all rights reserved|contact us|about us|careers|visit|support/i', $txt)) {
                continue;
            }
            if (preg_match('/www\.|http:|https:|\.com/i', $txt)) {
                continue;
            }

            // Key-Value extraction if colon matches
            $colonIdx = strpos($txt, ':');
            if ($colonIdx !== false && $colonIdx > 0 && $colonIdx < 50) {
                $key = trim(substr($txt, 0, $colonIdx));
                $val = trim(substr($txt, $colonIdx + 1));
                if (strlen($key) > 3 && strlen($key) < 50 && strlen($val) > 2 && strlen($val) < 250) {
                    $specsMap[$key] = $val;
                }
            }

            // Standard list item extraction
            $isTooShort = strlen($txt) < 30 && strpos($txt, ':') === false;
            if (strlen($txt) > 15 && strlen($txt) < 250 && !$isTooShort && count($listItems) < 10) {
                $listItems[] = $txt;
            }
        }

        // 8. Gemini AI Scraper Integration
        $keyToUse = $apiKey ?: (getenv('GEMINI_API_KEY') ?: '');
        if ($keyToUse) {
            try {
                // Fetch clean text content of body (excluding script, style, nav, footer)
                $bodyNode = $xpath->query('//body');
                $bodyText = '';
                if ($bodyNode && $bodyNode->length > 0) {
                    $bodyClone = $bodyNode->item(0);
                    // Remove scripts, styles, header, footers, and navs
                    $unwanted = $xpath->query('//script | //style | //nav | //footer | //header');
                    foreach ($unwanted as $unwNode) {
                        $unwNode->parentNode->removeChild($unwNode);
                    }
                    $bodyText = trim(preg_replace('/\s+/', ' ', $bodyClone->textContent));
                    $bodyText = substr($bodyText, 0, 10000); // Truncate to save token window
                }

                $geminiPrompt = "
Analyze the following text content scraped from a product webpage.
Extract the product details and format them exactly in the JSON format specified below.
Ensure the details are accurate. If certain fields are missing, infer or create realistic default values based on the product type.
Extract exactly 4 high-quality key features, and 3-4 quick bulleted highlights.

Target JSON Schema:
{
  \"name\": \"Product Name (e.g. Logitech Rally Bar Pro)\",
  \"sku\": \"Product SKU (e.g. LOGI-RALLY-PRO-01)\",
  \"brand\": \"One of: Poly, Logitech, Yealink, LG Commercial Display, Newline Display, Kramer, QSC, Barco (select the closest match)\",
  \"category\": \"One of: Audio, Video, Collaboration, Control, Signal, Displays, Wireless Presentation, Camera\",
  \"subCategory\": \"Sub-category name (e.g. All In One Videobar, Huddle Room Video Bar, DSP, etc.) if applicable, or empty string.\",
  \"priceRange\": \"Price range (e.g. \$1200 - \$1400)\",
  \"description\": \"A detailed 2-3 sentence product overview description.\",
  \"youtubeUrl\": \"YouTube video link if present (e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ), or empty string if not found.\",
  \"highlights\": [
    \"Quick highlight bullet 1\",
    \"Quick highlight bullet 2\",
    \"Quick highlight bullet 3\"
  ],
  \"features\": [
    {
      \"title\": \"Feature 1 Title\",
      \"description\": \"Feature 1 Description\"
    },
    {
      \"title\": \"Feature 2 Title\",
      \"description\": \"Feature 2 Description\"
    },
    {
      \"title\": \"Feature 3 Title\",
      \"description\": \"Feature 3 Description\"
    },
    {
      \"title\": \"Feature 4 Title\",
      \"description\": \"Feature 4 Description\"
    }
  ],
  \"specifications\": {
    \"Spec Label 1\": \"Spec Value 1\"
  },
  \"inTheBox\": [
    \"Item 1\",
    \"Item 2\"
  ]
}

Scraped webpage text content:
" . $bodyText;

                $urlGemini = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" . $keyToUse;
                
                $postData = [
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [
                                ['text' => $geminiPrompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'responseMimeType' => 'application/json'
                    ]
                ];

                $ch = curl_init($urlGemini);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
                curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
                curl_setopt($ch, CURLOPT_TIMEOUT, 20);
                curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
                $responseGemini = curl_exec($ch);
                $httpCodeGemini = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);

                if ($httpCodeGemini === 200 && $responseGemini) {
                    $resObj = json_decode($responseGemini, true);
                    $responseText = $resObj['candidates'][0]['content']['parts'][0]['text'] ?? '';
                    if ($responseText) {
                        $responseTextCleaned = cleanJsonMarkdown($responseText);
                        $parsedResult = json_decode($responseTextCleaned, true);
                        if ($parsedResult) {
                            if ($scrapedImage && !isset($parsedResult['image'])) {
                                $parsedResult['image'] = $scrapedImage;
                            }
                            echo json_encode([
                                'success' => true,
                                'source' => 'gemini',
                                'data' => $parsedResult
                            ]);
                            exit;
                        }
                    }
                }
            } catch (Exception $aiErr) {
                // If AI fails, proceed to heuristics fallback
            }
        }

        // Heuristics fallback parsing
        $cleanSpecs = count($specsMap) > 0 ? $specsMap : [
            'Connection Type' => 'HDMI / USB',
            'Resolution Supported' => '4K UHD / 1080p',
            'Compatibility' => 'Universal'
        ];

        $fallbackFeatures = [
            [
                'title' => 'Premium Build Quality',
                'description' => $listItems[0] ?? 'Designed for continuous commercial application in demanding AV environments.'
            ],
            [
                'title' => 'High Interoperability',
                'description' => $listItems[1] ?? 'Ensures seamless connectivity with major AV and Unified Communications brands.'
            ],
            [
                'title' => 'Simplified Integration',
                'description' => $listItems[2] ?? 'Engineered for rapid installation and configuration in corporate or educational setups.'
            ],
            [
                'title' => 'Smart Capabilities',
                'description' => $listItems[3] ?? 'Equipped with robust, enterprise-grade capabilities for professional collaboration.'
            ]
        ];

        $fallbackHighlights = [];
        for ($i = 0; $i < 3; $i++) {
            if (isset($listItems[$i])) {
                $fallbackHighlights[] = preg_replace('/^[•\s\-\*]+\s*/', '', $listItems[$i]);
            }
        }
        if (count($fallbackHighlights) === 0) {
            $fallbackHighlights = [
                'Commercial-grade reliability built for enterprise spaces.',
                'Flexible deployment options with unified platform compatibility.',
                'Intuitive user controls and simplified cabling.'
            ];
        }

        $cleanTitle = preg_replace('/ - Products.*| \| .*/i', '', $title);

        $fallbackProduct = [
            'name' => $cleanTitle,
            'sku' => strtoupper(substr($detectedBrand, 0, 3)) . '-' . rand(100, 999),
            'brand' => $detectedBrand,
            'category' => 'Collaboration',
            'priceRange' => '$500 - $800',
            'description' => $metaDescription ?: "High-performance AV equipment from {$detectedBrand}. Integrates seamlessly into enterprise infrastructure for standard audio-visual communications and presentation workflows.",
            'image' => $scrapedImage,
            'youtubeUrl' => $scrapedYoutubeUrl,
            'highlights' => $fallbackHighlights,
            'features' => $fallbackFeatures,
            'specifications' => $cleanSpecs,
            'inTheBox' => [
                "1x {$cleanTitle}",
                "1x Power Adapter & Cables",
                "1x Mounting / setup guidelines kit"
            ]
        ];

        echo json_encode([
            'success' => true,
            'source' => 'heuristics',
            'data' => $fallbackProduct
        ]);

    } catch (Exception $error) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to retrieve page content: ' . $error->getMessage()]);
    }
    exit;
}

// 5. CRUD Endpoints for /products

// GET /products - Retrieve all products
if ($path === '/products' && $method === 'GET') {
    $products = readDB($dbPath);
    echo json_encode($products);
    exit;
}

// POST /products - Create a new product
if ($path === '/products' && $method === 'POST') {
    verifyAuth($adminPassword);
    
    $products = readDB($dbPath);
    $newProduct = $inputData;

    if (empty($newProduct['name']) || empty($newProduct['brand']) || empty($newProduct['category'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Name, Brand, and Category are required']);
        exit;
    }

    // Generate unique ID if not provided
    if (empty($newProduct['id'])) {
        $skuOrName = !empty($newProduct['sku']) ? $newProduct['sku'] : $newProduct['name'];
        $idSeed = $newProduct['brand'] . '-' . $skuOrName;
        $newProduct['id'] = preg_replace('/[^a-z0-9-]/', '-', strtolower($idSeed));
    }

    // Check duplicates
    $idExists = false;
    foreach ($products as $p) {
        if (isset($p['id']) && strcasecmp($p['id'], $newProduct['id']) === 0) {
            $idExists = true;
            break;
        }
    }
    if ($idExists) {
        $newProduct['id'] .= '-' . round(microtime(true) * 1000);
    }

    // Download remote image if required
    if (!empty($newProduct['image']) && stripos($newProduct['image'], 'http') === 0) {
        $newProduct['image'] = downloadProductImage($newProduct['image'], $newProduct['id']);
    }

    array_unshift($products, $newProduct);
    writeDB($dbPath, $products);
    
    http_response_code(201);
    echo json_encode($newProduct);
    exit;
}

// Sub-route Matching for /products/{id}
if (preg_match('#^/products/([^/]+)$#', $path, $matches)) {
    $id = $matches[1];
    
    // GET /products/{id} - Retrieve single product
    if ($method === 'GET') {
        $products = readDB($dbPath);
        $product = null;
        foreach ($products as $p) {
            if (isset($p['id']) && strcasecmp($p['id'], $id) === 0) {
                $product = $p;
                break;
            }
        }
        if (!$product) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
        } else {
            echo json_encode($product);
        }
        exit;
    }

    // PUT /products/{id} - Update product details
    if ($method === 'PUT') {
        verifyAuth($adminPassword);
        
        $products = readDB($dbPath);
        $index = -1;
        foreach ($products as $i => $p) {
            if (isset($p['id']) && strcasecmp($p['id'], $id) === 0) {
                $index = $i;
                break;
            }
        }

        if ($index === -1) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            exit;
        }

        $updatedProduct = array_merge($products[$index], $inputData);

        // Download remote image if updated
        if (!empty($inputData['image']) && stripos($inputData['image'], 'http') === 0) {
            $updatedProduct['image'] = downloadProductImage($inputData['image'], $id);
        }

        $products[$index] = $updatedProduct;
        writeDB($dbPath, $products);
        echo json_encode($updatedProduct);
        exit;
    }

    // DELETE /products/{id} - Delete product
    if ($method === 'DELETE') {
        verifyAuth($adminPassword);
        
        $products = readDB($dbPath);
        $filtered = [];
        $found = false;
        foreach ($products as $p) {
            if (isset($p['id']) && strcasecmp($p['id'], $id) === 0) {
                $found = true;
            } else {
                $filtered[] = $p;
            }
        }

        if (!$found) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            exit;
        }

        writeDB($dbPath, $filtered);
        echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
        exit;
    }
}

// 404 Route Fallback
http_response_code(404);
echo json_encode(['error' => 'Not Found']);
exit;
