import React, { useState, useEffect } from 'react';
import { Search, Filter, RefreshCw, ShoppingCart, Info, Grid, List } from 'lucide-react';

// Unified Custom Category SVGs to give a premium, matching, uniform style to products
export function CategoryIcon({ category, size = 48, className = "" }) {
  const color = "url(#blue-indigo-gradient)";
  
  const svgWrapper = (content) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="blue-indigo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {content}
    </svg>
  );

  switch (category) {
    case 'Audio':
      return svgWrapper(
        <>
          <rect x="8" y="12" width="48" height="40" rx="4" stroke={color} strokeWidth="3" />
          <circle cx="20" cy="32" r="6" stroke={color} strokeWidth="3" />
          <circle cx="44" cy="32" r="6" stroke={color} strokeWidth="3" />
          <line x1="26" y1="28" x2="38" y2="28" stroke={color} strokeWidth="3" />
          <line x1="26" y1="36" x2="38" y2="36" stroke={color} strokeWidth="3" />
        </>
      );
    case 'Video':
      return svgWrapper(
        <>
          <path d="M8 20C8 16.6863 10.6863 14 14 14H38C41.3137 14 44 16.6863 44 20V44C44 47.3137 41.3137 50 38 50H14C10.6863 50 8 47.3137 8 44V20Z" stroke={color} strokeWidth="3" />
          <circle cx="26" cy="32" r="8" stroke={color} strokeWidth="3" />
          <path d="M44 25L54 18V46L44 39" stroke={color} strokeWidth="3" strokeLinejoin="round" />
        </>
      );
    case 'Collaboration':
      return svgWrapper(
        <>
          <rect x="6" y="20" width="52" height="24" rx="6" stroke={color} strokeWidth="3" />
          <circle cx="18" cy="32" r="4" stroke={color} strokeWidth="3" />
          <circle cx="32" cy="32" r="5" stroke={color} strokeWidth="3" />
          <circle cx="46" cy="32" r="4" stroke={color} strokeWidth="3" />
          <line x1="12" y1="44" x2="20" y2="52" stroke={color} strokeWidth="3" />
          <line x1="52" y1="44" x2="44" y2="52" stroke={color} strokeWidth="3" />
        </>
      );
    case 'Control':
      return svgWrapper(
        <>
          <rect x="10" y="8" width="44" height="48" rx="4" stroke={color} strokeWidth="3" />
          <line x1="18" y1="48" x2="46" y2="48" stroke={color} strokeWidth="2" />
          <circle cx="32" cy="24" r="8" stroke={color} strokeWidth="3" />
          <line x1="18" y1="38" x2="46" y2="38" stroke={color} strokeWidth="2" />
          <circle cx="22" cy="43" r="2" fill={color} />
          <circle cx="32" cy="43" r="2" fill={color} />
          <circle cx="42" cy="43" r="2" fill={color} />
        </>
      );
    case 'Signal':
      return svgWrapper(
        <>
          <rect x="8" y="18" width="48" height="28" rx="4" stroke={color} strokeWidth="3" />
          <circle cx="18" cy="32" r="4" fill={color} />
          <circle cx="32" cy="32" r="4" fill={color} />
          <circle cx="46" cy="32" r="4" fill={color} />
          <path d="M12 18H52M12 46H52" stroke={color} strokeWidth="2" />
        </>
      );
    case 'Display':
    case 'Displays':
      return svgWrapper(
        <>
          <rect x="4" y="10" width="56" height="38" rx="3" stroke={color} strokeWidth="3" />
          <path d="M20 48H44" stroke={color} strokeWidth="3" />
          <path d="M32 48V56" stroke={color} strokeWidth="3" />
          <line x1="12" y1="40" x2="52" y2="40" stroke={color} strokeWidth="1.5" />
        </>
      );
    case 'Cables & Connectors':
      return svgWrapper(
        <>
          <rect x="16" y="24" width="32" height="16" rx="2" stroke={color} strokeWidth="3" />
          <line x1="8" y1="32" x2="16" y2="32" stroke={color} strokeWidth="3" />
          <line x1="48" y1="32" x2="56" y2="32" stroke={color} strokeWidth="3" />
          <line x1="24" y1="24" x2="24" y2="16" stroke={color} strokeWidth="2" />
          <line x1="40" y1="24" x2="40" y2="16" stroke={color} strokeWidth="2" />
        </>
      );
    case 'Headphone':
      return svgWrapper(
        <>
          <path d="M12 36C12 22.7452 20.9543 12 32 12C43.0457 12 52 22.7452 52 36" stroke={color} strokeWidth="3" strokeLinecap="round" />
          <rect x="8" y="32" width="8" height="16" rx="2" stroke={color} strokeWidth="3" />
          <rect x="48" y="32" width="8" height="16" rx="2" stroke={color} strokeWidth="3" />
        </>
      );
    case 'Wireless Presentation':
      return svgWrapper(
        <>
          <circle cx="32" cy="32" r="22" stroke={color} strokeWidth="3" />
          <circle cx="32" cy="32" r="10" stroke={color} strokeWidth="3" />
          <path d="M32 10V22M32 42V54M10 32H22M42 32H54" stroke={color} strokeWidth="2" />
        </>
      );
    case 'Camera':
      return svgWrapper(
        <>
          <rect x="4" y="24" width="56" height="16" rx="4" stroke={color} strokeWidth="3" />
          <circle cx="32" cy="32" r="5" stroke={color} strokeWidth="3" />
          <circle cx="32" cy="32" r="1.5" fill={color} />
          <line x1="10" y1="32" x2="18" y2="32" stroke={color} strokeWidth="2" strokeDasharray="2 2" />
          <line x1="46" y1="32" x2="54" y2="32" stroke={color} strokeWidth="2" strokeDasharray="2 2" />
          <path d="M24 40L20 48H44L40 40" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        </>
      );
    default:
      return svgWrapper(
        <>
          <rect x="12" y="12" width="40" height="40" rx="4" stroke={color} strokeWidth="3" />
          <circle cx="32" cy="32" r="8" stroke={color} strokeWidth="3" />
        </>
      );
  }
}

export default function Catalog({ 
  activePage, 
  setActivePage, 
  setSelectedProductId, 
  onAddToQuote,
  initialCategory,
  setInitialCategory
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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

  // Fetch products from backend
  useEffect(() => {
    fetchProducts();
  }, [activePage]); // Refresh when page changes (e.g. from admin)

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategories([initialCategory]);
      if (setInitialCategory) setInitialCategory(null);
    }
  }, [initialCategory, setInitialCategory]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to load products');
      const data = await res.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve the product catalog. Ensure the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Filter Logic
  const handleBrandChange = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
    setCurrentPage(1);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedBrands([]);
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  // Filter computation
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.subCategory || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);

    return matchesSearch && matchesBrand && matchesCategory;
  });

  // Pagination computation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToDetails = (id) => {
    setSelectedProductId(id);
    setActivePage('product-detail');
  };

  return (
    <div className="container py-half animate-fade">
      <div className="flex justify-between align-center mb-6">
        <div>
          <span className="badge badge-brand">Catalog</span>
          <h1 className="text-3xl mt-2">Equipment Portfolio</h1>
          <p className="text-muted text-sm">Explore and query our active inventory of {products.length} AV products.</p>
        </div>
        <button className="btn btn-secondary flex-center btn-sm" onClick={fetchProducts} title="Reload Catalog">
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          padding: '1rem',
          marginBottom: '2rem',
          color: '#f87171'
        }}>
          {error}
        </div>
      )}

      <div className="catalog-layout">
        {/* Sidebar Filters */}
        <aside className="sidebar-filters glass-panel" style={{ height: 'fit-content' }}>
          <div className="flex justify-between align-center mb-4">
            <span style={{ fontFamily: 'var(--font-header)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} /> Filters
            </span>
            {(searchTerm || selectedBrands.length > 0 || selectedCategories.length > 0) && (
              <button 
                onClick={handleResetFilters} 
                style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-header)' }}
              >
                Reset All
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="form-group">
            <label className="form-label">Search Query</label>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="input-control"
                style={{ paddingLeft: '2.25rem', width: '100%' }}
                placeholder="Product name, SKU..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              />
            </div>
          </div>

          {/* Brands Accordion / Checkboxes */}
          <div className="mb-6">
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Manufacturer</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto', paddingRight: '4px' }}>
              {brands.map(b => (
                <label key={b} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedBrands.includes(b)}
                    onChange={() => handleBrandChange(b)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>{b}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories Checkboxes */}
          <div>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {categories.map(c => (
                <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(c)}
                    onChange={() => handleCategoryChange(c)}
                    style={{ accentColor: 'var(--color-primary)' }}
                  />
                  <span>{c}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div style={{ flex: 1 }}>
          {loading ? (
            <div className="flex-center flex-col glass-panel" style={{ height: '300px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTopColor: 'var(--color-primary)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginBottom: '1rem'
              }} />
              <p className="text-muted">Loading equipment database...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="glass-panel text-center flex-center flex-col" style={{ padding: '4rem 2rem' }}>
              <Info size={40} className="text-muted" style={{ marginBottom: '1rem' }} />
              <h3>No matching products found</h3>
              <p className="text-muted text-sm mt-2" style={{ maxWidth: '400px' }}>
                We couldn't find any products matching your search criteria. Try modifying your filters or searching for another keyword.
              </p>
              <button className="btn btn-secondary mt-4 btn-sm" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {/* Product Card Grid */}
              <div className="catalog-grid">
                {paginatedProducts.map(product => (
                  <div key={product.id} className="glass-panel card-glowing flex flex-col justify-between" style={{ padding: '1.25rem', height: '100%' }}>
                    
                    {/* Visual Product Box - Uniform Design */}
                    <div 
                      onClick={() => navigateToDetails(product.id)}
                      style={{
                        background: product.image ? '#ffffff' : 'rgba(0,0,0,0.3)',
                        borderRadius: '8px',
                        padding: product.image ? '0.25rem' : '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '1rem',
                        border: '1px solid rgba(255,255,255,0.03)',
                        cursor: 'pointer',
                        transition: 'background var(--transition-fast)',
                        height: '140px',
                        overflow: 'hidden'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = product.image ? '#f9fafb' : 'rgba(0,0,0,0.45)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = product.image ? '#ffffff' : 'rgba(0,0,0,0.3)'}
                    >
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }} 
                        />
                      ) : (
                        <CategoryIcon category={product.category} size={64} />
                      )}
                    </div>

                    {/* Metadata */}
                    <div style={{ flex: 1 }}>
                      <div className="flex justify-between align-center mb-2">
                        <span className="badge" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>{product.brand}</span>
                        <span className="badge badge-brand" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                          {product.category} {product.subCategory ? `> ${product.subCategory}` : ''}
                        </span>
                      </div>
                      <h3 
                        onClick={() => navigateToDetails(product.id)}
                        className="text-md" 
                        style={{
                          margin: '0.5rem 0 0.25rem 0',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          height: '2.8rem',
                          lineHeight: 1.4
                        }}
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      <p className="text-muted" style={{ fontSize: '0.75rem', fontFamily: 'monospace', marginBottom: '0.75rem' }}>
                        SKU: {product.sku}
                      </p>
                      <p className="text-muted" style={{
                        fontSize: '0.8rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        marginBottom: '1rem',
                        lineHeight: 1.5,
                        height: '3.6rem'
                      }}>
                        {product.description}
                      </p>
                    </div>

                    {/* Price & Actions */}
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
                      <div className="flex justify-between align-center mb-2">
                        <span className="text-muted" style={{ fontSize: '0.75rem' }}>Est. Price Range</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e5e7eb' }}>{product.priceRange}</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="btn btn-secondary btn-sm flex-1" 
                          onClick={() => navigateToDetails(product.id)}
                          style={{ padding: '0.4rem 0' }}
                        >
                          Details
                        </button>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => onAddToQuote(product)}
                          title="Add to Quote"
                          style={{ padding: '0.4rem 0.6rem' }}
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    className="page-btn" 
                    onClick={() => handlePageChange(currentPage - 1)} 
                    disabled={currentPage === 1}
                  >
                    &lt;
                  </button>
                  {[...Array(totalPages)].map((_, idx) => {
                    const pageNum = idx + 1;
                    // Render limited pages (e.g. current, first, last, and surrounding)
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      Math.abs(pageNum - currentPage) <= 1
                    ) {
                      return (
                        <button 
                          key={pageNum} 
                          className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (
                      pageNum === 2 ||
                      pageNum === totalPages - 1
                    ) {
                      return <span key={pageNum} style={{ color: 'var(--text-muted)' }}>...</span>;
                    }
                    return null;
                  })}
                  <button 
                    className="page-btn" 
                    onClick={() => handlePageChange(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
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
