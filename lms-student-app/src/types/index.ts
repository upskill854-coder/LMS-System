export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  fatherName?: string;
  lastQualification?: string;
  profileImageUrl?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface Course {
  id: string;
  title: string;
  shortDescription: string;
  overview: string;
  thumbnailUrl: string;
  bannerUrl: string;
  durationLabel: string;
  language: string;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  totalClasses: number;
  fee: number;
  currency: string;
  rating?: number | null;
  learnPoints: string[];
  requirements: string[];
  faqs: { question: string; answer: string }[];
  modules: CourseModule[];
}

export interface CourseModule {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  order: number;
  isLocked: boolean;
  isCompleted: boolean;
  videoUrl?: string | null;
  description?: string;
  resources: Resource[];
}

export interface Resource {
  id: string;
  title: string;
  type: "PDF" | "LINK" | "FILE";
  url: string;
}

export interface Enrollment {
  id: string;
  courseId: string;
  course: Course;
  batchId: string;
  status: "PENDING" | "ACTIVE" | "EXPIRED" | "CANCELLED";
  progressPercent: number;
  enrollmentDate: string;
  expiryDate?: string | null;
}

export interface Batch {
  id: string;
  courseId: string;
  name: string;
  classTime: string;
  studentCount: number;
}

export interface ClassSession {
  id: string;
  courseId: string;
  batchId: string;
  topic: string;
  teacherName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: "UPCOMING" | "LIVE" | "ENDED" | "CANCELLED";
  recordingUrl?: string | null;
}

export interface LiveSessionToken {
  roomId: string;
  token: string;
  wsUrl: string;
  provider: string;
}

export interface ChatMessage {
  id: string;
  classId: string;
  senderId: string;
  senderName: string;
  senderRole: "STUDENT" | "TEACHER" | "ADMIN";
  message: string;
  createdAt: string;
}

export interface PromoValidationResult {
  valid: boolean;
  code: string;
  originalAmount: number;
  discountAmount: number;
  payableAmount: number;
  message?: string;
}

export interface PendingOrder {
  orderId: string;
  amount: number;
  currency: string;
  razorpayKeyId: string;
  enrollmentId: string;
}

export interface Payment {
  id: string;
  courseTitle: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "FAILED";
  transactionId: string;
  createdAt: string;
  invoiceUrl?: string | null;
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  type:
    | "CLASS_SCHEDULED"
    | "CLASS_LIVE"
    | "ANNOUNCEMENT"
    | "PAYMENT"
    | "LESSON"
    | "RESOURCE";
  isRead: boolean;
  createdAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
}
