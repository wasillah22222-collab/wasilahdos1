import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Lightbulb, Calendar, Users } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { sendEmail, formatChatMessageEmail, formatEventProjectIdeaEmail } from '../utils/emailService';
import { useAuth } from '../contexts/AuthContext';
import { useActivityLogger } from '../hooks/useActivityLogger';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatWidget = () => {
  const { logCustomActivity } = useActivityLogger();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEventProjectForm, setShowEventProjectForm] = useState(false);
  const [eventProjectData, setEventProjectData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'event',
    title: '',
    description: '',
    location: '',
    expectedParticipants: '',
    budget: '',
    timeline: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  
  const isEventsOrProjectsPage = location.pathname === '/events' || location.pathname === '/projects';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      if (messages.length === 0) {
        // Welcome message
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: `Hello! 👋 Welcome to Wasilah. I'm here to help you with any questions about our community service initiatives. How can I assist you today?`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      }

      // Scroll widget into view and center it
      if (widgetRef.current) {
        widgetRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }, [isOpen]);

  const getAutomatedReply = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('volunteer') || message.includes('join')) {
      return "That's wonderful! 🌟 We're always looking for passionate volunteers. You can apply through our 'Join Us' page or I can help connect you with our volunteer coordinator. What type of volunteer work interests you most?";
    }
    
    if (message.includes('event') || message.includes('program')) {
      return "Great question about our events! 📅 We organize various community events including health fairs, educational workshops, and environmental initiatives. Check our Events page for upcoming activities, or let me know what specific type of event you're interested in.";
    }
    
    if (message.includes('project') || message.includes('initiative')) {
      return "Our projects focus on education, healthcare, environment, and community development. 🎯 Each project is designed to create lasting positive impact. Would you like to know about a specific project or how to get involved?";
    }
    
    if (message.includes('donate') || message.includes('support') || message.includes('help')) {
      return "Thank you for wanting to support our mission! ❤️ There are many ways to help - volunteering, spreading awareness, or contributing resources. Our team can discuss the best ways you can make an impact. What type of support were you thinking about?";
    }
    
    if (message.includes('contact') || message.includes('reach') || message.includes('phone')) {
      return "You can reach us through multiple channels! 📞 Check our Contact page for office locations and phone numbers, or email us directly. Our team typically responds within 24 hours. Is there something specific you'd like to discuss?";
    }
    
    if (message.includes('location') || message.includes('where') || message.includes('office')) {
      return "We have offices in Karachi, Lahore, and Islamabad! 📍 Our projects span across multiple cities in Pakistan. You can find detailed addresses and contact information on our Contact page. Which city are you interested in?";
    }
    
    return "Thank you for your message! 😊 I've forwarded your query to our team, and someone will get back to you within 24 hours. In the meantime, feel free to explore our website or ask me anything else about Wasilah's mission and programs.";
  };

  const sendEmailNotification = async (type: 'chat' | 'event-project', data: any) => {
    try {
      let emailData;
      
      if (type === 'chat') {
        emailData = formatChatMessageEmail(data);
      } else {
        emailData = formatEventProjectIdeaEmail(data);
      }
      
      return await sendEmail(emailData);
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Log activity
    logCustomActivity('chat_message_sent', { message: inputText });

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Send email notification
    await sendEmailNotification('chat', {
      message: inputText,
      timestamp: new Date().toISOString(),
      page: location.pathname,
      userAgent: navigator.userAgent
    });

    // Simulate bot response delay
    setTimeout(() => {
      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutomatedReply(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botReply]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEventProjectInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEventProjectData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Log activity
    logCustomActivity('event_project_idea_submitted', eventProjectData);

    // Send email notification
    const emailSent = await sendEmailNotification('event-project', {
      ...eventProjectData,
      timestamp: new Date().toISOString(),
      page: location.pathname
    });

    if (emailSent) {
      // Add success message to chat
      const successMessage: Message = {
        id: Date.now().toString(),
        text: `Thank you ${eventProjectData.name}! 🎉 Your ${eventProjectData.type} idea "${eventProjectData.title}" has been submitted successfully. Our team will review it and get back to you within 2-3 business days. We appreciate your initiative in contributing to our community!`,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, successMessage]);
      setEventProjectData({
        name: '',
        email: '',
        phone: '',
        type: 'event',
        title: '',
        description: '',
        location: '',
        expectedParticipants: '',
        budget: '',
        timeline: ''
      });
      setShowEventProjectForm(false);
    }
    
    setIsLoading(false);
  };

  return (
    <>
      {/* Chat Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-[calc(50%-100px)] z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-vibrant-orange to-vibrant-orange-light text-white w-16 h-16 rounded-full shadow-luxury-glow flex items-center justify-center hover:scale-110 transition-all duration-300 animate-pulse"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      </div>

      {/* Chat Widget */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[60] backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div
            ref={widgetRef}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-md h-[90vh] max-h-[600px] luxury-card bg-cream-white rounded-luxury-lg shadow-luxury-lg overflow-hidden flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Header */}
          <div className="bg-gradient-to-r from-vibrant-orange to-vibrant-orange-light text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-luxury-heading text-lg">Wasilah Support</h3>
                <p className="text-sm opacity-90">We're here to help!</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Actions (for Events/Projects pages) */}
          {isEventsOrProjectsPage && !showEventProjectForm && (
            <div className="p-4 bg-cream-elegant border-b">
              <p className="text-sm text-black font-luxury-body mb-3">Have an idea?</p>
              <button
                onClick={() => setShowEventProjectForm(true)}
                className="w-full bg-vibrant-orange/10 text-vibrant-orange-dark px-4 py-2 rounded-luxury font-luxury-semibold hover:bg-vibrant-orange/20 transition-colors flex items-center justify-center"
              >
                {location.pathname === '/events' ? (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Submit Event Idea
                  </>
                ) : (
                  <>
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Submit Project Idea
                  </>
                )}
              </button>
            </div>
          )}

          {/* Event/Project Form */}
          {showEventProjectForm && (
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-luxury-heading text-lg text-black">
                  Submit Your {location.pathname === '/events' ? 'Event' : 'Project'} Idea
                </h4>
                <button
                  onClick={() => setShowEventProjectForm(false)}
                  className="text-gray-500 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleEventProjectSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name *"
                    required
                    value={eventProjectData.name}
                    onChange={handleEventProjectInputChange}
                    className="px-3 py-2 border border-vibrant-orange/30 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    required
                    value={eventProjectData.email}
                    onChange={handleEventProjectInputChange}
                    className="px-3 py-2 border border-vibrant-orange/30 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                  />
                </div>
                
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={eventProjectData.phone}
                  onChange={handleEventProjectInputChange}
                  className="w-full px-3 py-2 border border-vibrant-orange/30 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                />
                
                <select
                  name="type"
                  value={eventProjectData.type}
                  onChange={handleEventProjectInputChange}
                  className="w-full px-3 py-2 border border-vibrant-orange/30 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                >
                  <option value="event">Event</option>
                  <option value="project">Project</option>
                </select>
                
                <input
                  type="text"
                  name="title"
                  placeholder="Title/Name of your idea *"
                  required
                  value={eventProjectData.title}
                  onChange={handleEventProjectInputChange}
                  className="w-full px-3 py-2 border border-vibrant-orange/30 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                />
                
                <textarea
                  name="description"
                  placeholder="Describe your idea *"
                  required
                  rows={3}
                  value={eventProjectData.description}
                  onChange={handleEventProjectInputChange}
                  className="w-full px-3 py-2 border border-vibrant-orange/30 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                />
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={eventProjectData.location}
                    onChange={handleEventProjectInputChange}
                    className="px-3 py-2 border border-vibrant-orange/30 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                  />
                  <input
                    type="text"
                    name="expectedParticipants"
                    placeholder="Expected participants"
                    value={eventProjectData.expectedParticipants}
                    onChange={handleEventProjectInputChange}
                    className="px-3 py-2 border border-vibrant-orange/30 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    name="budget"
                    placeholder="Estimated budget"
                    value={eventProjectData.budget}
                    onChange={handleEventProjectInputChange}
                    className="px-3 py-2 border border-vibrant-orange/30 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                  />
                  <input
                    type="text"
                    name="timeline"
                    placeholder="Timeline"
                    value={eventProjectData.timeline}
                    onChange={handleEventProjectInputChange}
                    className="px-3 py-2 border border-vibrant-orange/30 rounded-luxury text-sm focus:outline-none focus:ring-2 focus:ring-vibrant-orange"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-vibrant-orange text-white py-2 rounded-luxury font-luxury-semibold hover:bg-vibrant-orange-dark transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Submitting...' : 'Submit Idea'}
                </button>
              </form>
            </div>
          )}

          {/* Messages */}
          {!showEventProjectForm && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-luxury ${
                        message.sender === 'user'
                          ? 'bg-vibrant-orange text-white'
                          : 'bg-cream-elegant text-black'
                      }`}
                    >
                      <p className="text-sm font-luxury-body">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-cream-elegant text-black p-3 rounded-luxury">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-vibrant-orange rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-vibrant-orange rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-vibrant-orange rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t bg-cream-elegant">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-vibrant-orange/30 rounded-luxury focus:outline-none focus:ring-2 focus:ring-vibrant-orange font-luxury-body"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputText.trim() || isLoading}
                    className="bg-vibrant-orange text-white p-2 rounded-luxury hover:bg-vibrant-orange-dark transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
          </div>
        </>
      )}
    </>
  );
};

export default ChatWidget;