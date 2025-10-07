import React, { useState, useEffect } from 'react';
import { Users, MessageSquare, Mail, Calendar, Target, Settings, CreditCard as Edit3, Save, X, Plus, Trash2, Eye, Download, CheckCircle, XCircle, Clock, FileText, Mail as MailIcon } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ProjectSubmission, EventSubmission, SubmissionStatus } from '../types/submissions';
import { sendEmail, formatSubmissionStatusUpdateEmail } from '../utils/emailService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Response {
  id: string;
  type: 'volunteer' | 'contact' | 'chat' | 'event' | 'project';
  data: any;
  timestamp: any;
  status: 'new' | 'reviewed' | 'responded';
}

interface EditableContent {
  id: string;
  section: string;
  content: string;
  type: 'text' | 'html';
}

type SubmissionWithType = (ProjectSubmission | EventSubmission) & {
  submissionType: 'project' | 'event';
};

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('responses');
  const [responses, setResponses] = useState<Response[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionWithType[]>([]);
  const [editableContent, setEditableContent] = useState<EditableContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingContent, setEditingContent] = useState<string | null>(null);
  const [reviewingSubmission, setReviewingSubmission] = useState<string | null>(null);
  const [adminComments, setAdminComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Community'
  });
  const [showNewEventForm, setShowNewEventForm] = useState(false);

  const { isAdmin } = useAuth();

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchResponses();
      fetchSubmissions();
      fetchEditableContent();
    }
  }, [isOpen, isAdmin]);

  const fetchResponses = async () => {
    setLoading(true);
    try {
      const collections = ['volunteers', 'contacts', 'chats', 'events', 'projects'];
      const allResponses: Response[] = [];

      for (const collectionName of collections) {
        const q = query(collection(db, collectionName), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        
        querySnapshot.forEach((doc) => {
          allResponses.push({
            id: doc.id,
            type: collectionName.slice(0, -1) as any,
            data: doc.data(),
            timestamp: doc.data().timestamp,
            status: doc.data().status || 'new'
          });
        });
      }

      allResponses.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);
      setResponses(allResponses);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const allSubmissions: SubmissionWithType[] = [];

      // Fetch project submissions
      const projectQuery = query(collection(db, 'projectSubmissions'), orderBy('submittedAt', 'desc'));
      const projectSnapshot = await getDocs(projectQuery);
      projectSnapshot.forEach((doc) => {
        allSubmissions.push({
          id: doc.id,
          ...doc.data(),
          submissionType: 'project'
        } as SubmissionWithType);
      });

      // Fetch event submissions
      const eventQuery = query(collection(db, 'eventSubmissions'), orderBy('submittedAt', 'desc'));
      const eventSnapshot = await getDocs(eventQuery);
      eventSnapshot.forEach((doc) => {
        allSubmissions.push({
          id: doc.id,
          ...doc.data(),
          submissionType: 'event'
        } as SubmissionWithType);
      });

      // Sort by submission date
      allSubmissions.sort((a, b) => b.submittedAt?.seconds - a.submittedAt?.seconds);
      setSubmissions(allSubmissions);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEditableContent = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'editableContent'));
      const content: EditableContent[] = [];
      
      querySnapshot.forEach((doc) => {
        content.push({
          id: doc.id,
          ...doc.data()
        } as EditableContent);
      });
      
      setEditableContent(content);
    } catch (error) {
      console.error('Error fetching editable content:', error);
    }
  };

  const updateResponseStatus = async (responseId: string, status: 'new' | 'reviewed' | 'responded') => {
    try {
      const response = responses.find(r => r.id === responseId);
      if (response) {
        const collectionName = response.type + 's';
        await updateDoc(doc(db, collectionName, responseId), { status });
        
        setResponses(prev => 
          prev.map(r => r.id === responseId ? { ...r, status } : r)
        );
      }
    } catch (error) {
      console.error('Error updating response status:', error);
    }
  };

  const updateSubmissionStatus = async (submissionId: string, submissionType: 'project' | 'event', status: SubmissionStatus, comments?: string, reason?: string) => {
    try {
      const collectionName = submissionType === 'project' ? 'projectSubmissions' : 'eventSubmissions';
      const submission = submissions.find(s => s.id === submissionId);
      
      if (!submission) return;

      const updateData: any = {
        status,
        reviewedAt: new Date(),
        reviewedBy: currentUser?.uid,
        adminComments: comments || '',
        rejectionReason: reason || '',
        auditTrail: [
          ...submission.auditTrail,
          {
            action: `Status changed to ${status}`,
            performedBy: currentUser?.uid,
            performedAt: new Date(),
            details: comments || reason || `Submission ${status}`,
            previousStatus: submission.status,
            newStatus: status
          }
        ]
      };

      await updateDoc(doc(db, collectionName, submissionId), updateData);
      
      // Send email notification to user
      await sendEmail(formatSubmissionStatusUpdateEmail({
        type: submissionType,
        title: submission.title,
        submitterName: submission.submitterName,
        submitterEmail: submission.submitterEmail,
        status: status as 'approved' | 'rejected',
        adminComments: comments,
        rejectionReason: reason,
        timestamp: new Date().toISOString()
      }));
      
      // Update local state
      setSubmissions(prev => 
        prev.map(s => s.id === submissionId ? { ...s, status, adminComments: comments, rejectionReason: reason } : s)
      );
      
      setReviewingSubmission(null);
      setAdminComments('');
      setRejectionReason('');
      
      alert(`Submission ${status} successfully!`);
    } catch (error) {
      console.error('Error updating submission status:', error);
      alert('Error updating submission status. Please try again.');
    }
  };

  const updateContent = async (contentId: string, newContent: string) => {
    try {
      await updateDoc(doc(db, 'editableContent', contentId), {
        content: newContent,
        lastUpdated: new Date()
      });
      
      setEditableContent(prev =>
        prev.map(c => c.id === contentId ? { ...c, content: newContent } : c)
      );
      
      setEditingContent(null);
    } catch (error) {
      console.error('Error updating content:', error);
    }
  };

  const addNewEvent = async () => {
    try {
      await addDoc(collection(db, 'events'), {
        ...newEvent,
        createdAt: new Date(),
        status: 'active'
      });
      
      setNewEvent({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Community'
      });
      setShowNewEventForm(false);
      
      alert('Event added successfully!');
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Error adding event. Please try again.');
    }
  };

  const exportResponses = () => {
    const csvContent = responses.map(response => ({
      Type: response.type,
      Status: response.status,
      Date: response.timestamp?.toDate?.()?.toLocaleDateString() || 'N/A',
      Data: JSON.stringify(response.data)
    }));

    const csv = [
      Object.keys(csvContent[0]).join(','),
      ...csvContent.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wasilah-responses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getSubmissionStatusColor = (status: SubmissionStatus) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSubmissionTypeColor = (type: 'project' | 'event') => {
    return type === 'project' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-purple-100 text-purple-800';
  };

  if (!isOpen || !isAdmin) return null;

  const getResponseTypeColor = (type: string) => {
    switch (type) {
      case 'volunteer': return 'bg-green-100 text-green-800';
      case 'contact': return 'bg-blue-100 text-blue-800';
      case 'chat': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-orange-100 text-orange-800';
      case 'project': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-red-100 text-red-800';
      case 'reviewed': return 'bg-yellow-100 text-yellow-800';
      case 'responded': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream-white w-full max-w-6xl h-[90vh] rounded-luxury-lg shadow-luxury overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-logo-navy to-logo-navy-light text-cream-elegant p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-luxury-display">Admin Panel</h2>
            <p className="text-cream-elegant/80">Manage your Wasilah website</p>
          </div>
          <button
            onClick={onClose}
            className="text-cream-elegant hover:bg-white/20 p-2 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-200 bg-cream-elegant">
          {[
            { id: 'responses', label: 'Responses', icon: MessageSquare },
            { id: 'submissions', label: 'Submissions', icon: FileText },
            { id: 'content', label: 'Edit Content', icon: Edit3 },
            { id: 'events', label: 'Manage Events', icon: Calendar },
            { id: 'users', label: 'User Activity', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 font-luxury-semibold transition-colors ${
                activeTab === tab.id
                  ? 'text-vibrant-orange border-b-2 border-vibrant-orange bg-cream-white'
                  : 'text-black hover:text-vibrant-orange'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Responses Tab */}
          {activeTab === 'responses' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-luxury-heading text-black">All Responses</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={exportResponses}
                    className="flex items-center px-4 py-2 bg-vibrant-orange text-white rounded-luxury hover:bg-vibrant-orange-dark transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </button>
                  <button
                    onClick={fetchResponses}
                    className="flex items-center px-4 py-2 bg-logo-navy text-cream-elegant rounded-luxury hover:bg-logo-navy-light transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-orange mx-auto"></div>
                  <p className="mt-4 text-black">Loading responses...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {responses.map((response) => (
                    <div key={response.id} className="luxury-card bg-cream-white p-6 border-l-4 border-vibrant-orange">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getResponseTypeColor(response.type)}`}>
                            {response.type.charAt(0).toUpperCase() + response.type.slice(1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(response.status)}`}>
                            {response.status.charAt(0).toUpperCase() + response.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {response.timestamp?.toDate?.()?.toLocaleDateString() || 'N/A'}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateResponseStatus(response.id, 'reviewed')}
                            className="text-yellow-600 hover:text-yellow-800"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateResponseStatus(response.id, 'responded')}
                            className="text-green-600 hover:text-green-800"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="text-black">
                        {response.type === 'volunteer' && (
                          <div>
                            <p><strong>Name:</strong> {response.data.firstName} {response.data.lastName}</p>
                            <p><strong>Email:</strong> {response.data.email}</p>
                            <p><strong>Phone:</strong> {response.data.phone}</p>
                            <p><strong>City:</strong> {response.data.city}</p>
                            <p><strong>Skills:</strong> {response.data.skills?.join(', ') || 'None'}</p>
                            <p><strong>Interests:</strong> {response.data.interests?.join(', ') || 'None'}</p>
                          </div>
                        )}
                        
                        {response.type === 'contact' && (
                          <div>
                            <p><strong>Name:</strong> {response.data.name}</p>
                            <p><strong>Email:</strong> {response.data.email}</p>
                            <p><strong>Subject:</strong> {response.data.subject}</p>
                            <p><strong>Message:</strong> {response.data.message}</p>
                            <div className="mt-4">
                              <a
                                href={`mailto:${response.data.email}?subject=Re: ${encodeURIComponent(response.data.subject)}`}
                                className="inline-flex items-center px-4 py-2 bg-vibrant-orange text-white rounded-luxury hover:bg-vibrant-orange-dark transition-colors text-sm"
                              >
                                <MailIcon className="w-4 h-4 mr-2" />
                                Reply via Email
                              </a>
                            </div>
                          </div>
                        )}
                        
                        {response.type === 'chat' && (
                          <div>
                            <p><strong>Message:</strong> {response.data.message}</p>
                            <p><strong>Page:</strong> {response.data.page}</p>
                            {response.data.timestamp && (
                              <p className="text-xs text-gray-500 mt-2">
                                <strong>Time:</strong> {new Date(response.data.timestamp).toLocaleString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Submissions Tab */}
          {activeTab === 'submissions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-luxury-heading text-black">Content Submissions</h3>
                <div className="flex space-x-3">
                  <button
                    onClick={fetchSubmissions}
                    className="flex items-center px-4 py-2 bg-logo-navy text-cream-elegant rounded-luxury hover:bg-logo-navy-light transition-colors"
                  >
                    Refresh
                  </button>
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex space-x-2 mb-6">
                {['all', 'pending', 'approved', 'rejected', 'draft'].map((status) => (
                  <button
                    key={status}
                    className={`px-4 py-2 rounded-luxury font-luxury-semibold transition-colors ${
                      status === 'all' ? 'bg-vibrant-orange text-white' : 'bg-gray-200 text-black hover:bg-gray-300'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-vibrant-orange mx-auto"></div>
                  <p className="mt-4 text-black">Loading submissions...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission.id} className="luxury-card bg-cream-white p-6 border-l-4 border-vibrant-orange">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubmissionTypeColor(submission.submissionType)}`}>
                            {submission.submissionType.charAt(0).toUpperCase() + submission.submissionType.slice(1)}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSubmissionStatusColor(submission.status)}`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {submission.submittedAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                          </span>
                        </div>
                        
                        {submission.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => setReviewingSubmission(reviewingSubmission === submission.id ? null : submission.id)}
                              className="text-blue-600 hover:text-blue-800 flex items-center px-3 py-1 bg-blue-50 rounded-luxury"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </button>
                            <button
                              onClick={() => updateSubmissionStatus(submission.id, submission.submissionType, 'approved')}
                              className="text-green-600 hover:text-green-800 flex items-center px-3 py-1 bg-green-50 rounded-luxury"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </button>
                          </div>
                        )}
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="text-xl font-luxury-heading text-black mb-2">{submission.title}</h4>
                        <p className="text-black/70 font-luxury-body mb-2">{submission.description}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-black">
                          <div>
                            <strong>Category:</strong> {submission.category}
                          </div>
                          <div>
                            <strong>Location:</strong> {submission.location}
                          </div>
                          <div>
                            <strong>Submitted by:</strong> {submission.submitterName}
                          </div>
                          <div>
                            <strong>Contact:</strong> {submission.submitterEmail}
                          </div>
                        </div>
                      </div>

                      {/* Review Form */}
                      {reviewingSubmission === submission.id && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-luxury">
                          <h5 className="text-lg font-luxury-heading text-black mb-4">Review Submission</h5>
                          
                          <div className="space-y-4">
                            <div>
                              <label className="block font-luxury-medium text-black mb-2">Admin Comments</label>
                              <textarea
                                value={adminComments}
                                onChange={(e) => setAdminComments(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-luxury font-luxury-body"
                                rows={3}
                                placeholder="Add comments for the submitter..."
                              />
                            </div>
                            
                            <div>
                              <label className="block font-luxury-medium text-black mb-2">Rejection Reason (if rejecting)</label>
                              <input
                                type="text"
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-luxury font-luxury-body"
                                placeholder="Brief reason for rejection..."
                              />
                            </div>
                            
                            <div className="flex space-x-3">
                              <button
                                onClick={() => updateSubmissionStatus(submission.id, submission.submissionType, 'approved', adminComments)}
                                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-luxury hover:bg-green-700 transition-colors"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approve
                              </button>
                              <button
                                onClick={() => updateSubmissionStatus(submission.id, submission.submissionType, 'rejected', adminComments, rejectionReason)}
                                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-luxury hover:bg-red-700 transition-colors"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </button>
                              <button
                                onClick={() => {
                                  setReviewingSubmission(null);
                                  setAdminComments('');
                                  setRejectionReason('');
                                }}
                                className="flex items-center px-4 py-2 bg-gray-300 text-black rounded-luxury hover:bg-gray-400 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Show admin comments and rejection reason if exists */}
                      {(submission.adminComments || submission.rejectionReason) && (
                        <div className="mt-4 p-4 bg-yellow-50 rounded-luxury">
                          {submission.adminComments && (
                            <div className="mb-2">
                              <strong className="text-black">Admin Comments:</strong>
                              <p className="text-black/70">{submission.adminComments}</p>
                            </div>
                          )}
                          {submission.rejectionReason && (
                            <div>
                              <strong className="text-red-700">Rejection Reason:</strong>
                              <p className="text-red-600">{submission.rejectionReason}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {submissions.length === 0 && (
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-luxury-heading text-black mb-2">No Submissions Yet</h3>
                      <p className="text-black/70">User submissions will appear here for review.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Content Management Tab */}
          {activeTab === 'content' && (
            <div>
              <h3 className="text-2xl font-luxury-heading text-black mb-6">Edit Website Content</h3>
              
              <div className="space-y-6">
                {editableContent.map((content) => (
                  <div key={content.id} className="luxury-card bg-cream-white p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-luxury-heading text-black">{content.section}</h4>
                      <button
                        onClick={() => setEditingContent(editingContent === content.id ? null : content.id)}
                        className="flex items-center px-3 py-1 text-vibrant-orange hover:bg-vibrant-orange/10 rounded-luxury transition-colors"
                      >
                        <Edit3 className="w-4 h-4 mr-1" />
                        Edit
                      </button>
                    </div>
                    
                    {editingContent === content.id ? (
                      <div>
                        <textarea
                          value={content.content}
                          onChange={(e) => setEditableContent(prev =>
                            prev.map(c => c.id === content.id ? { ...c, content: e.target.value } : c)
                          )}
                          className="w-full h-32 p-3 border border-gray-300 rounded-luxury font-luxury-body"
                        />
                        <div className="flex space-x-2 mt-3">
                          <button
                            onClick={() => updateContent(content.id, content.content)}
                            className="flex items-center px-4 py-2 bg-vibrant-orange text-white rounded-luxury hover:bg-vibrant-orange-dark transition-colors"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </button>
                          <button
                            onClick={() => setEditingContent(null)}
                            className="flex items-center px-4 py-2 bg-gray-300 text-black rounded-luxury hover:bg-gray-400 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-black font-luxury-body">
                        {content.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Events Management Tab */}
          {activeTab === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-luxury-heading text-black">Manage Events</h3>
                <button
                  onClick={() => setShowNewEventForm(true)}
                  className="flex items-center px-4 py-2 bg-vibrant-orange text-white rounded-luxury hover:bg-vibrant-orange-dark transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Event
                </button>
              </div>

              {showNewEventForm && (
                <div className="luxury-card bg-cream-white p-6 mb-6">
                  <h4 className="text-lg font-luxury-heading text-black mb-4">Add New Event</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Event Title"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-luxury font-luxury-body"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, location: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-luxury font-luxury-body"
                    />
                    <input
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-luxury font-luxury-body"
                    />
                    <input
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-luxury font-luxury-body"
                    />
                    <select
                      value={newEvent.category}
                      onChange={(e) => setNewEvent(prev => ({ ...prev, category: e.target.value }))}
                      className="px-4 py-3 border border-gray-300 rounded-luxury font-luxury-body"
                    >
                      <option value="Community">Community</option>
                      <option value="Health">Health</option>
                      <option value="Education">Education</option>
                      <option value="Environment">Environment</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Event Description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full mt-4 px-4 py-3 border border-gray-300 rounded-luxury font-luxury-body h-24"
                  />
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={addNewEvent}
                      className="flex items-center px-4 py-2 bg-vibrant-orange text-white rounded-luxury hover:bg-vibrant-orange-dark transition-colors"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Event
                    </button>
                    <button
                      onClick={() => setShowNewEventForm(false)}
                      className="flex items-center px-4 py-2 bg-gray-300 text-black rounded-luxury hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;