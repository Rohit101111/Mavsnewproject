import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, AlertCircle, CheckCircle, Save, Plus, Trash, Globe, ArrowRight } from 'lucide-react';

const standardVideobarSpecs = [
  'Camera Resolution',
  'Image Sensor',
  'Field of View (FOV)',
  'Zoom Capability',
  'AI Camera Features',
  'Microphone Array',
  'Audio Pickup Range',
  'Speaker Configuration',
  'Audio Processing Technologies',
  'Connectivity Interfaces',
  'Supported Video Platforms',
  'Operating Modes (USB BYOD / Appliance Mode)',
  'Number of Supported Displays',
  'Expansion Microphone Support',
  'Device Management & Monitoring',
  'Mounting Options',
  'Dimensions & Weight',
  'Power Requirements'
];

const standardPTZCameraSpecs = [
  'Camera Resolution',
  'Image Sensor',
  'Optical Zoom',
  'Digital Zoom',
  'Field of View (FOV)',
  'Pan & Tilt Range',
  'Frame Rate',
  'Autofocus',
  'AI Tracking & Auto Framing',
  'Video Outputs',
  'Control Protocols',
  'Preset Positions',
  'Power Requirements',
  'Network Connectivity',
  'Mounting Options',
  'Weight & Dimensions'
];

export const standardSubCategories = [
  'All In One Videobar',
  'PTZ Camera',
  'Speaker Microphone',
  'Expansion Microphone',
  'Interactive Display',
  'Non Interactive Display',
  'Ceiling Microphone',
  'DSP Audio Processor',
  'Touch Controller',
  'Wireless Transmitter',
  'Signal Switcher'
];

function initializeFeatures(rawFeatures) {
  const initialized = [];
  const source = Array.isArray(rawFeatures) ? rawFeatures : [];
  for (let i = 0; i < 4; i++) {
    const feat = source[i];
    if (feat) {
      if (typeof feat === 'string') {
        const cleaned = feat.replace(/^[•\s\-\*]+\s*/, '');
        initialized.push({ 
          title: `Feature Capability #${i + 1}`, 
          description: cleaned, 
          image: '' 
        });
      } else {
        const descCleaned = (feat.description || '').replace(/^[•\s\-\*]+\s*/, '');
        initialized.push({ 
          title: feat.title || '', 
          description: descCleaned, 
          image: feat.image || '' 
        });
      }
    } else {
      initialized.push({ title: '', description: '', image: '' });
    }
  }
  return initialized;
}

function mergeSpecsForVideobar(scrapedSpecsArray) {
  const scrapedMap = {};
  scrapedSpecsArray.forEach(s => {
    if (s.key) scrapedMap[s.key.toLowerCase().trim()] = s.val;
  });

  return standardVideobarSpecs.map(stdKey => {
    let matchedVal = '';
    const stdKeyLower = stdKey.toLowerCase().trim();
    const stdKeyClean = stdKeyLower.replace(/\(.*\)/g, '').trim();

    // Check for direct match or synonym match
    for (const [scrapedKey, val] of Object.entries(scrapedMap)) {
      // 1. Direct or clean substring check
      const isDirectMatch = 
        scrapedKey === stdKeyLower ||
        scrapedKey === stdKeyClean ||
        (scrapedKey.length > 3 && stdKeyClean.includes(scrapedKey)) ||
        (scrapedKey.length > 3 && scrapedKey.includes(stdKeyClean));

      if (isDirectMatch) {
        matchedVal = val;
        break;
      }

      // 2. Synonym heuristics
      if (stdKeyClean === 'camera resolution' && (scrapedKey === 'resolution' || scrapedKey.includes('video resolution'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'zoom capability' && scrapedKey === 'zoom') {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'field of view' && (scrapedKey.includes('field of view') || scrapedKey === 'fov')) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'ai camera features' && (scrapedKey.includes('rightlight') || scrapedKey.includes('rightsight') || scrapedKey.includes('directorai') || scrapedKey.includes('framing') || scrapedKey.includes('grid view'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'microphone array' && (scrapedKey.includes('microphone') || scrapedKey.includes('beamforming') || scrapedKey === 'mics')) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'audio pickup range' && (scrapedKey.includes('pickup range') || scrapedKey.includes('microphone range') || scrapedKey.includes('range'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'speaker configuration' && (scrapedKey.includes('speaker') || scrapedKey.includes('drivers'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'power requirements' && (scrapedKey.includes('power') || scrapedKey.includes('voltage') || scrapedKey.includes('power supply'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'dimensions & weight' && (scrapedKey.includes('dimensions') || scrapedKey.includes('weight') || scrapedKey.includes('size'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'mounting options' && (scrapedKey.includes('mount') || scrapedKey.includes('mounting'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'expansion microphone support' && (scrapedKey.includes('add-on mic') || scrapedKey.includes('expansion mic') || scrapedKey.includes('mic pod'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'supported video platforms' && (scrapedKey.includes('compatibility') || scrapedKey.includes('certification') || scrapedKey.includes('platforms'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'number of supported displays' && scrapedKey.includes('displays supported')) {
        matchedVal = val;
        break;
      }
    }

    return { key: stdKey, val: matchedVal };
  });
}

function mergeSpecsForPTZCamera(scrapedSpecsArray) {
  const scrapedMap = {};
  scrapedSpecsArray.forEach(s => {
    if (s.key) scrapedMap[s.key.toLowerCase().trim()] = s.val;
  });

  return standardPTZCameraSpecs.map(stdKey => {
    let matchedVal = '';
    const stdKeyLower = stdKey.toLowerCase().trim();
    const stdKeyClean = stdKeyLower.replace(/\(.*\)/g, '').trim();

    for (const [scrapedKey, val] of Object.entries(scrapedMap)) {
      const isDirectMatch = 
        scrapedKey === stdKeyLower ||
        scrapedKey === stdKeyClean ||
        (scrapedKey.length > 3 && stdKeyClean.includes(scrapedKey)) ||
        (scrapedKey.length > 3 && scrapedKey.includes(stdKeyClean));

      if (isDirectMatch) {
        matchedVal = val;
        break;
      }

      // Synonym mappings
      if (stdKeyClean === 'camera resolution' && (scrapedKey === 'resolution' || scrapedKey.includes('video resolution') || scrapedKey.includes('max resolution'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'optical zoom' && (scrapedKey === 'zoom' || scrapedKey.includes('optical zoom') || scrapedKey === 'optical zoom capability')) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'digital zoom' && (scrapedKey.includes('digital zoom'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'field of view' && (scrapedKey.includes('field of view') || scrapedKey === 'fov' || scrapedKey.includes('diagonal fov') || scrapedKey.includes('horizontal fov'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'pan & tilt range' && (scrapedKey.includes('pan') || scrapedKey.includes('tilt') || scrapedKey.includes('pan/tilt') || scrapedKey.includes('range'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'frame rate' && (scrapedKey.includes('frame rate') || scrapedKey.includes('fps') || scrapedKey.includes('framerate'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'ai tracking & auto framing' && (scrapedKey.includes('tracking') || scrapedKey.includes('auto framing') || scrapedKey.includes('presenter tracking') || scrapedKey.includes('auto-framing'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'video outputs' && (scrapedKey.includes('outputs') || scrapedKey.includes('interfaces') || scrapedKey.includes('video output') || scrapedKey.includes('ports'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'control protocols' && (scrapedKey.includes('control') || scrapedKey.includes('protocol') || scrapedKey.includes('visca') || scrapedKey.includes('pelco'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'preset positions' && (scrapedKey.includes('presets') || scrapedKey.includes('preset positions') || scrapedKey.includes('preset'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'power requirements' && (scrapedKey.includes('power') || scrapedKey.includes('voltage') || scrapedKey.includes('poe'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'network connectivity' && (scrapedKey.includes('network') || scrapedKey.includes('ethernet') || scrapedKey.includes('connectivity') || scrapedKey === 'ip')) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'mounting options' && (scrapedKey.includes('mount') || scrapedKey.includes('mounting') || scrapedKey.includes('installation'))) {
        matchedVal = val;
        break;
      }
      if (stdKeyClean === 'weight & dimensions' && (scrapedKey.includes('dimensions') || scrapedKey.includes('weight') || scrapedKey.includes('size') || scrapedKey.includes('dimension'))) {
        matchedVal = val;
        break;
      }
    }

    return { key: stdKey, val: matchedVal };
  });
}

export default function AdminScanner({ setActivePage, setSelectedProductId, selectedProductId, onLogout }) {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState(null);
  
  // Scraped edit form states
  const [editProduct, setEditProduct] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const [features, setFeatures] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [boxItems, setBoxItems] = useState([]);
  const [resources, setResources] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    if (selectedProductId) {
      fetchProductForEditing(selectedProductId);
    } else {
      // Clear form states if not editing
      setEditProduct(null);
      setHighlights(['', '', '']);
      setFeatures([
        { title: '', description: '', image: '' },
        { title: '', description: '', image: '' },
        { title: '', description: '', image: '' },
        { title: '', description: '', image: '' }
      ]);
      setSpecs([]);
      setBoxItems([]);
      setResources([]);
      setProductImages([]);
      setIsEditMode(false);
    }
  }, [selectedProductId]);

  const fetchProductForEditing = async (id) => {
    try {
      setLoading(true);
      setError(null);
      setStatusText('Loading catalog product details for editing...');
      const res = await fetch(`/api/products/${id}`);
      if (!res.ok) throw new Error('Product not found in database');
      const prod = await res.json();
      
      setEditProduct(prod);
      setFeatures(initializeFeatures(prod.features));
      
      // Load highlights or fallback to legacy features if they are simple string bullets
      const initialHighlights = prod.highlights || (Array.isArray(prod.features) && typeof prod.features[0] === 'string' ? prod.features : ['', '', '']);
      setHighlights(initialHighlights);
      
      const specsArray = Object.entries(prod.specifications || {}).map(([key, val]) => ({ key, val }));
      setSpecs(specsArray);
      setBoxItems(prod.inTheBox || []);
      setResources(prod.resources || []);
      setProductImages(prod.images || (prod.image ? [prod.image] : []));
      setIsEditMode(true);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load product for editing');
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  const switchToScanMode = () => {
    if (setSelectedProductId) setSelectedProductId(null);
    setEditProduct(null);
    setHighlights(['', '', '']);
    setFeatures([
      { title: '', description: '', image: '' },
      { title: '', description: '', image: '' },
      { title: '', description: '', image: '' },
      { title: '', description: '', image: '' }
    ]);
    setSpecs([]);
    setBoxItems([]);
    setResources([]);
    setProductImages([]);
    setIsEditMode(false);
    setUrl('');
  };

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
    'Display',
    'Wireless Presentation',
    'Camera',
    'Cables & Connectors',
    'Headphone'
  ];

  const handleScrape = async (e) => {
    e.preventDefault();
    if (!url) return;

    // Reset edit mode when scanning a new URL
    if (setSelectedProductId) setSelectedProductId(null);
    setIsEditMode(false);

    setLoading(true);
    setError(null);
    setEditProduct(null);
    setStatusText('Contacting local proxy server...');

    try {
      setTimeout(() => setStatusText('Fetching webpage HTML content...'), 1000);
      setTimeout(() => setStatusText(apiKey ? 'Analyzing and parsing with Gemini AI...' : 'Parsing metadata and structure via local parser...'), 2500);

      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('mavs_admin_password') || ''
        },
        body: JSON.stringify({ url, apiKey })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Server error while scraping web page');
      }

      const result = await res.json();
      
      if (result.success) {
        const prod = result.data;
        // If editing, preserve the ID of the product we are updating
        if (isEditMode) {
          prod.id = selectedProductId;
        }
        setEditProduct(prod);
        setFeatures(initializeFeatures(prod.features));
        setHighlights(prod.highlights || []);
        setProductImages(prod.image ? [prod.image] : []);
        
        // Convert specs object to array for easy key-value editing
        let specsArray = Object.entries(prod.specifications || {}).map(([key, val]) => ({ key, val }));
        if (prod.subCategory === 'PTZ Camera') {
          specsArray = mergeSpecsForPTZCamera(specsArray);
        } else if (prod.category === 'Camera' || prod.subCategory === 'All In One Videobar') {
          specsArray = mergeSpecsForVideobar(specsArray);
        }
        setSpecs(specsArray);
        
        setBoxItems(prod.inTheBox || []);
        setResources(prod.resources || [
          { name: `${prod.name || 'Product'} Datasheet`, type: 'PDF' },
          { name: `${prod.name || 'Product'} User Manual`, type: 'PDF' }
        ]);
      } else {
        throw new Error('Failed to parse details from the page.');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Scrape failed. Verify the URL is public and backend is active.');
    } finally {
      setLoading(false);
      setStatusText('');
    }
  };

  // Form management helpers
  const handleFeatureTitleChange = (index, value) => {
    const updated = [...features];
    updated[index] = { ...updated[index], title: value };
    setFeatures(updated);
  };

  const handleFeatureDescChange = (index, value) => {
    const updated = [...features];
    updated[index] = { ...updated[index], description: value };
    setFeatures(updated);
  };

  const handleFeatureImageUrlChange = (index, value) => {
    const updated = [...features];
    updated[index] = { ...updated[index], image: value };
    setFeatures(updated);
  };

  const [uploadingFeatureIdx, setUploadingFeatureIdx] = useState(null);

  const handleFeatureImageUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingFeatureIdx(index);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': sessionStorage.getItem('mavs_admin_password') || ''
            },
            body: JSON.stringify({
              filename: file.name,
              base64Data: reader.result
            })
          });

          if (!res.ok) {
            throw new Error('Failed to upload image file');
          }

          const data = await res.json();
          if (data.success) {
            const updated = [...features];
            updated[index] = { ...updated[index], image: data.localPath };
            setFeatures(updated);
            alert('Feature image uploaded successfully!');
          } else {
            throw new Error(data.error || 'Failed to upload image');
          }
        } catch (uploadErr) {
          console.error(uploadErr);
          alert(`Upload error: ${uploadErr.message}`);
        } finally {
          setUploadingFeatureIdx(null);
        }
      };
      reader.onerror = () => {
        alert('Failed to read file');
        setUploadingFeatureIdx(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('Error reading image file');
      setUploadingFeatureIdx(null);
    }
  };

  const handleSpecKeyChange = (index, value) => {
    const updated = [...specs];
    updated[index].key = value;
    setSpecs(updated);
  };

  const handleSpecValChange = (index, value) => {
    const updated = [...specs];
    updated[index].val = value;
    setSpecs(updated);
  };

  const addSpec = () => setSpecs([...specs, { key: '', val: '' }]);
  const removeSpec = (index) => setSpecs(specs.filter((_, idx) => idx !== index));

  const handleHighlightChange = (index, value) => {
    const updated = [...highlights];
    updated[index] = value;
    setHighlights(updated);
  };

  const addHighlight = () => setHighlights([...highlights, '']);
  const removeHighlight = (index) => setHighlights(highlights.filter((_, idx) => idx !== index));

  const handleBoxChange = (index, value) => {
    const updated = [...boxItems];
    updated[index] = value;
    setBoxItems(updated);
  };

  const addBoxItem = () => setBoxItems([...boxItems, '']);
  const removeBoxItem = (index) => setBoxItems(boxItems.filter((_, idx) => idx !== index));

  const handleResourceNameChange = (index, value) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], name: value };
    setResources(updated);
  };

  const handleResourceTypeChange = (index, value) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], type: value };
    setResources(updated);
  };

  const handleResourceUrlChange = (index, value) => {
    const updated = [...resources];
    updated[index] = { ...updated[index], url: value };
    setResources(updated);
  };

  const handleResourceFileUpload = async (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const updated = [...resources];
    updated[index] = { 
      ...updated[index], 
      name: updated[index].name || file.name.split('.')[0] 
    };
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await fetch('/api/upload-document', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': sessionStorage.getItem('mavs_admin_password') || ''
            },
            body: JSON.stringify({
              filename: file.name,
              base64Data: reader.result
            })
          });

          if (!res.ok) {
            throw new Error('Failed to upload document file');
          }

          const data = await res.json();
          if (data.success) {
            updated[index].url = data.localPath;
            setResources(updated);
            alert(`Document "${file.name}" uploaded and linked successfully!`);
          } else {
            throw new Error(data.error || 'Failed to upload document');
          }
        } catch (uploadErr) {
          console.error(uploadErr);
          alert(`Upload error: ${uploadErr.message}`);
        }
      };
      reader.onerror = () => {
        alert('Failed to read file');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('Error reading document file');
    }
  };

  const addResource = () => setResources([...resources, { name: '', type: 'PDF', url: '' }]);
  const removeResource = (index) => setResources(resources.filter((_, idx) => idx !== index));

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    const uploadedPaths = [];

    try {
      for (const file of files) {
        const path = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = async () => {
            try {
              const res = await fetch('/api/upload', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': sessionStorage.getItem('mavs_admin_password') || ''
                },
                body: JSON.stringify({
                  filename: file.name,
                  base64Data: reader.result
                })
              });
              if (!res.ok) throw new Error(`Failed to upload ${file.name}`);
              const data = await res.json();
              if (data.success) {
                resolve(data.localPath);
              } else {
                reject(new Error(data.error || 'Upload failed'));
              }
            } catch (err) {
              reject(err);
            }
          };
          reader.onerror = () => reject(new Error('File reading failed'));
          reader.readAsDataURL(file);
        });
        uploadedPaths.push(path);
      }

      setProductImages(prev => {
        const next = [...prev, ...uploadedPaths];
        setEditProduct(prevProd => ({
          ...prevProd,
          image: prevProd.image || next[0] || ''
        }));
        return next;
      });

      alert(`Successfully uploaded ${files.length} image(s)!`);
    } catch (err) {
      console.error(err);
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await fetch('/api/upload-video', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': sessionStorage.getItem('mavs_admin_password') || ''
            },
            body: JSON.stringify({
              filename: file.name,
              base64Data: reader.result
            })
          });

          if (!res.ok) {
            throw new Error('Failed to upload video file');
          }

          const data = await res.json();
          if (data.success) {
            setEditProduct(prev => ({
              ...prev,
              youtubeUrl: data.localPath
            }));
            alert(`Video "${file.name}" uploaded and linked successfully!`);
          } else {
            throw new Error(data.error || 'Failed to upload video');
          }
        } catch (uploadErr) {
          console.error(uploadErr);
          alert(`Upload error: ${uploadErr.message}`);
        } finally {
          setUploadingVideo(false);
        }
      };
      reader.onerror = () => {
        alert('Failed to read file');
        setUploadingVideo(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      alert('Error reading video file');
      setUploadingVideo(false);
    }
  };

  const handleSaveProduct = async () => {
    if (!editProduct.name || !editProduct.brand || !editProduct.category) {
      alert('Please fill out Name, Brand, and Category.');
      return;
    }

    // Reconstruct specs object
    const specsObj = {};
    specs.forEach(s => {
      if (s.key && s.val) specsObj[s.key] = s.val;
    });

    const payload = {
      ...editProduct,
      image: editProduct.image || productImages[0] || '',
      images: productImages,
      highlights: highlights.filter(h => h.trim() !== ''),
      features: features.filter(f => f.title.trim() !== '' || f.description.trim() !== ''),
      specifications: specsObj,
      inTheBox: boxItems.filter(b => b.trim() !== ''),
      resources: resources.filter(r => r.name.trim() !== '')
    };

    try {
      const endpoint = isEditMode ? `/api/products/${editProduct.id}` : '/api/products';
      const method = isEditMode ? 'PUT' : 'POST';
      const res = await fetch(endpoint, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': sessionStorage.getItem('mavs_admin_password') || ''
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to save product');

      const saved = await res.json();
      alert(isEditMode ? 'Product updated successfully! Redirecting to details page.' : 'Product saved successfully! Redirecting to details page.');
      
      // Select the product and redirect
      setSelectedProductId(saved.id);
      setActivePage('product-detail');
    } catch (err) {
      console.error(err);
      alert('Error committing product to catalog database.');
    }
  };

  return (
    <div className="container py-half animate-fade">
      <div className="mb-6" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span className="badge badge-brand">Admin Console</span>
          <h1 className="text-3xl mt-2">AI Product Adder</h1>
          <p className="text-muted text-sm">Automate catalog entries by scraping and parsing information from external manufacture pages.</p>
        </div>
        {onLogout && (
          <button className="btn btn-secondary btn-sm" onClick={onLogout} style={{ border: '1px solid rgba(239, 68, 68, 0.25)', color: '#f87171' }}>
            Logout & Lock Portal
          </button>
        )}
      </div>

      {/* Scraper Input Panel */}
      <section className="glass-panel mb-8">
        {isEditMode && (
          <div style={{
            background: 'rgba(99, 102, 241, 0.08)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }} className="animate-fade">
            <div>
              <span className="badge badge-brand" style={{ marginBottom: '0.25rem' }}>Edit Mode Active</span>
              <p style={{ fontSize: '0.85rem', color: '#e5e7eb' }}>
                You are currently editing <strong>{editProduct?.name || 'an existing product'}</strong>. Saving will overwrite its details in the catalog.
              </p>
            </div>
            <button className="btn btn-secondary btn-sm" onClick={switchToScanMode} style={{ padding: '0.3rem 0.75rem' }}>
              Switch to Scan Mode
            </button>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <Sparkles size={20} className="text-primary-gradient" />
          <h2 className="text-lg">Scan External Webpage</h2>
        </div>
        
        <form onSubmit={handleScrape}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Globe size={14} /> Product URL to Scan
              </label>
              <input
                type="url"
                required
                className="input-control"
                placeholder="https://www.brand.com/products/model-xyz"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <span className="text-muted text-sm" style={{ marginTop: '2px' }}>
                Works with any public product page.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                <Shield size={14} /> Gemini API Key (Optional Override)
              </label>
              <input
                type="password"
                className="input-control"
                placeholder="AI API Key for deep spec structuring..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <span className="text-muted text-sm" style={{ marginTop: '2px' }}>
                Leave blank to use local metadata scraper or system key.
              </span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }} className="flex justify-between align-center">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} className="text-muted" />
              <p className="text-muted text-sm" style={{ maxWidth: '500px' }}>
                You can review, modify, and format specifications in the editor below before saving it to the public inventory catalog.
              </p>
            </div>
            
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>Scraping...</>
              ) : (
                <>Scan Webpage <ArrowRight size={16} /></>
              )}
            </button>
          </div>
        </form>

        {/* Scraper Status */}
        {loading && (
          <div className="flex-center flex-col mt-6" style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '8px', border: '1px dashed var(--border-color)' }}>
            <div style={{
              width: '32px',
              height: '32px',
              border: '2px solid rgba(255,255,255,0.1)',
              borderTopColor: 'var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginBottom: '1rem'
            }} />
            <p style={{ fontSize: '0.9rem', color: '#fff' }}>{statusText}</p>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-6" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            color: '#f87171',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}
      </section>

      {/* Editable Scraped Product Result */}
      {editProduct && (
        <section className="glass-panel animate-slide-up" style={{ borderColor: 'rgba(99,102,241,0.25)' }}>
          <div className="flex justify-between align-center mb-6" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
            <div className="flex align-center gap-2">
              <CheckCircle size={20} style={{ color: 'var(--color-primary)' }} />
              <h2 className="text-xl">
                {isEditMode ? `Edit Product: ${editProduct.name}` : 'Scanned Product Details Editor'}
              </h2>
            </div>
            <button className="btn btn-primary btn-sm flex-center" onClick={handleSaveProduct}>
              <Save size={16} /> {isEditMode ? 'Update Product Details' : 'Save Product to Catalog'}
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            {/* Responsive grid for basic details */}
            <div className="admin-form-grid">
              <div className="form-group span-md-2">
                <label className="form-label">Product Name</label>
                <input
                  type="text"
                  className="input-control"
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">SKU ID</label>
                <input
                  type="text"
                  className="input-control"
                  value={editProduct.sku}
                  onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Brand</label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. Poly, Logitech..."
                  value={editProduct.brand}
                  onChange={(e) => setEditProduct({ ...editProduct, brand: e.target.value })}
                  list="brands-list"
                />
                <datalist id="brands-list">
                  {brands.map(b => <option key={b} value={b} />)}
                </datalist>
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="input-control"
                  value={editProduct.category}
                  onChange={(e) => {
                    const newCat = e.target.value;
                    setEditProduct(prev => {
                      const updated = { ...prev, category: newCat };
                      if (newCat === 'Camera') {
                        setSpecs(prevSpecs => mergeSpecsForVideobar(prevSpecs));
                      }
                      return updated;
                    });
                  }}
                  style={{ background: 'rgba(0,0,0,0.5)', cursor: 'pointer' }}
                >
                  {categories.map(c => <option key={c} value={c} style={{ background: 'var(--bg-secondary)' }}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Sub-Category</label>
                <select
                  className="input-control"
                  value={
                    !editProduct.subCategory 
                      ? "" 
                      : standardSubCategories.includes(editProduct.subCategory) 
                        ? editProduct.subCategory 
                        : "Custom"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    let newSub = val;
                    if (val === "Custom") {
                      newSub = "Custom Sub-Category";
                    }
                    setEditProduct(prev => ({ ...prev, subCategory: newSub }));
                    
                    if (val === 'PTZ Camera') {
                      setSpecs(prevSpecs => mergeSpecsForPTZCamera(prevSpecs));
                    } else if (val === 'All In One Videobar') {
                      setSpecs(prevSpecs => mergeSpecsForVideobar(prevSpecs));
                    }
                  }}
                  style={{ background: 'rgba(0,0,0,0.5)', cursor: 'pointer' }}
                >
                  <option value="" style={{ background: 'var(--bg-secondary)' }}>-- None / Select Sub-Category --</option>
                  {standardSubCategories.map(sub => (
                    <option key={sub} value={sub} style={{ background: 'var(--bg-secondary)' }}>{sub}</option>
                  ))}
                  <option value="Custom" style={{ background: 'var(--bg-secondary)' }}>Other (Type Custom...)</option>
                </select>

                {/* Conditional Text Field for custom subcategory */}
                {editProduct.subCategory && !standardSubCategories.includes(editProduct.subCategory) && (
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Enter custom sub-category..."
                    value={editProduct.subCategory === "Custom Sub-Category" ? "" : editProduct.subCategory}
                    onChange={(e) => setEditProduct({ ...editProduct, subCategory: e.target.value })}
                    style={{ marginTop: '0.4rem' }}
                  />
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Estimated Price Range</label>
                <input
                  type="text"
                  className="input-control"
                  value={editProduct.priceRange}
                  onChange={(e) => setEditProduct({ ...editProduct, priceRange: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Product Image URL</span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                      id="product-image-upload"
                      disabled={uploadingImage}
                    />
                    <label 
                      htmlFor="product-image-upload" 
                      className="btn btn-accent btn-sm flex-center"
                      style={{ padding: '0.15rem 0.5rem', fontSize: '0.75rem', height: 'auto', cursor: 'pointer', margin: 0 }}
                    >
                      {uploadingImage ? 'Uploading...' : 'Upload Images'}
                    </label>
                  </div>
                </label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. /images/products/model.png or web URL"
                  value={editProduct.image || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, image: e.target.value })}
                />
                
                {/* Uploading progress indicator */}
                {uploadingImage && (
                  <div style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px dashed rgba(99, 102, 241, 0.3)',
                    borderRadius: '6px',
                    padding: '0.35rem 0.5rem'
                  }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid rgba(255,255,255,0.1)',
                      borderTopColor: 'var(--color-primary)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <span style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>Uploading and saving to local assets...</span>
                  </div>
                )}

                {/* Thumbnail grid for uploaded images */}
                {productImages.length > 0 && (
                  <div style={{
                    marginTop: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.2)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.75rem'
                  }}>
                    <p className="text-muted mb-2" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Uploaded Images ({productImages.length})</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
                      {productImages.map((img, idx) => (
                        <div 
                          key={idx} 
                          style={{
                            position: 'relative',
                            height: '80px',
                            border: editProduct.image === img ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                            borderRadius: '6px',
                            background: '#070a13',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            boxShadow: editProduct.image === img ? '0 0 8px rgba(225,90,69,0.2)' : 'none'
                          }}
                          onClick={() => {
                            setEditProduct(prev => ({ ...prev, image: img }));
                          }}
                          title="Click to set as primary catalog image"
                        >
                          <img src={img} alt={`Preview ${idx}`} style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain' }} />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              const updated = productImages.filter((_, i) => i !== idx);
                              setProductImages(updated);
                              setEditProduct(prev => ({
                                ...prev,
                                image: prev.image === img ? (updated[0] || '') : prev.image
                              }));
                            }}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              background: 'rgba(239, 68, 68, 0.85)',
                              border: 'none',
                              color: '#fff',
                              borderRadius: '4px',
                              width: '18px',
                              height: '18px',
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: 0
                            }}
                            title="Remove image"
                          >
                            &times;
                          </button>
                          {editProduct.image === img && (
                            <span style={{
                              position: 'absolute',
                              bottom: '0',
                              left: '0',
                              right: '0',
                              background: 'var(--color-primary)',
                              color: '#fff',
                              fontSize: '0.6rem',
                              textAlign: 'center',
                              padding: '1px 0',
                              fontWeight: 600
                            }}>
                              Primary
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Product Video URL (YouTube or MP4/WebM)</span>
                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={handleVideoUpload}
                      style={{ display: 'none' }}
                      id="product-video-upload"
                      disabled={uploadingVideo}
                    />
                    <label 
                      htmlFor="product-video-upload" 
                      className="btn btn-accent btn-sm flex-center"
                      style={{ padding: '0.15rem 0.5rem', fontSize: '0.75rem', height: 'auto', cursor: 'pointer', margin: 0 }}
                    >
                      {uploadingVideo ? 'Uploading...' : 'Upload Video'}
                    </label>
                  </div>
                </label>
                <input
                  type="text"
                  className="input-control"
                  placeholder="e.g. https://www.youtube.com/watch?v=... or local MP4 path"
                  value={editProduct.youtubeUrl || ''}
                  onChange={(e) => setEditProduct({ ...editProduct, youtubeUrl: e.target.value })}
                />
                
                {/* Uploading video progress indicator */}
                {uploadingVideo && (
                  <div style={{
                    marginTop: '0.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '1px dashed rgba(99, 102, 241, 0.3)',
                    borderRadius: '6px',
                    padding: '0.35rem 0.5rem'
                  }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid rgba(255,255,255,0.1)',
                      borderTopColor: 'var(--color-primary)',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    <span style={{ fontSize: '0.75rem', color: '#a5b4fc' }}>Uploading and saving video to local assets...</span>
                  </div>
                )}
              </div>

              <div className="form-group span-md-3" style={{ marginTop: '0.5rem' }}>
                <label className="form-label">Overview Description</label>
                <textarea
                  className="input-control"
                  style={{ minHeight: '220px' }}
                  value={editProduct.description}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  placeholder="Provide a detailed overview description..."
                />
              </div>
            </div>

            {/* Key Highlights Editor (Hero Bullet Points) */}
            <div>
              <div className="flex justify-between align-center mb-2">
                <label className="form-label" style={{ color: 'var(--color-primary)' }}>
                  Key Highlights (Hero Quick Bullet Points next to Image)
                </label>
                <button className="btn btn-secondary btn-sm flex-center" onClick={addHighlight} style={{ padding: '0.2rem 0.6rem' }}>
                  <Plus size={14} /> Add Highlight Bullet
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {highlights.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      className="input-control flex-1"
                      placeholder={`Highlight bullet #${idx + 1}`}
                      value={item}
                      onChange={(e) => handleHighlightChange(idx, e.target.value)}
                    />
                    <button className="btn btn-danger btn-sm" onClick={() => removeHighlight(idx)} style={{ padding: '0.75rem' }}>
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 3: Key Features & Capabilities Redesign */}
            <div>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.75rem', fontSize: '1rem', color: 'var(--color-primary)' }}>
                Key Features & Capabilities (Exactly 4 Alternating Highlights)
              </label>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {features.map((feat, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>
                        Feature #{idx + 1} ({idx % 2 === 0 ? 'Image on Left' : 'Image on Right'} layout)
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Structured Highlight</span>
                    </div>

                    <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: '0.75rem' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Feature Title</label>
                        <input
                          type="text"
                          className="input-control"
                          placeholder="e.g. Smart Beamforming Mics"
                          value={feat.title || ''}
                          onChange={(e) => handleFeatureTitleChange(idx, e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span>Feature Image URL</span>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleFeatureImageUpload(idx, e)}
                              style={{ display: 'none' }}
                              id={`feature-image-upload-${idx}`}
                              disabled={uploadingFeatureIdx !== null}
                            />
                            <label 
                              htmlFor={`feature-image-upload-${idx}`}
                              className="btn btn-accent btn-sm flex-center"
                              style={{ padding: '0.15rem 0.5rem', fontSize: '0.7rem', height: 'auto', cursor: 'pointer', margin: 0 }}
                            >
                              {uploadingFeatureIdx === idx ? 'Uploading...' : 'Upload Image'}
                            </label>
                          </div>
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="input-control flex-1"
                            placeholder="e.g. /images/features/mic.png"
                            value={feat.image || ''}
                            onChange={(e) => handleFeatureImageUrlChange(idx, e.target.value)}
                          />
                          {feat.image && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '42px',
                              height: '42px',
                              borderRadius: '6px',
                              background: '#ffffff',
                              border: '1px solid var(--border-color)',
                              padding: '2px',
                              overflow: 'hidden',
                              position: 'relative',
                              cursor: 'pointer'
                            }}
                            title="Click to remove feature image"
                            onClick={() => handleFeatureImageUrlChange(idx, '')}
                            >
                              <img src={feat.image} alt="Feature Thumbnail" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                              <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(239, 68, 68, 0.7)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#fff',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                opacity: 0,
                                transition: 'opacity 0.2s'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                              onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                              >
                                Del
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Feature Description</label>
                      <textarea
                        className="input-control"
                        style={{ minHeight: '120px', fontSize: '0.85rem' }}
                        placeholder="Detailed description of this capability..."
                        value={feat.description || ''}
                        onChange={(e) => handleFeatureDescChange(idx, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 4: Technical Specifications Grid key-values */}
            <div>
              <div className="flex justify-between align-center mb-2">
                <label className="form-label">Technical Parameters / Specs</label>
                <button className="btn btn-secondary btn-sm flex-center" onClick={addSpec} style={{ padding: '0.2rem 0.6rem' }}>
                  <Plus size={14} /> Add Parameter
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {specs.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      className="input-control"
                      style={{ width: '35%' }}
                      placeholder="Parameter (e.g. Max Range)"
                      value={item.key}
                      onChange={(e) => handleSpecKeyChange(idx, e.target.value)}
                    />
                    <input
                      type="text"
                      className="input-control flex-1"
                      placeholder="Value (e.g. 50 meters)"
                      value={item.val}
                      onChange={(e) => handleSpecValChange(idx, e.target.value)}
                    />
                    <button className="btn btn-danger btn-sm" onClick={() => removeSpec(idx)} style={{ padding: '0.75rem' }}>
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 5: In the Box contents */}
            <div>
              <div className="flex justify-between align-center mb-2">
                <label className="form-label">In The Box Contents</label>
                <button className="btn btn-secondary btn-sm flex-center" onClick={addBoxItem} style={{ padding: '0.2rem 0.6rem' }}>
                  <Plus size={14} /> Add Package Item
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {boxItems.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      className="input-control flex-1"
                      value={item}
                      onChange={(e) => handleBoxChange(idx, e.target.value)}
                    />
                    <button className="btn btn-danger btn-sm" onClick={() => removeBoxItem(idx)} style={{ padding: '0.75rem' }}>
                      <Trash size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Row 6: Documentation & Downloads (Resources) */}
            <div>
              <div className="flex justify-between align-center mb-3">
                <label className="form-label">Documentation & Downloads (Resources)</label>
                <button className="btn btn-secondary btn-sm flex-center" onClick={addResource} style={{ padding: '0.2rem 0.6rem' }}>
                  <Plus size={14} /> Add Download/Resource
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {resources.map((res, idx) => (
                  <div key={idx} className="flex flex-col gap-2" style={{
                    background: 'rgba(255, 255, 255, 0.01)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    padding: '0.75rem'
                  }}>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        className="input-control flex-1"
                        placeholder="Resource Name (e.g. Poly Studio V12 Datasheet)"
                        value={res.name}
                        onChange={(e) => handleResourceNameChange(idx, e.target.value)}
                      />
                      <select
                        className="input-control"
                        style={{ width: '160px', background: 'rgba(0,0,0,0.5)', cursor: 'pointer' }}
                        value={res.type}
                        onChange={(e) => handleResourceTypeChange(idx, e.target.value)}
                      >
                        <option value="PDF" style={{ background: 'var(--bg-secondary)' }}>PDF Document</option>
                        <option value="CAD" style={{ background: 'var(--bg-secondary)' }}>CAD / Revit</option>
                        <option value="ZIP" style={{ background: 'var(--bg-secondary)' }}>ZIP Archive</option>
                        <option value="API" style={{ background: 'var(--bg-secondary)' }}>API Reference</option>
                        <option value="URL" style={{ background: 'var(--bg-secondary)' }}>External URL</option>
                      </select>
                      <button className="btn btn-danger btn-sm" onClick={() => removeResource(idx)} style={{ padding: '0.75rem' }}>
                        <Trash size={14} />
                      </button>
                    </div>

                    {/* Document Upload Button & Status Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem' }}>
                      <input
                        type="file"
                        accept=".pdf,.zip,.cad,.dwg,.rvt,.txt,.doc,.docx"
                        onChange={(e) => handleResourceFileUpload(idx, e)}
                        style={{ display: 'none' }}
                        id={`resource-file-upload-${idx}`}
                      />
                      <label 
                        htmlFor={`resource-file-upload-${idx}`}
                        className="btn btn-accent btn-sm flex-center"
                        style={{ padding: '0.15rem 0.5rem', fontSize: '0.75rem', height: 'auto', cursor: 'pointer', margin: 0 }}
                      >
                        Upload Document
                      </label>
                      
                      <span className="text-muted" style={{ fontSize: '0.75rem', textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', flex: 1 }}>
                        {res.url ? (
                          <span style={{ color: '#10b981', fontWeight: 500 }}>
                            ✓ Linked: {res.url}
                          </span>
                        ) : (
                          "No file uploaded yet (or enter link below)"
                        )}
                      </span>
                    </div>
                    
                    {/* Manual Link Input */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', width: '60px' }}>Link URL:</span>
                      <input
                        type="text"
                        className="input-control flex-1"
                        style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}
                        placeholder="e.g. /documents/filename.pdf or external link"
                        value={res.url || ''}
                        onChange={(e) => handleResourceUrlChange(idx, e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Commit Form Bottom bar */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '1rem' }} className="flex justify-between align-center">
              <p className="text-muted text-sm">
                {isEditMode 
                  ? 'Make sure all parameters are double-checked. Updating will save changes to this product in the catalog.'
                  : 'Make sure all parameters are double-checked. Saving will append this product to the main database.'}
              </p>
              <button className="btn btn-primary flex-center" onClick={handleSaveProduct}>
                <Save size={16} /> {isEditMode ? 'Update Product Details' : 'Save Product to Catalog'}
              </button>
            </div>

          </div>
        </section>
      )}



      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
