import React, { useState } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Heart, Droplets, Smartphone, Utensils, Wrench, ChevronRight, Users, Calendar, Filter, Search, Plus } from 'lucide-react';
import { db } from '../config/firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { ProjectSubmission } from '../types/submissions';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [approvedProjects, setApprovedProjects] = useState<ProjectSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const staticProjects = [
    {
      id: 'education-support',
      title: 'Education Support Program',
      description: 'Providing educational resources, tutoring, and scholarships to underprivileged children in our community.',
      icon: BookOpen,
      image: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'ongoing',
      volunteers: 45,
      beneficiaries: 200,
      duration: '12 months',
      category: 'Education',
      location: 'Karachi',
      deadline: 'April 30, 2024'
    },
    {
      id: 'healthcare-access',
      title: 'Healthcare Access Initiative',
      description: 'Improving healthcare accessibility through mobile clinics, health education, and medical assistance programs.',
      icon: Heart,
      image: 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'ongoing',
      volunteers: 32,
      beneficiaries: 500,
      duration: '18 months',
      category: 'Healthcare',
      location: 'Lahore',
      deadline: 'May 15, 2024'
    },
    {
      id: 'clean-water',
      title: 'Clean Water Project',
      description: 'Installing water purification systems and educating communities about water safety and hygiene practices.',
      icon: Droplets,
      image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'planning',
      volunteers: 25,
      beneficiaries: 300,
      duration: '24 months',
      category: 'Infrastructure',
      location: 'Islamabad',
      deadline: 'June 10, 2024'
    },
    {
      id: 'digital-literacy',
      title: 'Digital Literacy Program',
      description: 'Teaching essential digital skills to help community members access online services and opportunities.',
      icon: Smartphone,
      image: 'https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'ongoing',
      volunteers: 18,
      beneficiaries: 150,
      duration: '6 months',
      category: 'Technology',
      location: 'Faisalabad',
      deadline: 'April 20, 2024'
    },
    {
      id: 'food-distribution',
      title: 'Food Distribution Network',
      description: 'Organizing regular food drives and establishing sustainable food distribution systems for families in need.',
      icon: Utensils,
      image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'ongoing',
      volunteers: 60,
      beneficiaries: 400,
      duration: 'Ongoing',
      category: 'Food Security',
      location: 'Multiple Cities',
      deadline: 'Open Applications'
    },
    {
      id: 'skills-development',
      title: 'Skills Development Workshop',
      description: 'Providing vocational training and skill development programs to enhance employment opportunities.',
      icon: Wrench,
      image: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800',
      status: 'completed',
      volunteers: 28,
      beneficiaries: 120,
      duration: '8 months',
      category: 'Employment',
      location: 'Peshawar',
      deadline: 'Completed'
    }
  ];

  const categories = ['all', 'Education', 'Healthcare', 'Infrastructure', 'Technology', 'Food Security', 'Employment'];
  const statuses = ['all', 'ongoing', 'completed', 'planning'];

  useEffect(() => {
    fetchApprovedProjects();
  }, []);

  const fetchApprovedProjects = async () => {
    try {
      const projectsRef = collection(db, 'project_submissions');
      const q = query(
        projectsRef,
        where('status', '==', 'approved'),
        orderBy('submittedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);

      const projects: ProjectSubmission[] = querySnapshot.docs.map(doc => {
        const project = doc.data();
        return {
          id: doc.id,
          title: project.title,
          description: project.description,
          category: project.category,
          location: project.location,
          address: project.address || '',
          latitude: project.latitude,
          longitude: project.longitude,
          startDate: project.startDate,
          endDate: project.endDate,
          expectedVolunteers: project.expectedVolunteers,
          requirements: project.requirements || [],
          objectives: project.objectives || [],
          targetAudience: project.targetAudience,
          durationEstimate: project.durationEstimate,
          resourceRequirements: [],
          skillRequirements: [],
          notes: project.notes,
          checklist: [],
          reminders: [],
          contactEmail: project.contactEmail,
          contactPhone: project.contactPhone,
          budget: project.budget,
          timeline: project.timeline,
          submittedBy: project.submittedBy,
          submitterName: project.submitterName,
          submitterEmail: project.submitterEmail,
          status: project.status,
          submittedAt: project.submittedAt,
          reviewedAt: project.reviewedAt,
          reviewedBy: project.reviewedBy,
          adminComments: project.adminComments,
          rejectionReason: project.rejectionReason,
          image: project.image,
          auditTrail: []
        };
      });

      setApprovedProjects(projects);
    } catch (error) {
      console.error('Error fetching approved projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // Convert approved projects to match the expected format
  const convertedApprovedProjects = approvedProjects.map(project => ({
    id: project.id,
    title: project.title,
    description: project.description,
    icon: BookOpen, // Default icon
    image: project.image || 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=800',
    status: 'ongoing', // Map approved to ongoing for display
    volunteers: project.expectedVolunteers,
    beneficiaries: 200, // Default value
    duration: project.timeline,
    category: project.category,
    location: project.location,
    deadline: 'Open Applications'
  }));

  // Combine static projects with approved user submissions
  const allProjects = [...staticProjects, ...convertedApprovedProjects];

  const filteredProjects = allProjects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || project.status === selectedStatus;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'planning':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ongoing':
        return 'Active';
      case 'planning':
        return 'Planning';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Education':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Healthcare':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Infrastructure':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Technology':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Food Security':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Employment':
        return 'bg-green-50 text-green-700 border-green-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="hero-luxury-bg text-cream-elegant py-20 relative overflow-hidden">
        <div className="floating-3d-luxury"></div>
        <div className="floating-3d-luxury"></div>
        <div className="luxury-particle"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-6xl md:text-7xl font-luxury-display mb-8 animate-cinematic-fade">
            Our Projects
          </h1>
          <p className="text-2xl font-luxury-body max-w-4xl mx-auto">
            Transforming communities through sustainable initiatives and collaborative efforts
          </p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Project Button */}
        <div className="mb-6 flex justify-end">
          <Link
            to="/create-submission?type=project"
            className="btn-luxury-primary px-6 py-3 inline-flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Project
          </Link>
        </div>

        <div className="luxury-card bg-cream-white p-8 mb-8">
          <div className="flex items-center mb-6">
            <Filter className="w-6 h-6 text-vibrant-orange mr-3" />
            <h2 className="text-2xl font-luxury-heading text-black">Filter Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block font-luxury-medium text-black mb-2">Search Projects</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block font-luxury-medium text-black mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block font-luxury-medium text-black mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border-2 border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange focus:border-vibrant-orange font-luxury-body"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          <div className="mt-6 flex flex-wrap gap-2">
            {selectedCategory !== 'all' && (
              <span className="px-3 py-1 bg-vibrant-orange/20 text-vibrant-orange-dark rounded-full text-sm font-luxury-semibold">
                Category: {selectedCategory}
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="ml-2 text-vibrant-orange-dark hover:text-vibrant-orange"
                >
                  ×
                </button>
              </span>
            )}
            {selectedStatus !== 'all' && (
              <span className="px-3 py-1 bg-vibrant-orange/20 text-vibrant-orange-dark rounded-full text-sm font-luxury-semibold">
                Status: {selectedStatus}
                <button 
                  onClick={() => setSelectedStatus('all')}
                  className="ml-2 text-vibrant-orange-dark hover:text-vibrant-orange"
                >
                  ×
                </button>
              </span>
            )}
            {searchTerm && (
              <span className="px-3 py-1 bg-vibrant-orange/20 text-vibrant-orange-dark rounded-full text-sm font-luxury-semibold">
                Search: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-2 text-vibrant-orange-dark hover:text-vibrant-orange"
                >
                  ×
                </button>
              </span>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-4 text-black font-luxury-body">
            Showing {filteredProjects.length} of {allProjects.length} projects
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-orange mx-auto mb-4"></div>
            <p className="text-xl font-luxury-heading text-black">Loading projects...</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const IconComponent = project.icon;
            return (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="luxury-card bg-cream-white rounded-luxury-lg shadow-luxury overflow-hidden hover:shadow-luxury-lg transition-all duration-300 transform hover:-translate-y-2 group"
              >
                <div className="relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {getStatusText(project.status)}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                    <IconComponent className="w-6 h-6 text-vibrant-orange" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-sm font-medium px-3 py-1 rounded-full border ${getCategoryColor(project.category)}`}>
                      {project.category}
                    </span>
                    <span className="text-sm text-gray-500">{project.location}</span>
                  </div>
                  
                  <h3 className="text-xl font-luxury-heading text-black mb-3 group-hover:text-vibrant-orange transition-colors">
                    {project.title}
                  </h3>
                  
                  <p className="text-black font-luxury-body text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{project.volunteers} volunteers</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{project.duration}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">{project.beneficiaries}</span> people impacted
                    </div>
                    <div className="text-sm text-vibrant-orange-dark font-medium">
                      Apply by: {project.deadline}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-vibrant-orange font-medium">
                      <span className="text-sm">Learn More</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        )}

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-luxury-heading text-black mb-4">No Projects Found</h3>
            <p className="text-black font-luxury-body mb-6">
              Try adjusting your filters or search terms to find more projects.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedStatus('all');
                setSearchTerm('');
              }}
              className="btn-luxury-primary px-6 py-3"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Statistics Section */}
      <div className="bg-cream-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-luxury-display text-black mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-black font-luxury-body">
              Together, we're making a measurable difference in our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center luxury-hover-scale">
              <div className="text-5xl font-luxury-display text-vibrant-orange mb-2">6</div>
              <div className="text-black font-luxury-body">Active Projects</div>
            </div>
            <div className="text-center luxury-hover-scale">
              <div className="text-5xl font-luxury-display text-vibrant-orange mb-2">208</div>
              <div className="text-black font-luxury-body">Volunteers</div>
            </div>
            <div className="text-center luxury-hover-scale">
              <div className="text-5xl font-luxury-display text-vibrant-orange mb-2">1,670</div>
              <div className="text-black font-luxury-body">People Helped</div>
            </div>
            <div className="text-center luxury-hover-scale">
              <div className="text-5xl font-luxury-display text-vibrant-orange mb-2">12</div>
              <div className="text-black font-luxury-body">Communities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-parallax py-16 text-cream-elegant relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl font-luxury-display mb-6">
            Join Our Mission
          </h2>
          <p className="text-xl text-cream-elegant/80 font-luxury-body mb-8">
            Be part of meaningful projects that create lasting positive change in communities
          </p>
          <Link
            to="/volunteer"
            className="btn-luxury-primary text-lg px-8 py-4 inline-flex items-center"
          >
            Get Involved
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Projects;