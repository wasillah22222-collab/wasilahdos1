import { db } from '../config/firebase';
import { doc, setDoc, collection, getDocs } from 'firebase/firestore';

const defaultHeroContent = {
  title: 'Empowering Communities,',
  titleHighlight: 'Building Futures',
  subtitle: 'Where compassion meets action. Join our mission to transform lives, strengthen communities, and create lasting positive change through collective service and unwavering dedication.',
  logoIcon: 'Heart',
  arabicName: 'وسیلہ',
  englishName: 'Waseela',
  updatedAt: new Date()
};

const defaultAboutContent = {
  title: 'Who We Are',
  description1: 'Wasilah is more than a platform—we\'re a movement of passionate individuals dedicated to creating positive change. Through collaborative service and meaningful action, we connect communities with the resources and support they need to thrive.',
  description2: 'Our mission is simple: empower communities to build their own futures through sustainable development, education, and collective action.',
  cardTitle: 'Community at Heart',
  cardDescription: 'Every action we take is driven by our commitment to building stronger, more connected communities.',
  updatedAt: new Date()
};

const defaultImpactContent = {
  stats: [
    { number: '5000+', label: 'Active Volunteers', icon: 'Users', key: 'volunteers', target: 5000 },
    { number: '120+', label: 'Projects Completed', icon: 'Target', key: 'projects', target: 120 },
    { number: '50+', label: 'Communities Served', icon: 'Heart', key: 'communities', target: 50 },
    { number: '25K+', label: 'Lives Impacted', icon: 'Award', key: 'lives', target: 25000 },
  ],
  updatedAt: new Date()
};

const defaultPrograms = [
  {
    title: 'Education Support',
    description: 'Providing quality education resources and tutoring to underserved communities.',
    icon: '📚',
    color: 'bg-cream-elegant',
    textColor: 'text-dark-readable',
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Healthcare Access',
    description: 'Organizing health camps and awareness programs for better community health.',
    icon: '🏥',
    color: 'bg-logo-navy',
    textColor: 'text-cream-elegant',
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Skills Development',
    description: 'Vocational training and skill-building workshops for economic empowerment.',
    icon: '🛠️',
    color: 'bg-cream-elegant',
    textColor: 'text-dark-readable',
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Environmental Action',
    description: 'Community-driven environmental conservation and sustainability initiatives.',
    icon: '🌱',
    color: 'bg-logo-navy',
    textColor: 'text-cream-elegant',
    order: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

const defaultTestimonials = [
  {
    name: 'Sarah Ahmed',
    role: 'Community Volunteer',
    image: 'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150',
    quote: 'Wasilah has given me the platform to make a real difference in my community. The impact we create together is truly inspiring.',
    rating: 5,
    order: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Muhammad Hassan',
    role: 'Project Coordinator',
    image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    quote: 'Working with Wasilah has been transformative. We are building stronger, more resilient communities every day.',
    rating: 5,
    order: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: 'Fatima Khan',
    role: 'Education Volunteer',
    image: 'https://images.pexels.com/photos/3763152/pexels-photo-3763152.jpeg?auto=compress&cs=tinysrgb&w=150',
    quote: 'The education programs have changed countless lives. I am proud to be part of this incredible movement.',
    rating: 5,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
];

const defaultCtaContent = {
  title: 'Together, We Can Build',
  titleHighlight: 'Stronger Communities',
  description: 'Be part of something bigger. Join our movement and help create the positive change our communities need and deserve.',
  buttonText: 'Become a Volunteer',
  buttonLink: '/volunteer',
  updatedAt: new Date()
};

export const initializeDefaultContent = async () => {
  try {
    console.log('Initializing default content...');

    // Check if content already exists
    const heroRef = doc(db, 'hero_content', 'main');
    const heroDoc = await getDocs(collection(db, 'hero_content'));

    if (heroDoc.empty) {
      // Initialize Hero Content
      await setDoc(doc(db, 'hero_content', 'main'), defaultHeroContent);
      console.log('Hero content initialized');

      // Initialize About Content
      await setDoc(doc(db, 'about_content', 'main'), defaultAboutContent);
      console.log('About content initialized');

      // Initialize Impact Content
      await setDoc(doc(db, 'impact_content', 'main'), defaultImpactContent);
      console.log('Impact content initialized');

      // Initialize Programs
      for (const program of defaultPrograms) {
        await setDoc(doc(collection(db, 'programs')), program);
      }
      console.log('Programs initialized');

      // Initialize Testimonials
      for (const testimonial of defaultTestimonials) {
        await setDoc(doc(collection(db, 'testimonials')), testimonial);
      }
      console.log('Testimonials initialized');

      // Initialize CTA Content
      await setDoc(doc(db, 'cta_content', 'main'), defaultCtaContent);
      console.log('CTA content initialized');

      console.log('All default content initialized successfully!');
    } else {
      console.log('Content already exists. Skipping initialization.');
    }
  } catch (error) {
    console.error('Error initializing default content:', error);
    throw error;
  }
};
