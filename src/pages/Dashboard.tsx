import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar, Target, Heart, TrendingUp, Clock, MapPin, Users, Award, Settings, Bell, BookOpen, Activity, Star, ChevronRight, Filter, Search, Plus, FileText, Eye, CreditCard as Edit3, CheckCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { ProjectSubmission, EventSubmission, SubmissionStatus } from '../types/submissions';
import DraftsList from '../components/DraftsList';

interface DashboardActivity {
  id: string;
  action: string;
  page: string;
  timestamp: any;
  details?: any;
}

interface UserStats {
  projectsJoined: number;
  eventsAttended: number;
  hoursVolunteered: number;
  impactScore: number;
}

type SubmissionWithType = (ProjectSubmission | EventSubmission) & {
  submissionType: 'project' | 'event';
};

const Dashboard = () => {
  const { userData, currentUser } = useAuth();
  const { currentTheme } = useTheme();
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [stats, setStats] = useState<UserStats>({
    projectsJoined: 0,
    eventsAttended: 0,
    hoursVolunteered: 0,
    impactScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [submissions, setSubmissions] = useState<SubmissionWithType[]>([]);
  const [drafts, setDrafts] = useState<SubmissionWithType[]>([]);

  useEffect(() => {
    if (currentUser && userData) {
      fetchUserActivities();
      calculateUserStats();
      setupRealtimeListeners();
    }
  }, [currentUser, userData]);

  const setupRealtimeListeners = () => {
    if (!currentUser) return;

    const projectQuery = query(
      collection(db, 'project_submissions'),
      where('submittedBy', '==', currentUser.uid),
      orderBy('submittedAt', 'desc')
    );

    const eventQuery = query(
      collection(db, 'event_submissions'),
      where('submittedBy', '==', currentUser.uid),
      orderBy('submittedAt', 'desc')
    );

    const unsubscribeProjects = onSnapshot(projectQuery, (snapshot) => {
      const projectSubmissions: SubmissionWithType[] = [];
      const projectDrafts: SubmissionWithType[] = [];

      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data(), submissionType: 'project' as const };
        if (data.status === 'draft') {
          projectDrafts.push(data as SubmissionWithType);
        } else {
          projectSubmissions.push(data as SubmissionWithType);
        }
      });

      setSubmissions(prev => [...prev.filter(s => s.submissionType !== 'project'), ...projectSubmissions]);
      setDrafts(prev => [...prev.filter(d => d.submissionType !== 'project'), ...projectDrafts]);
    });

    const unsubscribeEvents = onSnapshot(eventQuery, (snapshot) => {
      const eventSubmissions: SubmissionWithType[] = [];
      const eventDrafts: SubmissionWithType[] = [];

      snapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data(), submissionType: 'event' as const };
        if (data.status === 'draft') {
          eventDrafts.push(data as SubmissionWithType);
        } else {
          eventSubmissions.push(data as SubmissionWithType);
        }
      });

      setSubmissions(prev => [...prev.filter(s => s.submissionType !== 'event'), ...eventSubmissions]);
      setDrafts(prev => [...prev.filter(d => d.submissionType !== 'event'), ...eventDrafts]);
    });

    return () => {
      unsubscribeProjects();
      unsubscribeEvents();
    };
  };

  const fetchUserActivities = async () => {
    if (!currentUser) return;
    
    try {
      // Get recent activities from user's activity log
      const activities = userData?.activityLog?.slice(-10) || [];
      setActivities(activities.reverse());
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateUserStats = () => {
    // Calculate stats based on user activities and preferences
    const activityCount = userData?.activityLog?.length || 0;
    const interests = userData?.preferences?.interests?.length || 0;
    
    setStats({
      projectsJoined: Math.floor(activityCount / 10), // Simulate projects joined
      eventsAttended: Math.floor(activityCount / 15), // Simulate events attended
      hoursVolunteered: Math.floor(activityCount * 2.5), // Simulate hours
      impactScore: Math.min(100, activityCount * 5 + interests * 10) // Impact score
    });
  };

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'page_visit': return <Activity className="w-4 h-4" />;
      case 'volunteer_application_submitted': return <Users className="w-4 h-4" />;
      case 'contact_form_submitted': return <Bell className="w-4 h-4" />;
      case 'event_registration': return <Calendar className="w-4 h-4" />;
      case 'project_application': return <Target className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityDescription = (activity: DashboardActivity) => {
    switch (activity.action) {
      case 'page_visit':
        return `Visited ${activity.page}`;
      case 'volunteer_application_submitted':
        return 'Submitted volunteer application';
      case 'contact_form_submitted':
        return 'Sent a contact message';
      case 'event_registration':
        return 'Registered for an event';
      case 'project_application':
        return 'Applied to join a project';
      default:
        return activity.action.replace(/_/g, ' ');
    }
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const quickActions = [
    {
      title: 'Find Projects',
      description: 'Discover new volunteer opportunities',
      icon: Target,
      link: '/projects',
      color: 'bg-blue-500'
    },
    {
      title: 'Upcoming Events',
      description: 'Join community events',
      icon: Calendar,
      link: '/events',
      color: 'bg-green-500'
    },
    {
      title: 'Apply to Volunteer',
      description: 'Start your volunteer journey',
      icon: Heart,
      link: '/volunteer',
      color: 'bg-red-500'
    },
    {
      title: 'Get Support',
      description: 'Contact our team',
      icon: Users,
      link: '/contact',
      color: 'bg-purple-500'
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: 'Community Health Fair',
      date: '2024-04-15',
      time: '9:00 AM',
      location: 'Central Community Center',
      participants: 150
    },
    {
      id: 2,
      title: 'Educational Workshop Series',
      date: '2024-04-20',
      time: '2:00 PM',
      location: 'Waseela Training Center',
      participants: 80
    }
  ];

  const recommendedProjects = [
    {
      id: 1,
      title: 'Education Support Program',
      category: 'Education',
      volunteers: 45,
      match: 95
    },
    {
      id: 2,
      title: 'Digital Literacy Workshop',
      category: 'Technology',
      volunteers: 25,
      match: 88
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-orange mx-auto mb-4"></div>
          <p className="text-xl font-luxury-heading text-black">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="luxury-card bg-white p-8 relative overflow-hidden">
            <div 
              className="absolute inset-0 opacity-10"
              style={{ background: currentTheme.colors.primary }}
            ></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-luxury-display text-black mb-2">
                    Welcome back, {userData?.displayName || 'Friend'}! 👋
                  </h1>
                  <p className="text-xl text-black/70 font-luxury-body">
                    Ready to make a difference today?
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-luxury-display" style={{ color: currentTheme.colors.primary }}>
                    {stats.impactScore}
                  </div>
                  <div className="text-sm text-black/70">Impact Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="luxury-card bg-white p-6 text-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
            >
              <Target className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
            </div>
            <div className="text-2xl font-luxury-display text-black mb-1">{stats.projectsJoined}</div>
            <div className="text-sm text-black/70">Projects Joined</div>
          </div>

          <div className="luxury-card bg-white p-6 text-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${currentTheme.colors.accent}20` }}
            >
              <Calendar className="w-6 h-6" style={{ color: currentTheme.colors.accent }} />
            </div>
            <div className="text-2xl font-luxury-display text-black mb-1">{stats.eventsAttended}</div>
            <div className="text-sm text-black/70">Events Attended</div>
          </div>

          <div className="luxury-card bg-white p-6 text-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${currentTheme.colors.secondary}20` }}
            >
              <Clock className="w-6 h-6" style={{ color: currentTheme.colors.secondary }} />
            </div>
            <div className="text-2xl font-luxury-display text-black mb-1">{stats.hoursVolunteered}</div>
            <div className="text-sm text-black/70">Hours Volunteered</div>
          </div>

          <div className="luxury-card bg-white p-6 text-center">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
            >
              <Award className="w-6 h-6" style={{ color: currentTheme.colors.primary }} />
            </div>
            <div className="text-2xl font-luxury-display text-black mb-1">{stats.impactScore}</div>
            <div className="text-sm text-black/70">Impact Score</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="luxury-card bg-white p-8">
              <h2 className="text-2xl font-luxury-heading text-black mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    to={action.link}
                    className="p-6 rounded-luxury border-2 border-gray-200 hover:border-vibrant-orange transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 ${action.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-luxury-heading text-black group-hover:text-vibrant-orange transition-colors">
                          {action.title}
                        </h3>
                        <p className="text-sm text-black/70">{action.description}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-vibrant-orange transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="luxury-card bg-white p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-luxury-heading text-black">Recent Activity</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setActiveFilter('all')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === 'all' 
                        ? 'bg-vibrant-orange text-white' 
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveFilter('applications')}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      activeFilter === 'applications' 
                        ? 'bg-vibrant-orange text-white' 
                        : 'bg-gray-100 text-black hover:bg-gray-200'
                    }`}
                  >
                    Applications
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {activities.length > 0 ? (
                  activities.map((activity, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-luxury">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${currentTheme.colors.primary}20` }}
                      >
                        {getActivityIcon(activity.action)}
                      </div>
                      <div className="flex-1">
                        <p className="text-black font-luxury-body">{getActivityDescription(activity)}</p>
                        <p className="text-sm text-black/70">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-black/70">No recent activity. Start exploring to see your activity here!</p>
                  </div>
                )}
              </div>
            </div>

            {/* My Submissions */}
            <div className="luxury-card bg-white p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-luxury-heading text-black">My Submissions</h2>
                <Link
                  to="/create-submission"
                  className="text-vibrant-orange hover:text-vibrant-orange-dark text-sm font-medium flex items-center"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  New Submission
                </Link>
              </div>

              {submissions.length > 0 ? (
                <div className="space-y-4">
                  {submissions.map((submission) => {
                    const getStatusColor = (status: SubmissionStatus) => {
                      switch (status) {
                        case 'pending': return 'bg-yellow-100 text-yellow-800';
                        case 'approved': return 'bg-green-100 text-green-800';
                        case 'rejected': return 'bg-red-100 text-red-800';
                        default: return 'bg-gray-100 text-gray-800';
                      }
                    };

                    return (
                      <div key={submission.id} className="p-4 border-2 border-gray-200 rounded-luxury hover:border-vibrant-orange transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-luxury-heading text-black">{submission.title}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </div>
                        <p className="text-sm text-black/70 font-luxury-body mb-2 line-clamp-2">{submission.description}</p>
                        <div className="flex items-center justify-between text-xs text-black/70">
                          <span className="font-luxury-body">
                            {submission.submissionType.charAt(0).toUpperCase() + submission.submissionType.slice(1)}
                          </span>
                          <span className="font-luxury-body">
                            {submission.submittedAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                          </span>
                        </div>
                        {submission.adminComments && (
                          <div className="mt-3 p-2 bg-blue-50 rounded text-xs">
                            <strong className="text-black">Admin Note:</strong> {submission.adminComments}
                          </div>
                        )}
                        {submission.rejectionReason && (
                          <div className="mt-3 p-2 bg-red-50 rounded text-xs">
                            <strong className="text-red-700">Rejection Reason:</strong> {submission.rejectionReason}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-black/70 mb-4">No submissions yet</p>
                  <Link to="/create-submission" className="btn-luxury-primary inline-flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Submission
                  </Link>
                </div>
              )}
            </div>

            {/* My Drafts */}
            <DraftsList drafts={drafts} />
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div className="luxury-card bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-luxury-heading text-black">Upcoming Events</h3>
                <Link to="/events" className="text-vibrant-orange hover:text-vibrant-orange-dark text-sm font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="p-4 bg-gray-50 rounded-luxury">
                    <h4 className="font-luxury-semibold text-black text-sm mb-2">{event.title}</h4>
                    <div className="space-y-1 text-xs text-black/70">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-2" />
                        {event.participants} expected
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Projects */}
            <div className="luxury-card bg-white p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-luxury-heading text-black">Recommended for You</h3>
                <Link to="/projects" className="text-vibrant-orange hover:text-vibrant-orange-dark text-sm font-medium">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recommendedProjects.map((project) => (
                  <div key={project.id} className="p-4 bg-gray-50 rounded-luxury">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-luxury-semibold text-black text-sm">{project.title}</h4>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-500 mr-1" />
                        <span className="text-xs text-black/70">{project.match}% match</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-xs text-black/70">
                      <div className="flex items-center justify-between">
                        <span>{project.category}</span>
                        <span>{project.volunteers} volunteers</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="luxury-card bg-gradient-to-br from-vibrant-orange/10 to-vibrant-orange-light/10 p-6">
              <h3 className="text-lg font-luxury-heading text-black mb-4">Complete Your Profile</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">Basic Info</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">Interests</span>
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-black">Skills</span>
                  <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
                </div>
              </div>
              <Link 
                to="/volunteer" 
                className="block w-full text-center mt-4 px-4 py-2 bg-vibrant-orange text-white rounded-luxury hover:bg-vibrant-orange-dark transition-colors text-sm font-medium"
              >
                Complete Profile
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;