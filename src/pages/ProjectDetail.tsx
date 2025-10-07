import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, MapPin, Target, Clock, CheckCircle, Send, AlertCircle } from 'lucide-react';
import { sendEmail, formatProjectApplicationEmail } from '../utils/emailService';
import { useAdmin } from '../contexts/AdminContext';
import LeaderManager from '../components/LeaderManager';

const ProjectDetail = () => {
  const { id } = useParams();
  const { isAdminMode } = useAdmin();
  const [showApplication, setShowApplication] = useState(false);
  const [applicationData, setApplicationData] = useState({
    name: '',
    email: '',
    phone: '',
    experience: '',
    motivation: ''
  });

  const projects = {
    '1': {
      title: 'Education Support Program',
      description: 'Providing educational resources and tutoring support to underprivileged students in local communities.',
      category: 'education',
      status: 'ongoing',
      participants: 45,
      location: 'Karachi',
      startDate: 'March 2024',
      endDate: 'December 2024',
      applicationDeadline: 'April 30, 2024',
      image: 'https://images.pexels.com/photos/289737/pexels-photo-289737.jpeg?auto=compress&cs=tinysrgb&w=800',
      aims: [
        'Improve literacy rates among underprivileged children',
        'Provide quality educational resources and materials',
        'Establish sustainable tutoring programs',
        'Bridge the educational gap in underserved communities'
      ],
      objectives: [
        'Reach 200+ students across 5 schools',
        'Establish 10 community learning centers',
        'Train 50 volunteer tutors',
        'Distribute 1000+ educational kits'
      ],
      overview: 'This comprehensive education support program focuses on providing quality educational opportunities to children in underserved communities. We work directly with local schools and community centers to establish tutoring programs, distribute educational materials, and create sustainable learning environments. Our volunteers work one-on-one with students, helping them with homework, reading skills, and exam preparation.',
      activities: [
        'One-on-one tutoring sessions',
        'Group study circles',
        'Educational material distribution',
        'Parent engagement workshops',
        'Teacher training programs',
        'Digital literacy classes'
      ],
      requirements: [
        'Minimum high school education',
        'Good communication skills in Urdu/English',
        'Commitment of at least 4 hours per week',
        'Patience and enthusiasm for teaching',
        'Background check clearance'
      ],
      schedule: 'Weekdays: 4:00 PM - 7:00 PM, Weekends: 10:00 AM - 2:00 PM',
      coordinator: 'Ms. Fatima Khan - Education Program Manager',
      contact: 'education@wasilah.org | +92 XXX XXXXXXX'
    },
    '2': {
      title: 'Community Health Awareness',
      description: 'Organizing health camps and awareness sessions about preventive healthcare in rural areas.',
      category: 'health',
      status: 'completed',
      participants: 120,
      location: 'Lahore',
      startDate: 'January 2024',
      endDate: 'March 2024',
      applicationDeadline: 'Completed',
      image: 'https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=800',
      aims: [
        'Increase health awareness in rural communities',
        'Provide free basic health screenings',
        'Promote preventive healthcare practices',
        'Connect communities with healthcare resources'
      ],
      objectives: [
        'Conduct health camps in 15 villages',
        'Screen 2000+ individuals for basic health issues',
        'Distribute health education materials',
        'Train 30 community health volunteers'
      ],
      overview: 'Our Community Health Awareness project successfully brought essential healthcare services to remote rural areas around Lahore. We organized mobile health camps, conducted free screenings, and educated communities about preventive healthcare measures. The project included vaccination drives, maternal health sessions, and chronic disease management workshops.',
      activities: [
        'Mobile health camps',
        'Free health screenings',
        'Vaccination drives',
        'Health education workshops',
        'Maternal health sessions',
        'Chronic disease management training'
      ],
      requirements: [
        'Medical/nursing background preferred',
        'First aid certification',
        'Ability to work in rural settings',
        'Multilingual communication skills',
        'Physical fitness for field work'
      ],
      schedule: 'Project completed successfully in March 2024',
      coordinator: 'Dr. Ahmed Hassan - Health Program Director',
      contact: 'health@wasilah.org | +92 XXX XXXXXXX',
      results: [
        'Reached 2,500+ individuals across 18 villages',
        'Conducted 1,800+ health screenings',
        'Distributed 3,000+ health education pamphlets',
        'Trained 35 community health volunteers',
        'Identified and referred 150+ cases for specialized care'
      ]
    },
    '3': {
      title: 'Clean Water Initiative',
      description: 'Installing water filtration systems and promoting water conservation practices in underserved communities.',
      category: 'environment',
      status: 'ongoing',
      participants: 78,
      location: 'Islamabad',
      startDate: 'February 2024',
      endDate: 'August 2024',
      applicationDeadline: 'May 15, 2024',
      image: 'https://images.pexels.com/photos/1139556/pexels-photo-1139556.jpeg?auto=compress&cs=tinysrgb&w=800',
      aims: [
        'Provide access to clean drinking water',
        'Install sustainable water filtration systems',
        'Educate communities about water conservation',
        'Reduce waterborne diseases'
      ],
      objectives: [
        'Install 25 water filtration systems',
        'Serve 5,000+ community members',
        'Conduct 50+ water conservation workshops',
        'Train 40 local maintenance technicians'
      ],
      overview: 'The Clean Water Initiative addresses the critical need for safe drinking water in underserved communities around Islamabad. We install advanced water filtration systems, conduct maintenance training, and educate communities about water conservation practices. The project focuses on sustainable solutions that communities can maintain independently.',
      activities: [
        'Water quality testing and assessment',
        'Installation of filtration systems',
        'Community education workshops',
        'Maintenance training programs',
        'Water conservation awareness campaigns',
        'Regular system monitoring and maintenance'
      ],
      requirements: [
        'Technical background in plumbing/engineering preferred',
        'Physical ability for installation work',
        'Community engagement skills',
        'Basic understanding of water systems',
        'Commitment to project duration'
      ],
      schedule: 'Monday-Friday: 8:00 AM - 4:00 PM, Saturdays: 9:00 AM - 1:00 PM',
      coordinator: 'Eng. Omar Sheikh - Environmental Projects Lead',
      contact: 'environment@wasilah.org | +92 XXX XXXXXXX'
    },
    '4': {
      title: 'Digital Literacy Workshop',
      description: 'Teaching basic computer and internet skills to senior citizens and helping them connect with digital services.',
      category: 'technology',
      status: 'planning',
      participants: 25,
      location: 'Faisalabad',
      startDate: 'April 2024',
      endDate: 'June 2024',
      applicationDeadline: 'April 20, 2024',
      image: 'https://images.pexels.com/photos/5905709/pexels-photo-5905709.jpeg?auto=compress&cs=tinysrgb&w=800',
      aims: [
        'Bridge the digital divide for senior citizens',
        'Teach essential computer and internet skills',
        'Enable access to digital government services',
        'Promote digital inclusion and independence'
      ],
      objectives: [
        'Train 100+ senior citizens in basic computer skills',
        'Establish 3 community digital learning centers',
        'Create multilingual training materials',
        'Develop ongoing support network'
      ],
      overview: 'Our Digital Literacy Workshop is designed specifically for senior citizens who want to learn essential computer and internet skills. The program covers basic computer operations, internet browsing, email communication, and accessing digital government services. We provide patient, one-on-one instruction in a supportive environment.',
      activities: [
        'Basic computer operation training',
        'Internet browsing and safety',
        'Email setup and communication',
        'Digital government services access',
        'Social media basics',
        'Online banking and shopping safety'
      ],
      requirements: [
        'Strong computer and internet skills',
        'Patience and excellent communication',
        'Experience working with seniors preferred',
        'Multilingual abilities (Urdu/Punjabi/English)',
        'Teaching or training background helpful'
      ],
      schedule: 'Tuesdays & Thursdays: 10:00 AM - 12:00 PM, Saturdays: 2:00 PM - 4:00 PM',
      coordinator: 'Mr. Ali Raza - Technology Training Coordinator',
      contact: 'digital@wasilah.org | +92 XXX XXXXXXX'
    },
    '5': {
      title: 'Food Distribution Drive',
      description: 'Regular food distribution to families in need, especially during Ramadan and other significant periods.',
      category: 'social',
      status: 'ongoing',
      participants: 200,
      location: 'Multiple Cities',
      startDate: 'Ongoing',
      endDate: 'Ongoing',
      applicationDeadline: 'Open Applications',
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      aims: [
        'Provide nutritious food to families in need',
        'Ensure food security during difficult times',
        'Support vulnerable communities year-round',
        'Promote community solidarity and care'
      ],
      objectives: [
        'Distribute 10,000+ food packages monthly',
        'Serve 500+ families regularly',
        'Establish food distribution networks in 10 cities',
        'Coordinate special drives during Ramadan and emergencies'
      ],
      overview: 'Our Food Distribution Drive is an ongoing initiative that provides essential food supplies to families facing economic hardship. We operate year-round with special emphasis during Ramadan, Eid, and emergency situations. The program includes fresh produce, staple foods, and nutritional supplements for children and elderly.',
      activities: [
        'Weekly food package preparation',
        'Door-to-door distribution',
        'Community kitchen operations',
        'Special Ramadan iftar programs',
        'Emergency food relief',
        'Nutritional education sessions'
      ],
      requirements: [
        'Physical ability to lift and carry food packages',
        'Reliable transportation preferred',
        'Compassionate and respectful attitude',
        'Ability to work in diverse communities',
        'Flexible schedule availability'
      ],
      schedule: 'Flexible - Multiple shifts available throughout the week',
      coordinator: 'Mrs. Aisha Malik - Social Services Director',
      contact: 'food@wasilah.org | +92 XXX XXXXXXX'
    },
    '6': {
      title: 'Skills Development Center',
      description: 'Vocational training programs for unemployed youth, focusing on marketable skills and entrepreneurship.',
      category: 'education',
      status: 'completed',
      participants: 85,
      location: 'Peshawar',
      startDate: 'December 2023',
      endDate: 'March 2024',
      applicationDeadline: 'Completed',
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
      aims: [
        'Provide marketable vocational skills to unemployed youth',
        'Promote entrepreneurship and self-employment',
        'Reduce youth unemployment rates',
        'Strengthen local economic development'
      ],
      objectives: [
        'Train 100+ youth in various vocational skills',
        'Achieve 80%+ job placement rate',
        'Establish 20+ small businesses',
        'Create sustainable income opportunities'
      ],
      overview: 'The Skills Development Center successfully provided comprehensive vocational training to unemployed youth in Peshawar. The program included technical skills training, entrepreneurship development, and job placement assistance. Participants learned trades such as tailoring, electronics repair, computer skills, and small business management.',
      activities: [
        'Technical skills training workshops',
        'Entrepreneurship development sessions',
        'Business plan development',
        'Job placement assistance',
        'Mentorship programs',
        'Microfinance connections'
      ],
      requirements: [
        'Expertise in vocational/technical skills',
        'Business or entrepreneurship experience',
        'Teaching and mentoring abilities',
        'Understanding of local job market',
        'Commitment to youth development'
      ],
      schedule: 'Project completed successfully in March 2024',
      coordinator: 'Mr. Tariq Ahmed - Skills Development Manager',
      contact: 'skills@wasilah.org | +92 XXX XXXXXXX',
      results: [
        'Trained 95 youth in various vocational skills',
        'Achieved 85% job placement rate within 3 months',
        'Supported establishment of 22 small businesses',
        'Generated average monthly income increase of 150%',
        'Created ongoing mentorship network'
      ]
    }
  };

  const project = projects[id as keyof typeof projects];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setApplicationData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleApplicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Send email notification
    const emailData = formatProjectApplicationEmail({
      ...applicationData,
      projectTitle: project.title,
      timestamp: new Date().toISOString()
    });
    
    sendEmail(emailData).then((success) => {
      if (success) {
        alert(`Thank you for applying to ${project.title}! We will contact you within 2-3 business days.`);
      } else {
        alert('There was an error with your application. Please try again or contact us directly.');
      }
    });
    
    setApplicationData({ name: '', email: '', phone: '', experience: '', motivation: '' });
    setShowApplication(false);
  };

  if (!project) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-4xl font-luxury-heading text-black mb-4">Project Not Found</h1>
        <Link to="/projects" className="btn-luxury-primary inline-flex items-center">
          <ArrowLeft className="mr-2 w-5 h-5" />
          Back to Projects
        </Link>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing': return 'Active';
      case 'completed': return 'Completed';
      case 'planning': return 'Planning';
      default: return status;
    }
  };

  return (
    <div className="py-12">
      {/* Header */}
      <section className="bg-cream-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/projects" className="inline-flex items-center text-vibrant-orange hover:text-vibrant-orange-dark mb-8 font-luxury-semibold">
            <ArrowLeft className="mr-2 w-5 h-5" />
            Back to Projects
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <span className={`px-4 py-2 rounded-luxury font-luxury-semibold ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                <span className="px-4 py-2 bg-vibrant-orange/20 text-vibrant-orange-dark rounded-luxury font-luxury-semibold capitalize">
                  {project.category}
                </span>
              </div>
              
              <h1 className="text-5xl font-luxury-display text-black mb-6">{project.title}</h1>
              <p className="text-xl text-black font-luxury-body leading-relaxed mb-8">{project.description}</p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex items-center text-black">
                  <Users className="w-6 h-6 mr-3 text-vibrant-orange" />
                  <span className="font-luxury-body">{project.participants} volunteers</span>
                </div>
                <div className="flex items-center text-black">
                  <MapPin className="w-6 h-6 mr-3 text-vibrant-orange" />
                  <span className="font-luxury-body">{project.location}</span>
                </div>
                <div className="flex items-center text-black">
                  <Calendar className="w-6 h-6 mr-3 text-vibrant-orange" />
                  <span className="font-luxury-body">{project.startDate} - {project.endDate}</span>
                </div>
                <div className="flex items-center text-black">
                  <Clock className="w-6 h-6 mr-3 text-vibrant-orange" />
                  <span className="font-luxury-body">Apply by: {project.applicationDeadline}</span>
                </div>
              </div>
              
              {project.status !== 'completed' && (
                <button
                  onClick={() => setShowApplication(true)}
                  className="btn-luxury-primary text-lg px-8 py-4 inline-flex items-center"
                >
                  Quick Apply Now
                  <Send className="ml-3 w-6 h-6" />
                </button>
              )}
            </div>
            
            <div className="relative">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-96 object-cover rounded-luxury-lg shadow-luxury"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Project Details */}
      <section className="py-16 bg-cream-elegant">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div className="luxury-card bg-cream-white p-10">
                <h2 className="text-3xl font-luxury-heading text-black mb-6">Project Overview</h2>
                <p className="text-black font-luxury-body text-lg leading-relaxed">{project.overview}</p>
              </div>

              {/* Aims & Objectives */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="luxury-card bg-cream-white p-8">
                  <h3 className="text-2xl font-luxury-heading text-black mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-vibrant-orange" />
                    Project Aims
                  </h3>
                  <ul className="space-y-3">
                    {project.aims.map((aim, index) => (
                      <li key={index} className="flex items-start text-black font-luxury-body">
                        <CheckCircle className="w-5 h-5 mr-3 text-vibrant-orange flex-shrink-0 mt-1" />
                        {aim}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="luxury-card bg-cream-white p-8">
                  <h3 className="text-2xl font-luxury-heading text-black mb-6 flex items-center">
                    <Target className="w-6 h-6 mr-3 text-vibrant-orange" />
                    Key Objectives
                  </h3>
                  <ul className="space-y-3">
                    {project.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start text-black font-luxury-body">
                        <CheckCircle className="w-5 h-5 mr-3 text-vibrant-orange flex-shrink-0 mt-1" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Activities */}
              <div className="luxury-card bg-cream-white p-10">
                <h2 className="text-3xl font-luxury-heading text-black mb-6">Project Activities</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.activities.map((activity, index) => (
                    <div key={index} className="flex items-center text-black font-luxury-body p-4 bg-cream-elegant rounded-luxury">
                      <CheckCircle className="w-5 h-5 mr-3 text-vibrant-orange flex-shrink-0" />
                      {activity}
                    </div>
                  ))}
                </div>
              </div>

              {/* Results (for completed projects) */}
              {project.results && (
                <div className="luxury-card bg-logo-navy p-10 text-cream-elegant">
                  <h2 className="text-3xl font-luxury-heading text-vibrant-orange-light mb-6">Project Results</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.results.map((result, index) => (
                      <div key={index} className="flex items-start text-cream-elegant font-luxury-body p-4 bg-logo-navy-light/60 rounded-luxury">
                        <CheckCircle className="w-5 h-5 mr-3 text-vibrant-orange-light flex-shrink-0 mt-1" />
                        {result}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Requirements */}
              <div className="luxury-card bg-cream-white p-8">
                <h3 className="text-2xl font-luxury-heading text-black mb-6">Requirements</h3>
                <ul className="space-y-3">
                  {project.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start text-black font-luxury-body">
                      <AlertCircle className="w-5 h-5 mr-3 text-vibrant-orange flex-shrink-0 mt-1" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schedule */}
              <div className="luxury-card bg-cream-white p-8">
                <h3 className="text-2xl font-luxury-heading text-black mb-4">Schedule</h3>
                <p className="text-black font-luxury-body">{project.schedule}</p>
              </div>

              {/* Contact */}
              <div className="luxury-card bg-vibrant-orange/10 p-8">
                <h3 className="text-2xl font-luxury-heading text-black mb-4">Project Coordinator</h3>
                <p className="text-black font-luxury-semibold mb-2">{project.coordinator}</p>
                <p className="text-black font-luxury-body text-sm">{project.contact}</p>
              </div>

              {/* Quick Apply Button */}
              {project.status !== 'completed' && (
                <button
                  onClick={() => setShowApplication(true)}
                  className="w-full btn-luxury-primary py-4 px-6 text-lg"
                >
                  Apply for This Project
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Project Leaders Section */}
      <section className="py-16 bg-cream-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LeaderManager type="project" entityId={id || ''} isAdmin={isAdminMode} />
        </div>
      </section>

      {/* Application Modal */}
      {showApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="luxury-card bg-cream-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-luxury-heading text-black">Quick Application</h3>
              <button
                onClick={() => setShowApplication(false)}
                className="text-black hover:text-vibrant-orange text-2xl"
              >
                ×
              </button>
            </div>
            
            <p className="text-black font-luxury-body mb-6">
              Apply for: <strong>{project.title}</strong>
            </p>

            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              <div>
                <label className="block font-luxury-medium text-black mb-2">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={applicationData.name}
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
                  value={applicationData.email}
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
                  value={applicationData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
                />
              </div>

              <div>
                <label className="block font-luxury-medium text-black mb-2">Relevant Experience</label>
                <textarea
                  name="experience"
                  rows={3}
                  value={applicationData.experience}
                  onChange={handleInputChange}
                  placeholder="Briefly describe any relevant experience or skills..."
                  className="w-full px-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
                />
              </div>

              <div>
                <label className="block font-luxury-medium text-black mb-2">Why do you want to join this project?</label>
                <textarea
                  name="motivation"
                  rows={3}
                  value={applicationData.motivation}
                  onChange={handleInputChange}
                  placeholder="Tell us what motivates you to participate in this project..."
                  className="w-full px-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowApplication(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-luxury text-black font-luxury-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-luxury-primary py-3 px-6 flex items-center justify-center"
                >
                  Submit Application
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

export default ProjectDetail;