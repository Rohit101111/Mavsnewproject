import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Download, CheckCircle, FileText, Settings, Layers, Box } from 'lucide-react';
import { CategoryIcon } from './Catalog.jsx';

export default function ProductDetail({ productId, setActivePage, onAddToQuote }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [activeMedia, setActiveMedia] = useState('image'); // 'image' or 'video'

  useEffect(() => {
    if (!productId) return;

    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://mavsnewproject.onrender.com/api/products/${productId}`);
        if (!res.ok) throw new Error('Product not found');
        const data = await res.json();
        setProduct(data);
        setActiveImage(data.image || '');
        setActiveMedia('image');
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Failed to load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="container flex-center" style={{ minHeight: '400px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid rgba(255,255,255,0.1)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container py-section text-center">
        <h2 className="text-2xl text-gradient mb-4">Error loading product details</h2>
        <p className="text-muted mb-6">{error || 'The requested product could not be located.'}</p>
        <button className="btn btn-secondary flex-center" style={{ margin: '0 auto' }} onClick={() => setActivePage('catalog')}>
          <ArrowLeft size={16} /> Return to Catalog
        </button>
      </div>
    );
  }

  const handleDownload = (resource) => {
    if (resource && resource.url) {
      // Open the document URL in a new tab
      window.open(resource.url, '_blank');
    } else {
      alert(`Starting download for: "${resource?.name || 'resource'}" (Mock download)`);
    }
  };

  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const isVideoFile = (url) => {
    if (!url) return false;
    const lowerUrl = url.toLowerCase();
    return lowerUrl.endsWith('.mp4') || 
           lowerUrl.endsWith('.webm') || 
           lowerUrl.endsWith('.ogg') || 
           (lowerUrl.includes('/videos/') && !lowerUrl.endsWith('.pdf')) ||
           (lowerUrl.includes('/documents/') && (lowerUrl.endsWith('.mp4') || lowerUrl.endsWith('.webm') || lowerUrl.endsWith('.ogg')));
  };

  const youtubeId = getYoutubeId(product?.youtubeUrl);
  const isLocalVideo = isVideoFile(product?.youtubeUrl);
  const hasVideo = youtubeId || isLocalVideo;

  const allImages = product?.images && product.images.length > 0 
    ? product.images 
    : (product?.image ? [product.image] : []);

  const normalizedFeatures = (product.features || [])
    .map((feat, idx) => {
      if (typeof feat === 'string') {
        const cleaned = feat.replace(/^[•\s\-\*]+\s*/, '');
        return {
          title: `Feature Capability #${idx + 1}`,
          description: cleaned,
          image: ''
        };
      }
      const descCleaned = (feat.description || '').replace(/^[•\s\-\*]+\s*/, '');
      return {
        ...feat,
        description: descCleaned
      };
    })
    .filter(feat => feat.title?.trim() || feat.description?.trim());

  const displayHighlights = (() => {
    if (product.highlights && Array.isArray(product.highlights) && product.highlights.length > 0) {
      return product.highlights.map(item => item.replace(/^[•\s\-\*]+\s*/, ''));
    }
    if (product.features && Array.isArray(product.features) && product.features.length > 0) {
      if (typeof product.features[0] === 'string') {
        return product.features.map(item => item.replace(/^[•\s\-\*]+\s*/, ''));
      }
      return normalizedFeatures.slice(0, 3).map(feat => feat.description);
    }
    return [];
  })();

  return (
    <div className="container py-half animate-fade">
      {/* Navigation & Back Button */}
      <div className="mb-6 flex justify-between align-center">
        <button 
          className="btn btn-secondary flex-center btn-sm" 
          onClick={() => setActivePage('catalog')}
          style={{ background: 'transparent', border: 'none', paddingLeft: 0 }}
        >
          <ArrowLeft size={16} /> Back to Catalog
        </button>

        <button 
          className="btn btn-secondary flex-center btn-sm"
          onClick={() => setActivePage('admin')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Settings size={14} /> Edit Product
        </button>
      </div>

      {/* WyreStorm-style Product Hero Section */}
      <section className="glass-panel" style={{
        padding: '2.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.7) 0%, rgba(13, 18, 34, 0.7) 100%)',
        borderColor: 'rgba(99, 102, 241, 0.15)'
      }}>
        <div className="grid-cols-2">
          {/* Product Image Section */}
          <div>
            {/* Main Active Media Frame */}
            <div className="flex-center flex-col" style={{
              background: activeMedia === 'video' ? '#000000' : (activeImage ? '#ffffff' : 'rgba(0, 0, 0, 0.4)'),
              borderRadius: '16px',
              border: activeImage ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--border-color)',
              padding: activeMedia === 'video' ? '0' : (activeImage ? '1rem' : '2rem 1.5rem'),
              height: '340px',
              position: 'relative',
              boxShadow: activeImage ? '0 10px 25px -5px rgba(0, 0, 0, 0.3)' : 'inset 0 0 20px rgba(0,0,0,0.6)',
              overflow: 'hidden',
              width: '100%'
            }}>
              {activeMedia === 'video' && hasVideo ? (
                isLocalVideo ? (
                  <video
                    src={product.youtubeUrl}
                    controls
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '16px',
                      objectFit: 'contain',
                      background: '#000000',
                      border: 'none'
                    }}
                  />
                ) : (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&loop=1&playlist=${youtubeId}&rel=0&modestbranding=1&iv_load_policy=3`}
                    title="Product Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ borderRadius: '16px', border: 'none' }}
                  />
                )
              ) : activeImage ? (
                <img 
                  src={activeImage} 
                  alt={product.name} 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '100%',
                    objectFit: 'contain',
                    borderRadius: '8px',
                    transition: 'opacity 0.2s ease-in-out'
                  }} 
                />
              ) : (
                <CategoryIcon category={product.category} size={160} />
              )}
            </div>

            {/* Gallery Thumbnail Row */}
            {(allImages.length > 1 || youtubeId) && (
              <div style={{
                display: 'flex',
                gap: '0.65rem',
                marginTop: '1rem',
                justifyContent: 'center',
                width: '100%',
                flexWrap: 'wrap',
                background: 'rgba(255, 255, 255, 0.01)',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.03)'
              }}>
                {allImages.map((img, idx) => (
                  <div 
                    key={idx}
                    onClick={() => {
                      setActiveImage(img);
                      setActiveMedia('image');
                    }}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '6px',
                      border: (activeMedia === 'image' && activeImage === img) ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      background: '#ffffff',
                      padding: '2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      boxShadow: (activeMedia === 'image' && activeImage === img) ? '0 0 8px rgba(225,90,69,0.15)' : 'none'
                    }}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                ))}

                {/* Product Video Tab */}
                {hasVideo && (
                  <div 
                    onClick={() => {
                      setActiveMedia('video');
                    }}
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '6px',
                      border: activeMedia === 'video' ? '2px solid var(--color-primary)' : '1px solid var(--border-color)',
                      background: 'radial-gradient(circle, #f00 0%, #a00 100%)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden',
                      transition: 'all 0.2s ease',
                      boxShadow: activeMedia === 'video' ? '0 0 8px rgba(225,90,69,0.15)' : 'none',
                      position: 'relative'
                    }}
                    title="Watch Product Video"
                  >
                    <div style={{
                      width: '24px',
                      height: '18px',
                      backgroundColor: '#ffffff',
                      borderRadius: '4px',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <div style={{
                        width: 0,
                        height: 0,
                        borderTop: '4px solid transparent',
                        borderBottom: '4px solid transparent',
                        borderLeft: '7px solid #f00',
                        marginLeft: '2px'
                      }} />
                    </div>
                    <span style={{ fontSize: '0.55rem', fontWeight: 'bold', color: '#ffffff', marginTop: '2px', letterSpacing: '0.02em' }}>
                      VIDEO
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Product Details Panel */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="text-muted uppercase text-sm" style={{ letterSpacing: '0.15em', fontWeight: 600, color: 'var(--color-primary)' }}>
                {product.brand} Systems &bull; {product.category} {product.subCategory ? `> ${product.subCategory}` : ''}
              </span>
              
              <h1 className="text-3xl mt-1 mb-2" style={{ fontWeight: 800, lineHeight: 1.2 }}>
                {product.name}
              </h1>
              
              <p className="text-muted" style={{ fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                SKU: <span style={{ color: '#e5e7eb' }}>{product.sku}</span>
              </p>

              <div style={{
                background: 'rgba(0,0,0,0.15)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '1.25rem',
                marginBottom: '1.5rem'
              }}>
                <h3 className="text-sm uppercase text-muted mb-2" style={{ letterSpacing: '0.05em' }}>Key Highlights</h3>
                {displayHighlights.length > 0 ? (
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none' }}>
                    {displayHighlights.map((hl, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8rem' }}>
                        <CheckCircle size={14} style={{ color: 'var(--color-primary)', marginTop: '1px', flexShrink: 0 }} />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted text-sm">No highlights specified for this product.</p>
                )}
              </div>
            </div>

            {/* Actions Panel */}
            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
              <div className="flex gap-3">
                <button className="btn btn-primary flex-1" onClick={() => onAddToQuote(product)}>
                  <ShoppingCart size={18} /> Add to Quote Cart
                </button>
                <button 
                  className="btn btn-secondary flex-center" 
                  onClick={() => {
                    if (product.resources && product.resources.length > 0) {
                      handleDownload(product.resources[0]);
                    } else {
                      alert('No datasheet resource available for this product.');
                    }
                  }} 
                  title="Download Datasheet"
                  style={{ gap: '0.4rem', padding: '0.75rem 1.25rem' }}
                >
                  <Download size={18} /> Datasheet
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs / Detailed Specs Sections */}
      <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 className="text-xl mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <FileText size={20} className="text-primary-gradient" /> Product Overview
        </h2>
        <p className="text-muted" style={{ lineHeight: 1.7, fontSize: '0.95rem' }}>
          {product.description}
        </p>
      </section>

      {/* Features Section - Alternating Left/Right Image-Description Redesign */}
      <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 className="text-xl mb-6" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <Settings size={20} className="text-primary-gradient" /> Key Features & Capabilities
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {normalizedFeatures.map((feat, idx) => (
            <div key={idx} className={`feature-card ${idx % 2 === 0 ? 'feature-card-even' : 'feature-card-odd'}`}>
              {/* Feature Image Frame */}
              <div className="feature-card-image-frame" style={{
                background: feat.image ? '#ffffff' : '#070a13',
                padding: feat.image ? '0.5rem' : '0'
              }}>
                {feat.image ? (
                  <img src={feat.image} alt={feat.title} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                ) : (
                  <div className="flex-center flex-col" style={{ opacity: 0.3 }}>
                    <Settings size={40} className="text-muted" />
                    <span style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>No Visual Image</span>
                  </div>
                )}
              </div>

              {/* Feature Description Panel */}
              <div className="feature-card-content">
                <h4 className="text-lg" style={{ fontWeight: 700, color: '#ffffff' }}>
                  {feat.title || `Feature Spec #${idx + 1}`}
                </h4>
                <p className="text-muted text-sm" style={{ lineHeight: 1.6 }}>
                  {feat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>


      {/* Specifications Table */}
      <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 className="text-xl mb-6" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
          <Layers size={20} className="text-primary-gradient" /> Technical Specifications
        </h2>
        
        <div style={{
          overflowX: 'auto',
          border: '1px solid var(--border-color)',
          borderRadius: '8px'
        }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.9rem'
          }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>Parameter</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>Value / Detailing</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(product.specifications || {}).map(([key, val], idx) => (
                <tr key={key} style={{
                  borderBottom: idx === Object.entries(product.specifications).length - 1 ? 'none' : '1px solid var(--border-color)',
                  background: idx % 2 === 0 ? 'rgba(0,0,0,0.1)' : 'transparent'
                }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500, width: '35%', color: '#e5e7eb' }}>{key}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-muted)' }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* In the Box & Resources Section */}
      <div className="grid-cols-2">
        {/* In the box */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h2 className="text-xl mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Box size={20} className="text-primary-gradient" /> In the Box
          </h2>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', listStyle: 'none' }}>
            {(product.inTheBox || []).map((item, idx) => (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <div style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  background: 'var(--color-primary)',
                  flexShrink: 0
                }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Resources */}
        <section className="glass-panel" style={{ padding: '2rem' }}>
          <h2 className="text-xl mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
            <Download size={20} className="text-primary-gradient" /> Documentation & Downloads
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {product.resources && product.resources.length > 0 ? (
              product.resources.map((res, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleDownload(res)}
                  style={{
                    display: 'flex',
                    justifyContent: 'between',
                    alignItems: 'center',
                    padding: '0.75rem 1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    background: 'rgba(255,255,255,0.01)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--color-primary)';
                    e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.01)';
                  }}
                >
                  <div className="flex align-center gap-2" style={{ flex: 1 }}>
                    <FileText size={18} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{res.name}</span>
                  </div>
                  <span className="badge" style={{ fontSize: '0.65rem' }}>{res.type}</span>
                </div>
              ))
            ) : (
              <p className="text-muted text-sm">No documentation or resources available for this product.</p>
            )}
          </div>
        </section>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
