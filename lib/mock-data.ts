export interface WorkItem {
  id: string
  type: "epic" | "story" | "task" | "subtask"
  parentId: string | null
  title: string
  description: string
  assignee: string
  status: "new" | "in progress" | "reviewing" | "done" | "closed"
  priority: "low" | "normal" | "medium" | "high"
  estimatedTime: number
  progress: number
  estimatedStartDate: string
  estimatedEndDate: string
  actualStartDate: string
  actualEndDate: string
  attachments: string[]
  comments: Array<{
    id: string
    author: string
    text: string
    timestamp: string
  }>
  createdAt: string
  updatedAt: string
}

export const mockData: WorkItem[] = [
  {
    id: "1",
    type: "epic",
    parentId: null,
    title: "User Authentication System",
    description:
      "Implement a comprehensive user authentication system with login, registration, password reset, and user profile management.",
    assignee: "John Doe",
    status: "in progress",
    priority: "high",
    estimatedTime: 120,
    progress: 65,
    estimatedStartDate: "2024-01-01",
    estimatedEndDate: "2024-02-15",
    actualStartDate: "2024-01-03",
    actualEndDate: "",
    attachments: ["auth-wireframes.pdf", "security-requirements.docx"],
    comments: [
      {
        id: "c1",
        author: "Jane Smith",
        text: "Great progress on the authentication flow! The login page looks clean.",
        timestamp: "2024-01-15 10:30",
      },
      {
        id: "c2",
        author: "Mike Johnson",
        text: "Should we consider adding 2FA support in this epic?",
        timestamp: "2024-01-16 14:20",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "2",
    type: "story",
    parentId: "1",
    title: "User Login Page",
    description: "Create a responsive login page with email/password fields, validation, and error handling.",
    assignee: "Sarah Wilson",
    status: "done",
    priority: "high",
    estimatedTime: 16,
    progress: 100,
    estimatedStartDate: "2024-01-01",
    estimatedEndDate: "2024-01-05",
    actualStartDate: "2024-01-03",
    actualEndDate: "2024-01-05",
    attachments: ["login-mockup.png"],
    comments: [
      {
        id: "c3",
        author: "John Doe",
        text: "Login page is complete and tested. Ready for review.",
        timestamp: "2024-01-05 16:45",
      },
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-05T16:45:00Z",
  },
  {
    id: "3",
    type: "task",
    parentId: "2",
    title: "Implement form validation",
    description: "Add client-side and server-side validation for email format and password requirements.",
    assignee: "Sarah Wilson",
    status: "done",
    priority: "medium",
    estimatedTime: 4,
    progress: 100,
    estimatedStartDate: "2024-01-02",
    estimatedEndDate: "2024-01-03",
    actualStartDate: "2024-01-02",
    actualEndDate: "2024-01-03",
    attachments: [],
    comments: [],
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-03T12:00:00Z",
  },
  {
    id: "4",
    type: "subtask",
    parentId: "3",
    title: "Email format validation",
    description: "Validate email format using regex pattern.",
    assignee: "Sarah Wilson",
    status: "done",
    priority: "normal",
    estimatedTime: 1,
    progress: 100,
    estimatedStartDate: "2024-01-02",
    estimatedEndDate: "2024-01-02",
    actualStartDate: "2024-01-02",
    actualEndDate: "2024-01-02",
    attachments: [],
    comments: [],
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-02T15:30:00Z",
  },
  {
    id: "5",
    type: "subtask",
    parentId: "3",
    title: "Password strength validation",
    description: "Ensure password meets minimum requirements (8+ chars, uppercase, lowercase, number).",
    assignee: "Sarah Wilson",
    status: "done",
    priority: "normal",
    estimatedTime: 2,
    progress: 100,
    estimatedStartDate: "2024-01-02",
    estimatedEndDate: "2024-01-03",
    actualStartDate: "2024-01-02",
    actualEndDate: "2024-01-03",
    attachments: [],
    comments: [],
    createdAt: "2024-01-02T00:00:00Z",
    updatedAt: "2024-01-03T10:15:00Z",
  },
  {
    id: "6",
    type: "story",
    parentId: "1",
    title: "User Registration",
    description: "Implement user registration with email verification and profile setup.",
    assignee: "David Brown",
    status: "in progress",
    priority: "high",
    estimatedTime: 24,
    progress: 40,
    estimatedStartDate: "2024-01-08",
    estimatedEndDate: "2024-01-15",
    actualStartDate: "2024-01-08",
    actualEndDate: "",
    attachments: ["registration-flow.pdf"],
    comments: [
      {
        id: "c4",
        author: "David Brown",
        text: "Working on the email verification system. Should be ready by tomorrow.",
        timestamp: "2024-01-12 11:20",
      },
    ],
    createdAt: "2024-01-08T00:00:00Z",
    updatedAt: "2024-01-12T11:20:00Z",
  },
  {
    id: "7",
    type: "epic",
    parentId: null,
    title: "Dashboard Analytics",
    description: "Create a comprehensive analytics dashboard with charts, metrics, and reporting capabilities.",
    assignee: "Mike Johnson",
    status: "new",
    priority: "medium",
    estimatedTime: 80,
    progress: 0,
    estimatedStartDate: "2024-02-01",
    estimatedEndDate: "2024-03-15",
    actualStartDate: "",
    actualEndDate: "",
    attachments: ["analytics-requirements.docx"],
    comments: [],
    createdAt: "2024-01-20T00:00:00Z",
    updatedAt: "2024-01-20T00:00:00Z",
  },
]
