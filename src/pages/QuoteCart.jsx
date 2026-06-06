import React, { useState } from 'react';
import { ShoppingCart, Trash2, Mail, Phone, MapPin, Send, HelpCircle, FileText } from 'lucide-react';
import { CategoryIcon } from './Catalog.jsx';

export default function QuoteCart({ cart, setCart, setActivePage }) {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    requireInstallation: true,
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [quoteNumber, setQuoteNumber] = useState('');

  const updateQuantity = (productId, newQty) => {
    if (newQty < 1) return;
    setCart(prev => prev.map(item => 
      item.id === productId ? { ...item, quantity: newQty } : item
    ));
  };

  const removeItem = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Generate random quote tracking number
    const qNum = `MAVS-2026-${Math.floor(100000 + Math.random() * 900000)}`;
    setQuoteNumber(qNum);
    setSubmitted(true);
    setCart([]); // Clear cart
  };

  if (submitted) {
    return (
      <div className="container py-section animate-fade">
        <div className="glass-panel text-center" style={{ maxWidth: '600px', margin: '0 auto', padding: '3rem 2rem', borderColor: 'rgba(52, 211, 153, 0.25)' }}>
          <div className="flex-center" style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#34d399',
            margin: '0 auto 1.5rem auto'
          }}>
            <Send size={28} />
          </div>
          
          <span className="badge badge-success mb-2">Quote Request Submitted</span>
          <h2 className="text-2xl mb-2">Thank You, {formData.name}!</h2>
          <p className="text-muted text-sm mb-6">
            Your inquiry has been successfully logged. An AV systems engineer will review your hardware requirements and follow up with a proposal.
          </p>

          <div style={{
            background: 'rgba(0,0,0,0.25)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            padding: '1.25rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <div className="flex justify-between mb-2">
              <span className="text-muted text-sm">Quote Reference Number:</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--color-primary)' }}>{quoteNumber}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-muted text-sm">Contact Email:</span>
              <span style={{ fontSize: '0.85rem' }}>{formData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted text-sm">Design & Installation:</span>
              <span style={{ fontSize: '0.85rem', color: formData.requireInstallation ? '#34d399' : '#9ca3af' }}>
                {formData.requireInstallation ? 'Requested' : 'Hardware Only'}
              </span>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button className="btn btn-primary" onClick={() => setActivePage('catalog')}>
              Return to Catalog
            </button>
            <button className="btn btn-secondary" onClick={() => setActivePage('home')}>
              Home Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-half animate-fade">
      <div className="mb-6">
        <span className="badge badge-brand">Quote Requests</span>
        <h1 className="text-3xl mt-2">Quote Request Form</h1>
        <p className="text-muted text-sm">Verify your selected hardware components and submit details for a specialized commercial integration proposal.</p>
      </div>

      {cart.length === 0 ? (
        <div className="glass-panel text-center" style={{ padding: '4rem 2rem' }}>
          <ShoppingCart size={48} className="text-muted" style={{ margin: '0 auto 1.5rem auto' }} />
          <h3>Your Quote Cart is Empty</h3>
          <p className="text-muted text-sm mt-2" style={{ maxWidth: '400px', margin: '0.5rem auto 1.5rem auto' }}>
            Browse through our catalog of 600+ leading industry products and click the shopping cart icon to add items to your design.
          </p>
          <button className="btn btn-primary btn-sm" onClick={() => setActivePage('catalog')}>
            Explore Product Catalog
          </button>
        </div>
      ) : (
        <div className="catalog-layout">
          {/* Cart items list */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h2 className="text-lg mb-2">Selected Hardware ({cart.length} Items)</h2>
            {cart.map(item => (
              <div key={item.id} className="glass-panel flex align-center justify-between" style={{ padding: '1rem' }}>
                <div className="flex align-center gap-3">
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                    <CategoryIcon category={item.category} size={48} />
                  </div>
                  <div>
                    <div className="flex align-center gap-2 mb-1">
                      <span className="badge" style={{ fontSize: '0.6rem', padding: '0.05rem 0.3rem' }}>{item.brand}</span>
                      <span className="badge badge-brand" style={{ fontSize: '0.6rem', padding: '0.05rem 0.3rem' }}>{item.category}</span>
                    </div>
                    <h3 className="text-md" style={{ fontWeight: 700 }}>{item.name}</h3>
                    <p className="text-muted text-xs" style={{ fontFamily: 'monospace' }}>SKU: {item.sku}</p>
                  </div>
                </div>

                <div className="flex align-center gap-4">
                  {/* Quantity Controller */}
                  <div className="flex align-center gap-2" style={{ background: 'rgba(0,0,0,0.2)', padding: '0.25rem 0.5rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                    <button 
                      style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1rem', cursor: 'pointer', padding: '0 0.25rem' }}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, width: '24px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button 
                      style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1rem', cursor: 'pointer', padding: '0 0.25rem' }}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button className="btn btn-danger btn-sm" onClick={() => removeItem(item.id)} style={{ padding: '0.5rem' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Checkout Quote Form */}
          <aside className="sidebar-filters flex flex-col gap-6" style={{ width: '380px' }}>
            <div className="glass-panel">
              <h2 className="text-lg mb-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} className="text-primary-gradient" /> Proposal Request
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Contact Name</label>
                  <input
                    type="text"
                    required
                    name="name"
                    className="input-control"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Company Name</label>
                  <input
                    type="text"
                    required
                    name="company"
                    className="input-control"
                    placeholder="e.g. Acme Tech Solutions"
                    value={formData.company}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    className="input-control"
                    placeholder="e.g. +91 99999 99999"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    name="email"
                    className="input-control"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '0.5rem', margin: '1rem 0' }}>
                  <input
                    type="checkbox"
                    id="requireInstallation"
                    name="requireInstallation"
                    checked={formData.requireInstallation}
                    onChange={handleInputChange}
                    style={{ width: '16px', height: '16px', accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                  />
                  <label htmlFor="requireInstallation" style={{ fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer' }}>
                    Require MAVS installation services
                  </label>
                </div>

                <div className="form-group">
                  <label className="form-label">Project Details / Scope</label>
                  <textarea
                    name="notes"
                    className="input-control"
                    style={{ minHeight: '140px', fontSize: '0.85rem' }}
                    placeholder="Mention room sizes, timelines, cabling requirements..."
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                  Submit Proposal Inquiry
                </button>
              </form>
            </div>

            {/* Support Info Side Card */}
            <div className="glass-panel" style={{ background: 'rgba(255,255,255,0.01)' }}>
              <h3 className="text-md mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HelpCircle size={16} style={{ color: 'var(--color-primary)' }} /> Need Engineering Advice?
              </h3>
              <p className="text-muted text-xs mb-4">
                If you are unsure of quantities or signal compatibility, reach our Pune main office directly:
              </p>
              
              <div className="flex flex-col gap-3" style={{ fontSize: '0.8rem' }}>
                <div className="flex align-center gap-2">
                  <Phone size={14} style={{ color: 'var(--color-primary)' }} />
                  <span className="text-muted">+91 98902 02233</span>
                </div>
                <div className="flex align-center gap-2">
                  <Mail size={14} style={{ color: 'var(--color-primary)' }} />
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span className="text-muted">Sales1@mahaviravsolutions.in</span>
                    <span className="text-muted">Sushil@mahaviravsolutions.in</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <MapPin size={14} style={{ color: 'var(--color-primary)', flexShrink: 0 }} />
                  <span className="text-muted" style={{ lineHeight: 1.3 }}>
                    Plot-10, Parshwanath Nagar, Bibwewadi, Pune
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
