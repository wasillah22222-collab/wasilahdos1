export interface HeadInfo {
  id: string;
  name: string;
  designation: string;
  image?: string;
}

export interface ProjectSubmission {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  startDate: string;
  endDate: string;
  expectedVolunteers: number;
  requirements: string[];
  objectives: string[];
  targetAudience?: string;
  durationEstimate?: string;
  resourceRequirements?: string[];
  skillRequirements?: string[];
  notes?: string;
  checklist?: ChecklistItem[];
  reminders?: Reminder[];
  contactEmail: string;
  contactPhone: string;
  budget?: string;
  timeline: string;
  submittedBy: string;
  submitterName: string;
  submitterEmail: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  submittedAt: any;
  reviewedAt?: any;
  reviewedBy?: string;
  adminComments?: string;
  rejectionReason?: string;
  image?: string;
  heads?: HeadInfo[];
  auditTrail: AuditEntry[];
}

export interface EventSubmission {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  expectedAttendees: number;
  registrationDeadline: string;
  requirements: string[];
  agenda: string[];
  targetAudience?: string;
  durationEstimate?: string;
  resourceRequirements?: string[];
  skillRequirements?: string[];
  notes?: string;
  checklist?: ChecklistItem[];
  reminders?: Reminder[];
  contactEmail: string;
  contactPhone: string;
  cost: string;
  submittedBy: string;
  submitterName: string;
  submitterEmail: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  submittedAt: any;
  reviewedAt?: any;
  reviewedBy?: string;
  adminComments?: string;
  rejectionReason?: string;
  image?: string;
  heads?: HeadInfo[];
  auditTrail: AuditEntry[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: any;
  completedBy?: string;
}

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  reminderDate: string;
  reminderTime: string;
  notifyEmails: string[];
  sent: boolean;
  sentAt?: any;
}

export interface AuditEntry {
  action: string;
  performedBy: string;
  performedAt: any;
  details?: string;
  previousStatus?: string;
  newStatus?: string;
}

export type SubmissionType = 'project' | 'event';
export type SubmissionStatus = 'draft' | 'pending' | 'approved' | 'rejected';