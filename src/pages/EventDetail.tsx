import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Clock, CheckCircle, Send, AlertCircle, Star } from 'lucide-react';
import { sendEmail, formatEventRegistrationEmail } from '../utils/emailService';
import { useAdmin } from '../contexts/AdminContext';
import LeaderManager from '../components/LeaderManager';

const EventDetail = () => {
  const { id } = useParams();
  const { isAdminMode } = useAdmin();
  const [showRegistration, setShowRegistration] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    dietaryRestrictions: '',
    experience: ''
  });

  const events = {
    '1': {
      title: 'Community Health Fair',
      date: '2024-04-15',
      time: '9:00 AM - 4:00 PM',
      location: 'City Community Center, Karachi',
      description: 'Free health screenings, vaccinations, and health education sessions for the entire community.',
      attendees: 150,
      category: 'Health',
      registrationDeadline: 'April 10, 2024',
      image: 'https://images.pexels.com/photos/6129507/pexels-photo-6129507.jpeg?auto=compress&cs=tinysrgb&w=800',
      aims: [
        'Provide free health screenings to underserved communities',
        'Increase health awareness and preventive care knowledge',
        'Connect community members with healthcare resources',
        'Promote healthy lifestyle choices and habits'
      ],
      objectives: [
        'Screen 500+ individuals for basic health conditions',
        'Provide vaccinations to 200+ children and adults',
        'Distribute 1000+ health education materials',
        'Register 100+ people for ongoing healthcare programs'
      ],
      overview: 'Our Community Health Fair is a comprehensive one-day event bringing essential healthcare services directly to the community. We partner with local hospitals, clinics, and health professionals to provide free screenings, vaccinations, and health education. The event includes specialized stations for different age groups and health concerns.',
      schedule: [
        { time: '9:00 AM - 10:00 AM', activity: 'Registration and Welcome' },
        { time: '10:00 AM - 12:00 PM', activity: 'Health Screenings (Blood Pressure, Diabetes, BMI)' },
        { time: '12:00 PM - 1:00 PM', activity: 'Lunch Break and Networking' },
        { time: '1:00 PM - 3:00 PM', activity: 'Vaccinations and Health Education Sessions' },
        { time: '3:00 PM - 4:00 PM', activity: 'Resource Distribution and Follow-up Appointments' }
      ],
      services: [
        'Free blood pressure and diabetes screening',
        'BMI and basic health assessments',
        'Vaccination services for all ages',
        'Eye and dental check-ups',
        'Maternal and child health consultations',
        'Mental health awareness sessions',
        'Nutrition counseling',
        'Health insurance enrollment assistance'
      ],
      requirements: [
        'Bring valid ID for registration',
        'Vaccination records (if available)',
        'List of current medications',
        'Comfortable clothing for screenings',
        'Empty stomach for diabetes screening (if applicable)'
      ],
      volunteerRoles: [
        'Registration and check-in assistance',
        'Translation services (Urdu/English)',
        'Crowd management and guidance',
        'Health education material distribution',
        'Data collection and record keeping',
        'Setup and cleanup assistance'
      ],
      coordinator: 'Dr. Sarah Ahmed - Community Health Director',
      contact: 'health@wasilah.org | +92 XXX XXXXXXX',
      cost: 'Free for all participants',
      parking: 'Free parking available at the community center'
    },
    '2': {
      title: 'Educational Workshop Series',
      date: '2024-04-20',
      time: '2:00 PM - 5:00 PM',
      location: 'Waseela Training Center, Lahore',
      description: 'Interactive workshops on digital literacy, financial planning, and career development.',
      attendees: 80,
      category: 'Education',
      registrationDeadline: 'April 17, 2024',
      image: 'https://images.pexels.com/photos/7516359/pexels-photo-7516359.jpeg?auto=compress&cs=tinysrgb&w=800',
      aims: [
        'Enhance digital literacy skills in the community',
        'Provide practical financial planning education',
        'Support career development and job readiness',
        'Create networking opportunities for participants'
      ],
      objectives: [
        'Train 80+ participants in essential digital skills',
        'Provide financial planning tools and resources',
        'Conduct mock interviews and resume workshops',
        'Establish ongoing mentorship connections'
      ],
      overview: 'This comprehensive workshop series covers three essential life skills: digital literacy, financial planning, and career development. Participants will engage in hands-on learning experiences, receive practical tools and resources, and connect with mentors and peers. The workshops are designed for adults of all ages looking to enhance their skills and opportunities.',
      schedule: [
        { time: '2:00 PM - 2:30 PM', activity: 'Registration and Welcome Coffee' },
        { time: '2:30 PM - 3:15 PM', activity: 'Digital Literacy Workshop' },
        { time: '3:15 PM - 3:30 PM', activity: 'Break and Networking' },
        { time: '3:30 PM - 4:15 PM', activity: 'Financial Planning Session' },
        { time: '4:15 PM - 5:00 PM', activity: 'Career Development and Q&A' }
      ],
      services: [
        'Basic computer and internet training',
        'Email setup and digital communication',
        'Online banking and digital payments',
        'Personal budgeting and savings strategies',
        'Investment basics and retirement planning',
        'Resume writing and interview skills',
        'Job search strategies and networking',
        'Professional development planning'
      ],
      requirements: [
        'Basic reading and writing skills',
        'Bring notebook and pen for notes',
        'Smartphone or tablet (if available)',
        'Bank account information (for financial planning)',
        'Current resume (if available)'
      ],
      volunteerRoles: [
        'Workshop facilitation assistance',
        'Technical support for digital activities',
        'One-on-one mentoring during sessions',
        'Registration and materials distribution',
        'Translation services',
        'Follow-up coordination'
      ],
      coordinator: 'Ms. Fatima Khan - Education Program Manager',
      contact: 'education@wasilah.org | +92 XXX XXXXXXX',
      cost: 'Free for all participants',
      materials: 'All materials and resources provided'
    },
    '3': {
      title: 'Volunteer Training Day',
      date: '2024-04-25',
      time: '10:00 AM - 3:00 PM',
      location: 'Multiple Locations',
      description: 'Comprehensive training for new volunteers covering project management, community engagement, and safety protocols.',
      attendees: 60,
      category: 'Training',
      registrationDeadline: 'April 22, 2024',
      image: 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800',
      aims: [
        'Prepare new volunteers for effective community service',
        'Provide essential training in project management',
        'Ensure safety and best practices in all activities',
        'Build a strong, knowledgeable volunteer network'
      ],
      objectives: [
        'Train 60+ new volunteers in core competencies',
        'Certify volunteers in safety protocols',
        'Establish mentor-mentee relationships',
        'Create volunteer resource network'
      ],
      overview: 'Our Volunteer Training Day is a comprehensive orientation program for new volunteers joining Wasilah. The training covers essential skills, safety protocols, project management basics, and community engagement strategies. Participants will receive certification and ongoing support to ensure successful volunteer experiences.',
      schedule: [
        { time: '10:00 AM - 10:30 AM', activity: 'Welcome and Introductions' },
        { time: '10:30 AM - 11:30 AM', activity: 'Wasilah Mission and Values' },
        { time: '11:30 AM - 12:30 PM', activity: 'Project Management Basics' },
        { time: '12:30 PM - 1:00 PM', activity: 'Lunch Break' },
        { time: '1:00 PM - 2:00 PM', activity: 'Community Engagement Strategies' },
        { time: '2:00 PM - 2:45 PM', activity: 'Safety Protocols and Emergency Procedures' },
        { time: '2:45 PM - 3:00 PM', activity: 'Certification and Next Steps' }
      ],
      services: [
        'Comprehensive volunteer handbook',
        'Project management training materials',
        'Safety protocol certification',
        'Community engagement guidelines',
        'Emergency response training',
        'Mentor assignment and introduction',
        'Ongoing support resources',
        'Volunteer ID and materials'
      ],
      requirements: [
        'Completed volunteer application',
        'Background check clearance',
        'Commitment to volunteer for minimum 6 months',
        'Attendance at full training session',
        'Basic first aid knowledge preferred'
      ],
      volunteerRoles: [
        'Training session facilitation',
        'Mentor assignment and coordination',
        'Materials preparation and distribution',
        'Registration and check-in',
        'Documentation and certification',
        'Follow-up and ongoing support'
      ],
      coordinator: 'Mr. Ahmed Hassan - Volunteer Coordinator',
      contact: 'volunteers@wasilah.org | +92 XXX XXXXXXX',
      cost: 'Free for all participants',
      certification: 'Official Wasilah Volunteer Certificate provided'
    },
    '4': {
      title: 'Clean-Up Drive & Tree Plantation',
      date: '2024-05-01',
      time: '7:00 AM - 12:00 PM',
      location: 'Various Parks & Communities',
      description: 'Community-wide environmental initiative focusing on waste management and urban forestry.',
      attendees: 200,
      category: 'Environment',
      registrationDeadline: 'April 28, 2024',
      image: 'https://images.pexels.com/photos/9324574/pexels-photo-9324574.jpeg?auto=compress&cs=tinysrgb&w=800',
      aims: [
        'Improve environmental conditions in local communities',
        'Increase green cover through tree plantation',
        'Promote environmental awareness and responsibility',
        'Build community pride and ownership'
      ],
      objectives: [
        'Clean 10+ parks and community areas',
        'Plant 500+ trees and saplings',
        'Collect and properly dispose of 2+ tons of waste',
        'Engage 200+ community members in environmental action'
      ],
      overview: 'Our Clean-Up Drive & Tree Plantation is a large-scale environmental initiative bringing together community members to improve local environmental conditions. The event combines waste collection and proper disposal with tree planting activities. Participants will work in teams across multiple locations to maximize impact.',
      schedule: [
        { time: '7:00 AM - 7:30 AM', activity: 'Registration and Team Assignment' },
        { time: '7:30 AM - 9:30 AM', activity: 'Clean-Up Activities (Waste Collection)' },
        { time: '9:30 AM - 10:00 AM', activity: 'Refreshment Break' },
        { time: '10:00 AM - 11:30 AM', activity: 'Tree Plantation Activities' },
        { time: '11:30 AM - 12:00 PM', activity: 'Wrap-up and Group Photo' }
      ],
      services: [
        'All cleaning supplies and equipment provided',
        'Tree saplings and planting materials',
        'Waste collection and disposal coordination',
        'Refreshments and water throughout event',
        'Transportation to assigned locations',
        'First aid support and safety equipment',
        'Environmental education materials',
        'Participation certificates'
      ],
      requirements: [
        'Comfortable work clothes and closed-toe shoes',
        'Sun protection (hat, sunscreen)',
        'Water bottle and personal snacks',
        'Work gloves (if available)',
        'Physical ability for outdoor work'
      ],
      volunteerRoles: [
        'Team leadership and coordination',
        'Equipment distribution and management',
        'Safety monitoring and first aid',
        'Transportation coordination',
        'Documentation and photography',
        'Waste sorting and disposal guidance',
        'Tree planting instruction',
        'Community engagement and education'
      ],
      coordinator: 'Eng. Omar Sheikh - Environmental Projects Lead',
      contact: 'environment@wasilah.org | +92 XXX XXXXXXX',
      cost: 'Free for all participants',
      impact: 'Expected to clean 15+ locations and plant 500+ trees'
    }
  };

  const event = events[id as keyof typeof events];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRegistrationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistrationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send email notification
    const emailData = formatEventRegistrationEmail({
      ...registrationData,
      eventTitle: event.title,
      eventDate: formatDate(event.date),
      timestamp: new Date().toISOString()
    });
    
    sendEmail(emailData).then((success) => {
      if (success) {
        alert(`Thank you for registering for ${event.title}! You will receive a confirmation email shortly.`);
      } else {
        alert('There was an error with your registration. Please try again or contact us directly.');
      }
    });
    
    setRegistrationData({ name: '', email: '', phone: '', emergencyContact: '', dietaryRestrictions: '', experience: '' });
    setShowRegistration(false);
  };

  if (!event) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-4xl font-luxury-heading text-black mb-4">Event Not Found</h1>
        <Link to="/events" className="btn-luxury-primary inline-flex items-center">
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Events
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'health': return 'bg-red-100 text-red-800';
      case 'education': return 'bg-blue-100 text-blue-800';
      case 'training': return 'bg-purple-100 text-purple-800';
      case 'environment': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="py-12">
      {/* Header */}
      <section className="bg-cream-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/events" className="inline-flex items-center text-vibrant-orange hover:text-vibrant-orange-dark mb-8 font-luxury-semibold">
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Events
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-4 py-2 rounded-luxury font-luxury-semibold ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
                <div className="flex items-center text-vibrant-orange">
                  <Star className="w-5 h-5 mr-1" />
                  <span className="font-luxury-semibold">Featured Event</span>
                </div>
              </div>
              
              <h1 className="text-5xl font-luxury-display text-black mb-6">{event.title}</h1>
              <p className="text-xl text-black font-luxury-body leading-relaxed mb-8">{event.description}</p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center text-black">
                  <Calendar className="w-6 h-6 mr-3 text-vibrant-orange" />
                  <span className="font-luxury-body">{formatDate(event.date)}</span>
                </div>
                <div className="flex items-center text-black">
                  <Clock className="w-6 h-6 mr-3 text-vibrant-orange" />
                  <span className="font-luxury-body">{event.time}</span>
                </div>
                <div className="flex items-center text-black">
                  <MapPin className="w-6 h-6 mr-3 text-vibrant-orange" />
                  <span className="font-luxury-body">{event.location}</span>
                </div>
                <div className="flex items-center text-black">
                  <Users className="w-6 h-6 mr-3 text-vibrant-orange" />
                  <span className="font-luxury-body">{event.attendees} expected</span>
                </div>
              </div>
              
              <div className="bg-vibrant-orange/10 p-6 rounded-luxury mb-8">
                <p className="text-black font-luxury-semibold">
                  Registration Deadline: <span className="text-vibrant-orange-dark">{event.registrationDeadline}</span>
                </p>
              </div>
              
              <button
                onClick={() => setShowRegistration(true)}
                className="btn-luxury-primary text-lg px-8 py-4 inline-flex items-center"
              >
                Register Now
                <Send className="ml-3 w-6 h-6" />
              </button>
            </div>
            
            <div className="relative">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-96 object-cover rounded-luxury-lg shadow-luxury"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Event Details */}
      <section className="py-16 bg-cream-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div className="luxury-card bg-cream-white p-10">
                <h2 className="text-3xl font-luxury-heading text-black mb-6">Event Overview</h2>
                <p className="text-black font-luxury-body text-lg leading-relaxed">{event.overview}</p>
              </div>

              {/* Aims & Objectives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="luxury-card bg-cream-white p-8">
                  <h3 className="text-2xl font-luxury-heading text-black mb-6">Event Aims</h3>
                  <ul className="space-y-3">
                    {event.aims.map((aim, index) => (
                      <li key={index} className="flex items-start text-black font-luxury-body">
                        <CheckCircle className="w-5 h-5 mr-3 text-vibrant-orange flex-shrink-0 mt-1" />
                        {aim}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="luxury-card bg-cream-white p-8">
                  <h3 className="text-2xl font-luxury-heading text-black mb-6">Key Objectives</h3>
                  <ul className="space-y-3">
                    {event.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start text-black font-luxury-body">
                        <CheckCircle className="w-5 h-5 mr-3 text-vibrant-orange flex-shrink-0 mt-1" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Schedule */}
              <div className="luxury-card bg-cream-white p-10">
                <h2 className="text-3xl font-luxury-heading text-black mb-6">Event Schedule</h2>
                <div className="space-y-4">
                  {event.schedule.map((item, index) => (
                    <div key={index} className="flex items-center p-4 bg-cream-elegant rounded-luxury">
                      <div className="bg-vibrant-orange text-white px-4 py-2 rounded-luxury font-luxury-semibold mr-6 min-w-fit">
                        {item.time}
                      </div>
                      <div className="text-black font-luxury-body text-lg">{item.activity}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services/Activities */}
              <div className="luxury-card bg-cream-white p-10">
                <h2 className="text-3xl font-luxury-heading text-black mb-6">What's Included</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.services.map((service, index) => (
                    <div key={index} className="flex items-center text-black font-luxury-body p-4 bg-cream-elegant rounded-luxury">
                      <CheckCircle className="w-5 h-5 mr-3 text-vibrant-orange flex-shrink-0" />
                      {service}
                    </div>
                  ))}
                </div>
              </div>

              {/* Volunteer Opportunities */}
              <div className="luxury-card bg-logo-navy p-10 text-cream-elegant">
                <h2 className="text-3xl font-luxury-heading text-vibrant-orange-light mb-6">Volunteer Opportunities</h2>
                <p className="text-cream-elegant font-luxury-body text-lg mb-6">
                  Join our team of volunteers and help make this event successful!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {event.volunteerRoles.map((role, index) => (
                    <div key={index} className="flex items-start text-cream-elegant font-luxury-body p-4 bg-logo-navy-light/60 rounded-luxury">
                      <CheckCircle className="w-5 h-5 mr-3 text-vibrant-orange-light flex-shrink-0 mt-1" />
                      {role}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Requirements */}
              <div className="luxury-card bg-cream-white p-8">
                <h3 className="text-2xl font-luxury-heading text-black mb-6">What to Bring</h3>
                <ul className="space-y-3">
                  {event.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start text-black font-luxury-body">
                      <AlertCircle className="w-5 h-5 mr-3 text-vibrant-orange flex-shrink-0 mt-1" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Event Details */}
              <div className="luxury-card bg-cream-white p-8">
                <h3 className="text-2xl font-luxury-heading text-black mb-6">Event Details</h3>
                <div className="space-y-4 text-black font-luxury-body">
                  <div>
                    <strong>Cost:</strong> {event.cost}
                  </div>
                  {event.materials && (
                    <div>
                      <strong>Materials:</strong> {event.materials}
                    </div>
                  )}
                  {event.parking && (
                    <div>
                      <strong>Parking:</strong> {event.parking}
                    </div>
                  )}
                  {event.certification && (
                    <div>
                      <strong>Certification:</strong> {event.certification}
                    </div>
                  )}
                  {event.impact && (
                    <div>
                      <strong>Expected Impact:</strong> {event.impact}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="luxury-card bg-vibrant-orange/10 p-8">
                <h3 className="text-2xl font-luxury-heading text-black mb-4">Event Coordinator</h3>
                <p className="text-black font-luxury-semibold mb-2">{event.coordinator}</p>
                <p className="text-black font-luxury-body text-sm">{event.contact}</p>
              </div>

              {/* Register Button */}
              <button
                onClick={() => setShowRegistration(true)}
                className="w-full btn-luxury-primary py-4 px-6 text-lg"
              >
                Register for This Event
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Event Organizers Section */}
      <section className="py-16 bg-cream-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeaderManager type="event" entityId={id || ''} isAdmin={isAdminMode} />
        </div>
      </section>

      {/* Registration Modal */}
      {showRegistration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="luxury-card bg-cream-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-luxury-heading text-black">Event Registration</h3>
              <button
                onClick={() => setShowRegistration(false)}
                className="text-black hover:text-vibrant-orange text-2xl"
              >
                ×
              </button>
            </div>
            
            <p className="text-black font-luxury-body mb-6">
              Register for: <strong>{event.title}</strong><br />
              <span className="text-vibrant-orange-dark">{formatDate(event.date)} at {event.time}</span>
            </p>

            <form onSubmit={handleRegistrationSubmit} className="space-y-6">
              <div>
                <label className="block font-luxury-medium text-black mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={registrationData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
                />
              </div>

              <div>
                <label className="block font-luxury-medium text-black mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={registrationData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
                />
              </div>

              <div>
                <label className="block font-luxury-medium text-black mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={registrationData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
                />
              </div>

              <div>
                <label className="block font-luxury-medium text-black mb-2">Emergency Contact</label>
                <input
                  type="text"
                  name="emergencyContact"
                  value={registrationData.emergencyContact}
                  onChange={handleInputChange}
                  placeholder="Name and phone number"
                  className="w-full px-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
                />
              </div>

              <div>
                <label className="block font-luxury-medium text-black mb-2">Dietary Restrictions/Allergies</label>
                <input
                  type="text"
                  name="dietaryRestrictions"
                  value={registrationData.dietaryRestrictions}
                  onChange={handleInputChange}
                  placeholder="Please specify any dietary restrictions or allergies"
                  className="w-full px-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
                />
              </div>

              <div>
                <label className="block font-luxury-medium text-black mb-2">Previous Experience (Optional)</label>
                <textarea
                  name="experience"
                  rows={3}
                  value={registrationData.experience}
                  onChange={handleInputChange}
                  placeholder="Any relevant experience or special skills you'd like to share..."
                  className="w-full px-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowRegistration(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-luxury text-black font-luxury-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-luxury-primary py-3 px-6 flex items-center justify-center"
                >
                  Complete Registration
                  <Send className="ml-2 w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventDetail;