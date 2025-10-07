import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Award, Heart, CheckCircle, Star, Quote, Globe, Lightbulb, Shield, Handshake } from 'lucide-react';

const Home = () => {
  const [counters, setCounters] = useState({
    volunteers: 0,
    projects: 0,
    communities: 0,
    lives: 0
  });

  const impactStats = [
    { number: '5000+', label: 'Active Volunteers', icon: Users, key: 'volunteers', target: 5000 },
    { number: '120+', label: 'Projects Completed', icon: Target, key: 'projects', target: 120 },
    { number: '50+', label: 'Communities Served', icon: Heart, key: 'communities', target: 50 },
    { number: '25K+', label: 'Lives Impacted', icon: Award, key: 'lives', target: 25000 },
  ];

  const programs = [
    {
      title: 'Education Support',
      description: 'Providing quality education resources and tutoring to underserved communities.',
      icon: '📚',
      color: 'bg-cream-elegant',
      textColor: 'text-dark-readable'
    },
    {
      title: 'Healthcare Access',
      description: 'Organizing health camps and awareness programs for better community health.',
      icon: '🏥',
      color: 'bg-logo-navy',
      textColor: 'text-cream-elegant'
    },
    {
      title: 'Skills Development',
      description: 'Vocational training and skill-building workshops for economic empowerment.',
      icon: '🛠️',
      color: 'bg-cream-elegant',
      textColor: 'text-dark-readable'
    },
    {
      title: 'Environmental Action',
      description: 'Community-driven environmental conservation and sustainability initiatives.',
      icon: '🌱',
      color: 'bg-logo-navy',
      textColor: 'text-cream-elegant'
    },
  ];

  const testimonials = [
    {
      name: 'Sarah Ahmed',
      role: 'Community Volunteer',
      image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Wasilah has given me the platform to make a real difference in my community. The impact we create together is truly inspiring.',
      rating: 5
    },
    {
      name: 'Muhammad Hassan',
      role: 'Project Coordinator',
      image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'Working with Wasilah has been transformative. We are building stronger, more resilient communities every day.',
      rating: 5
    },
    {
      name: 'Fatima Khan',
      role: 'Education Volunteer',
      image: 'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=150',
      quote: 'The education programs have changed countless lives. I am proud to be part of this incredible movement.',
      rating: 5
    },
  ];

  // Counter animation effect
  useEffect(() => {
    const animateCounters = () => {
      const duration = 2000; // 2 seconds
      const steps = 60;
      const stepDuration = duration / steps;

      impactStats.forEach(stat => {
        let current = 0;
        const increment = stat.target / steps;
        
        const timer = setInterval(() => {
          current += increment;
          if (current >= stat.target) {
            current = stat.target;
            clearInterval(timer);
          }
          
          setCounters(prev => ({
            ...prev,
            [stat.key]: Math.floor(current)
          }));
        }, stepDuration);
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    });

    const statsSection = document.getElementById('impact-stats');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* Hero Section - Matching Reference Design */}
      <section className="hero-luxury-bg min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* 3D Floating Elements */}
        <div className="floating-3d-luxury"></div>
        <div className="floating-3d-luxury"></div>
        <div className="floating-3d-luxury"></div>
        <div className="floating-3d-luxury"></div>
        <div className="floating-3d-luxury"></div>
        
        {/* Luxury Particles */}
        <div className="luxury-particle"></div>
        <div className="luxury-particle"></div>
        <div className="luxury-particle"></div>
        <div className="luxury-particle"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center relative z-10">
          <div className="animate-cinematic-fade">
            {/* Central Logo */}
            <div className="mb-12">
              <div className="w-32 h-32 bg-vibrant-orange rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-luxury-glow-lg animate-luxury-glow">
                <Heart className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-4xl font-arabic text-cream-elegant mb-4">وسیلہ</h2>
              <h3 className="text-2xl font-luxury-heading text-vibrant-orange-light">Waseela</h3>
            </div>

            <h1 className="text-6xl md:text-8xl font-luxury-display text-cream-elegant mb-8 leading-tight">
              Empowering Communities,
              <br />
              <span className="luxury-gradient-text animate-text-shimmer">Building Futures</span>
            </h1>
            <p className="text-2xl md:text-3xl text-cream-elegant/90 mb-12 max-w-4xl mx-auto font-luxury-body leading-relaxed">
              Where compassion meets action. Join our mission to transform lives, strengthen 
              communities, and create lasting positive change through collective service and 
              unwavering dedication.
            </p>
            <div className="flex flex-col sm:flex-row gap-8 justify-center">
              <Link
                to="/volunteer"
                className="btn-luxury-primary text-xl px-12 py-6 inline-flex items-center"
              >
                <Users className="mr-3 w-6 h-6" />
                Join Our Mission
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
              <Link
                to="/about"
                className="btn-luxury-secondary text-xl px-12 py-6 inline-flex items-center"
              >
                Learn More
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Highlights */}
      <section id="impact-stats" className="py-24 bg-cream-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cream-elegant/50 to-cream-white"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-luxury-display text-logo-navy mb-8 animate-slide-up-luxury">
              Our Impact in Numbers
            </h2>
            <p className="text-2xl text-text-medium font-luxury-body max-w-4xl mx-auto">
              See the tangible difference we're making in communities across the region
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {impactStats.map((stat, index) => (
              <div key={index} className="text-center luxury-hover-scale luxury-card p-10 group">
                <div className="service-icon-luxury w-20 h-20 flex items-center justify-center mx-auto mb-8">
                  <stat.icon className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-5xl font-luxury-display impact-counter mb-4 animate-counter text-logo-navy">
                  {stat.key === 'lives' ? `${Math.floor(counters[stat.key] / 1000)}K+` : `${counters[stat.key]}+`}
                </h3>
                <p className="text-text-medium font-luxury-medium text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Are Section */}
      <section className="py-24 bg-cream-elegant relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="luxury-card bg-logo-navy p-12 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-vibrant-orange/20 to-transparent"></div>
                <div className="service-icon-luxury w-32 h-32 flex items-center justify-center mx-auto mb-8">
                  <Heart className="w-16 h-16 text-white" />
                </div>
                <h3 className="text-3xl font-luxury-heading text-cream-elegant mb-6 relative z-10">
                  Community at Heart
                </h3>
                <p className="text-cream-elegant/80 font-luxury-body text-lg relative z-10 leading-relaxed">
                  Every action we take is driven by our commitment to building stronger, 
                  more connected communities.
                </p>
              </div>
            </div>
            
            <div className="animate-slide-up-luxury">
              <h2 className="text-5xl md:text-6xl font-luxury-display text-black mb-8">
                Who We Are
              </h2>
              <p className="text-xl text-black font-luxury-body mb-8 leading-relaxed">
                Wasilah is more than a platform—we're a movement of passionate individuals 
                dedicated to creating positive change. Through collaborative service and 
                meaningful action, we connect communities with the resources and support 
                they need to thrive.
              </p>
              <p className="text-xl text-black font-luxury-body mb-10 leading-relaxed">
                Our mission is simple: empower communities to build their own futures 
                through sustainable development, education, and collective action.
              </p>
              <Link
                to="/about"
                className="btn-luxury-primary text-lg inline-flex items-center"
              >
                Learn More About Us
                <ArrowRight className="ml-3 w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs & Services */}
      <section className="py-24 bg-cream-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-luxury-display text-black mb-8">
              Our Programs
            </h2>
            <p className="text-2xl text-black font-luxury-body max-w-4xl mx-auto">
              Comprehensive initiatives designed to address community needs and create lasting impact
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {programs.map((program, index) => (
              <div key={index} className={`${program.color} ${program.textColor} p-12 rounded-luxury-lg luxury-hover-scale luxury-card group relative overflow-hidden`}>
                <div className="absolute inset-0 bg-gradient-to-br from-vibrant-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="text-7xl mb-8 relative z-10">{program.icon}</div>
                <h3 className="text-3xl font-luxury-heading mb-6 group-hover:text-vibrant-orange transition-colors duration-300 relative z-10">
                  {program.title}
                </h3>
                <p className={`font-luxury-body text-lg leading-relaxed relative z-10 ${program.color.includes('navy') ? 'text-cream-elegant/80' : 'text-black'}`}>
                  {program.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section className="py-24 bg-cream-elegant relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-vibrant-orange/5 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-luxury-display mb-8" style={{color: '#000000'}}>
              What Our Community Says
            </h2>
            <p className="text-2xl font-luxury-body max-w-4xl mx-auto" style={{color: '#000000'}}>
              Hear from the volunteers and community members who make our mission possible
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card p-10 luxury-hover-scale">
                <div className="flex items-center mb-8">
                  <div className="relative">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-vibrant-orange/30"
                    />
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-vibrant-orange rounded-full flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="ml-6">
                    <h4 className="text-xl font-luxury-heading" style={{color: '#000000'}}>
                      {testimonial.name}
                    </h4>
                    <p className="font-luxury-body" style={{color: '#1A1A1A'}}>{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-vibrant-orange fill-current" />
                  ))}
                </div>
                
                <Quote className="w-10 h-10 text-vibrant-orange mb-6" />
                <p className="font-luxury-body text-lg leading-relaxed luxury-quote" style={{color: '#000000'}}>
                  {testimonial.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="cta-parallax py-24 text-cream-elegant relative overflow-hidden">
        {/* 3D Floating Hearts and Hands */}
        <div className="absolute inset-0">
          <div className="floating-3d-luxury opacity-30"></div>
          <div className="floating-3d-luxury opacity-20"></div>
          <div className="floating-3d-luxury opacity-25"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-slide-up-luxury">
            <h2 className="text-5xl md:text-7xl font-luxury-display mb-8 leading-tight">
              Together, We Can Build
              <br />
              <span className="luxury-gradient-text">Stronger Communities</span>
            </h2>
            <p className="text-2xl font-luxury-body mb-12 max-w-4xl mx-auto leading-relaxed text-cream-elegant/90">
              Be part of something bigger. Join our movement and help create the positive change 
              our communities need and deserve.
            </p>
            <Link
              to="/volunteer"
              className="bg-gradient-to-r from-vibrant-orange to-vibrant-orange-light text-white px-16 py-6 rounded-luxury font-luxury-semibold text-xl hover:from-vibrant-orange-light hover:to-vibrant-orange transition-all duration-400 inline-flex items-center shadow-luxury-glow-lg hover:scale-105 hover:-translate-y-2"
            >
              Become a Volunteer
              <ArrowRight className="ml-4 w-7 h-7" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;