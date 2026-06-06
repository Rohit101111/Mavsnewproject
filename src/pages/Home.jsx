import React from 'react';
import { Shield, Cpu, RefreshCw, Phone, MapPin, Mail, Award, Clock, Monitor, Building2, Server, HeartPulse } from 'lucide-react';

export default function Home({ setActivePage }) {
  const sectors = [
    {
      title: 'Corporate Enterprises',
      desc: 'Seamless Microsoft Teams and Zoom rooms, dynamic scheduling touch panels, interactive presentation spaces, and large-scale boardroom video walls.',
      icon: <Cpu size={24} className="text-primary-gradient" />,
      image: '/images/corporate.png'
    },
    {
      title: 'Education & Training',
      desc: 'Next-generation smart classrooms featuring interactive touchscreen boards, distance learning PTZ setups, and lecture hall sound reinforcement systems.',
      icon: <Award size={24} style={{ color: 'var(--color-accent)' }} />,
      image: '/images/education.png'
    },
    {
      title: 'Hospitality & Venues',
      desc: 'Distributed background audio, ambient speaker networks, and vibrant commercial menu/digital signage displays for hotels, lounges, and event spaces.',
      icon: <Clock size={24} style={{ color: 'var(--color-secondary)' }} />,
      image: '/images/hospitality.png'
    },
    {
      title: 'Command & Control Centers',
      desc: 'High-reliability operator console workstations, multi-source video wall processing, 24/7 mission-critical visualizations, and secure KVM matrix integrations.',
      icon: <Server size={24} style={{ color: 'var(--color-primary)' }} />,
      image: '/images/command_control.jpg'
    },
    {
      title: 'Experience Centers',
      desc: 'Immersive audio-visual showcases, active simulation zones, interactive retail displays, and experiential museum gallery audio systems.',
      icon: <Monitor size={24} style={{ color: 'var(--color-blue)' }} />,
      image: '/images/experience.jpg'
    },
    {
      title: 'Government & Public Sector',
      desc: 'High-security command centers, municipal boardrooms, emergency response operations rooms, and digital courtroom recording systems.',
      icon: <Building2 size={24} style={{ color: 'var(--color-primary)' }} />,
      image: '/images/government.jpg'
    },
    {
      title: 'Healthcare Facilities',
      desc: 'Integrated clinical technologies, specialized operating room video routing, digital patient wayfinding boards, and smart queue management solutions.',
      icon: <HeartPulse size={24} style={{ color: 'var(--color-accent)' }} />,
      image: '/images/healthcare.png'
    }
  ];

  const brands = [
    { name: 'Poly', desc: 'Unified Video & Audio Bar' },
    { name: 'Logitech', desc: 'Conference Cams & Controllers' },
    { name: 'Yealink', desc: 'Smart Meeting Solutions' },
    { name: 'LG Commercial Display', desc: 'Professional Digital Signage' },
    { name: 'Newline Display', desc: 'Interactive Touch Screens' },
    { name: 'Kramer', desc: 'Advanced Signal Management' },
    { name: 'QSC', desc: 'Q-SYS Audio Processing' },
    { name: 'Barco', desc: 'Wireless Screen Presentation' }
  ];

  return (
    <div className="animate-fade">
      {/* Hero Section with Cinematic Background Loop */}
      <section style={{
        padding: '8rem 0 6rem 0',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(11, 15, 25, 0.2)'
      }}>
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          preload="auto"
          poster="/images/hero-poster.png"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -2,
            opacity: 0.45,
            pointerEvents: 'none'
          }}
        >
          <source 
            src="/videos/hero-background-avispl.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>

        {/* Gradient dark overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to bottom, rgba(11, 15, 25, 0.1) 0%, rgba(11, 15, 25, 0.5) 60%, #0b0f19 100%)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        {/* Background glow orb */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(225, 90, 69, 0.1) 0%, transparent 70%)',
          zIndex: -1,
          pointerEvents: 'none'
        }} />

        <div className="container text-center" style={{ position: 'relative', zIndex: 1 }}>
          <span className="badge badge-brand mb-4">Enterprise AV Integrator</span>
          <h1 className="text-gradient" style={{
            fontSize: '3.5rem',
            lineHeight: 1.15,
            fontWeight: 800,
            marginBottom: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto 1.5rem auto',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.7)'
          }}>
            Next-Generation Audio Visual Systems & Integration
          </h1>
          <p className="text-muted text-lg" style={{
            maxWidth: '700px',
            margin: '0 auto 2.5rem auto',
            fontWeight: 400,
            color: '#e2e8f0',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
          }}>
            Mahavir AV Solutions designs, installs, and manages state-of-the-art visual collaboration systems, sound reinforcement, and smart control networks across India.
          </p>
          <div className="flex-center gap-3 flex-wrap">
            <button className="btn btn-primary" onClick={() => setActivePage('catalog')}>
              Explore 600+ Products
            </button>
            <button className="btn btn-secondary" onClick={() => setActivePage('quote-cart')}>
              Request Custom Quote
            </button>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section style={{ background: 'rgba(255,255,255,0.01)', borderY: '1px solid var(--border-color)', padding: '2.5rem 0' }}>
        <div className="container grid-cols-4 text-center">
          <div>
            <h2 className="text-3xl text-gradient font-bold">100+</h2>
            <p className="text-muted text-sm uppercase" style={{ letterSpacing: '0.1em', marginTop: '4px' }}>Projects Delivered</p>
          </div>
          <div>
            <h2 className="text-3xl text-gradient font-bold">8+</h2>
            <p className="text-muted text-sm uppercase" style={{ letterSpacing: '0.1em', marginTop: '4px' }}>Global Brands Supported</p>
          </div>
          <div>
            <h2 className="text-3xl text-gradient font-bold">10+</h2>
            <p className="text-muted text-sm uppercase" style={{ letterSpacing: '0.1em', marginTop: '4px' }}>Years AV Experience</p>
          </div>
          <div>
            <h2 className="text-3xl text-gradient font-bold">100%</h2>
            <p className="text-muted text-sm uppercase" style={{ letterSpacing: '0.1em', marginTop: '4px' }}>Custom Design Solutions</p>
          </div>
        </div>
      </section>

      {/* Sectors Section */}
      <section className="py-section">
        <div className="container">
          <div className="text-center mb-8">
            <span className="badge badge-brand mb-2">Our Solutions</span>
            <h2>Environments We Transform</h2>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '0.5rem auto' }}>
              We deliver custom-architected hardware systems engineered for the specific requirements of each environment.
            </p>
          </div>

          <div className="grid-cols-3" style={{ gap: '2rem' }}>
            {sectors.map((sec, idx) => (
              <div key={idx} className="glass-panel card-glowing" style={{
                padding: 0,
                overflow: 'hidden',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}>
                {/* Visual Header */}
                <div style={{
                  position: 'relative',
                  height: '200px',
                  width: '100%',
                  overflow: 'hidden'
                }}>
                  <img 
                    src={sec.image} 
                    alt={sec.title} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    className="sector-card-image"
                  />
                  {/* Subtle dark gradient overlay on image */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(to bottom, rgba(11, 15, 25, 0.1) 0%, rgba(11, 15, 25, 0.8) 100%)',
                    pointerEvents: 'none'
                  }} />
                  {/* Floating Icon Badge */}
                  <div style={{
                    position: 'absolute',
                    bottom: '15px',
                    left: '20px',
                    background: 'rgba(11, 15, 25, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    width: '44px',
                    height: '44px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                  }}>
                    {sec.icon}
                  </div>
                </div>

                {/* Card Body */}
                <div style={{ padding: '1.5rem 1.75rem 1.75rem 1.75rem', flexGrow: 1 }}>
                  <h3 className="text-xl mb-2" style={{ fontWeight: 700 }}>{sec.title}</h3>
                  <p className="text-muted text-sm" style={{ lineHeight: '1.6' }}>{sec.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="container">
          <div className="text-center mb-8">
            <span className="badge badge-brand mb-2">Portfolio</span>
            <h2>Certified Brands We Integrate</h2>
            <p className="text-muted" style={{ maxWidth: '600px', margin: '0.5rem auto' }}>
              We collaborate with world-leading hardware manufacturers to construct optimal, durable enterprise configurations.
            </p>
          </div>

          <div className="grid-cols-4">
            {brands.map((b, idx) => (
              <div key={idx} className="glass-panel text-center" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <h3 className="text-lg text-primary-gradient mb-2" style={{ fontWeight: 800 }}>{b.name}</h3>
                <p className="text-muted text-sm">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-section">
        <div className="container">
          <div className="glass-panel" style={{
            background: 'linear-gradient(135deg, rgba(13, 18, 34, 0.9) 0%, rgba(7, 10, 19, 0.9) 100%)',
            border: '1px solid rgba(99, 102, 241, 0.25)',
            boxShadow: '0 0 40px rgba(99, 102, 241, 0.1)'
          }}>
            <div className="grid-cols-2">
              <div style={{ padding: '1rem' }}>
                <span className="badge badge-brand mb-2">Get in Touch</span>
                <h2 className="text-3xl mb-4">Start Your AV Transformation</h2>
                <p className="text-muted mb-6">
                  Have an integration project in mind? Contact our sales engineering team in Pune today to schedule a walkthrough or request technical recommendations.
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex align-center gap-3">
                    <MapPin size={20} style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <p className="text-bold text-sm">Office Address</p>
                      <p className="text-muted text-sm">Plot-10, 2nd Floor, Parshwanath Nagar, Bibwewadi, Opp Post Office, Pune - 411037</p>
                    </div>
                  </div>

                  <div className="flex align-center gap-3">
                    <Phone size={20} style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <p className="text-bold text-sm">Phone Line</p>
                      <p className="text-muted text-sm">+91 98902 02233</p>
                    </div>
                  </div>

                  <div className="flex align-center gap-3">
                    <Mail size={20} style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <p className="text-bold text-sm">Sales & Support</p>
                      <p className="text-muted text-sm" style={{ display: 'flex', flexDirection: 'column' }}>
                        <span>Sales1@mahaviravsolutions.in</span>
                        <span>Sushil@mahaviravsolutions.in</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form panel */}
              <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '2rem' }}>
                <h3 className="text-lg mb-4">Quick Technical Inquiry</h3>
                <form onSubmit={(e) => { e.preventDefault(); alert('Thank you! Our AV engineer will contact you shortly.'); }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="input-control" required placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Company Email</label>
                    <input type="email" className="input-control" required placeholder="john@company.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Project Description</label>
                    <textarea className="input-control" required placeholder="E.g., Conference room upgrade with Poly bar and 85-inch display..."></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Send Inquiry</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
