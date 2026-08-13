// ---------------------------------------------------------------------------
// EDIT ME: this is the only file you need to touch to put in your own info.
// Everything on the page is pulled from here.
// ---------------------------------------------------------------------------

export const profile = {
  name: "Frenz Allen Paller",
  role: "BS Information Technology Student | Full-Stack Developer | AI Enthusiast",
  tagline: "Hi, I'm Frenz Allen Paller, a fourth-year BSIT student at STI College Global City and a consistent President's Lister. I'm passionate about software development, specializing in building web applications and exploring AI-powered solutions.",
  location: "Philippines, Taguig City",
  email: "pallerxdfrenz@gmail.com",
  github: "https://github.com/FRENZZzy1",
  linkedin: "www.linkedin.com/in/pallerfrenz",

  resumeUrl: "#", // point this at a hosted PDF once you have one

  // Put a real photo at public/images/profile.jpg (or any path under public/)
  // and update this to match, e.g. "/images/profile.jpg".
  // Leave as null to show your initials instead.
  photo: "/profile.jpg",
};

export const about = `Hi, I'm Frenz Allen Paller, a fourth-year Bachelor of Science in Information Technology (BSIT) student at STI College Global City and a consistent President's Lister with a cumulative GWA of 1.35. I am passionate about software development and enjoy building innovative solutions that solve real-world problems.

I have hands-on experience developing desktop, web, and mobile applications using technologies such as PHP, JavaScript, Python, Java, C#, C++, and*MySQL. Throughout my academic journey, I have led and developed projects including a Learning Management System (LMS), Voting System, Point of Sale (POS) System, Ticketing System, and Telehealth Mobile Application, strengthening my skills in software engineering, teamwork, and project leadership.

I aspire to become a software engineer specializing in AI-powered applications and continuously seek opportunities to learn, innovate, and contribute to impactful technology solutions.
`;


export const skills = [
  "HTML", "CSS", "JavaScript", "PHP", "Python", "Java", "C++", "SQL", "Firebase", "React", "Git", "Fire_base"
];
// Each project can have a `gallery` — a list of image paths. Put real images
// in public/images/projects/ and reference them like "/images/projects/foo-1.jpg".
// Left as placeholders here so the layout has something to show.
export const projects = [
  {
    id: "01",
    title: "QR-Based Laboratory Equipment Monitoring System",
    blurb: "Led a small team building a QR-based system for tracking laboratory equipment — real-time condition reporting, maintenance logs, and automated notifications to cut equipment downtime. Owned the architecture and coordinated the dev team.",
    stack: ["PHP", "JS", "HTML", "CSS", "MySQL"],
    link: "#",
    repo: "https://github.com/FRENZZzy1/STI_ERMS",
    gallery: [
      "/projects_images/erms1_11zon.jpg",
      "/projects_images/erms2_11zon.jpg",
      "/projects_images/erms3_11zon.jpg",
    ],
  },
  {
    id: "02",
    title: "MediConnect – Telehealth Mobile Application",
    blurb: "Led a team building a telehealth mobile app that lets users book appointments, consult with doctors online, get AI-powered health assistance, and locate nearby clinics.",
    stack: ["Java", "XML", "Firebase"],
    link: "#",
    repo: "https://github.com/FRENZZzy1/MOBSYS_PROJECT",
    gallery: [
      "/projects_images/medi1.png",
      "/projects_images/med2.png",
      "/projects_images/medi3.png",
      "/projects_images/medi4.png",
      "/projects_images/medi5.png",
      "/projects_images/medi6.png"
    ],
  },
  {
    id: "03",
    title: "EduGuard",
    blurb: "built a simple full-stack academic early-warning system using PHP, MySQL, and vanilla JS. EduGuard aggregates each student's grades, attendance, and assignment data to compute a weighted risk score, then calls an LLM (via OpenRouter's free-tier models) to generate a structured AI risk report — complete with key concerns, strengths, subject-level breakdowns, and prioritized recommendations for faculty intervention.",
    stack: ["MySQL", "CSS", "JS", "HTML", "OpenRouter API"],
    link: "#",
    repo: "https://github.com/FRENZZzy1/RAG_STUDENTS",
    gallery: [
      "/projects_images/edu1.png",
      "/projects_images/edu2.png"
    ],
  },
];

// Work / internship / freelance history, most recent first.
export const experience = [
  {
    id: "e01",
    role: "Backend AI Engineer - Intern",
    org: "Fly Rank AI",
    period: "July 2026 — Present",
    points: [
      "Learning industry best practices in software engineering",
      "Working with AI tools and APIs.",
      "Writing, testing, and debugging code"
    ],
  },
];

// Certificates / courses. `image` can be a photo of the certificate.
export const certificates = [
  {
    id: "c01",
    title: "AI Fundamentals: Foundation of Understanding AI",
    issuer: "Cisco Networking Academy",
    date: "2026",
    image: "/AI_CERTI.png",
    link: "",
  },

  {
    id: "c02",
    title: "JavaScript Essentials l",
    issuer: "Cisco Networking Academy",
    date: "2026",
    image: "/javascript_l.png",
    link: "",
  },

  {
    id: "c03",
    title: "Java Fundamentals",
    issuer: "Oracle",
    date: "2024",
    image: "/oracle.png",
    link: "#",
  },
];

// Notable wins, awards, or milestones.
export const achievements = [
  {
    id: "a01",
    title: "Champion in Android Hackathon Winner | STI College Global City",
    description: "Led a team to build a full e-commerce mobile app in a live hackathon setting, winning 1st place at STI Global City's CollaboraTech Android Hackathon.",
    date: "2026",
    image: "/Achievements/champion.jpg"
  },
  {
    id: "a02",
    title: "Represented STI College Global City in the IT OLYMPICS DATABASE Competition",
    description: "Represented the school in the Database category of the IT Olympics, tackling advanced MySQL query challenges — from multi-table joins to complex filtering and aggregation — in a live competitive format.",
    date: "2025",
    image: "/Achievements/database.jpg"
  },

  {
    id: "a03",
    title: "SHS Graduation with Honors and Most outstanding ICT Student Awardee",
    description: "Graduated from Senior High School with honors and was awarded as the most outstanding ICT student in the school.",
    date: "2022",
    image: "/Achievements/grad.jpg"
  },
];

// ---------------------------------------------------------------------------
// Chat assistant config — used by src/components/ChatAssistant.jsx.
// The assistant is given a summary of everything above as context, so it can
// answer visitor questions about you. See the README for setup + the
// security note about calling OpenRouter directly from the browser.
// ---------------------------------------------------------------------------
export const assistantConfig = {
  enabled: true,
  greeting: `Hi! I'm ${profile.name}'s site assistant. Ask me about their projects, skills, or experience.`,
  suggestions: [
    "What projects have you worked on?",
    "What's your tech stack?",
    "What experience do you have?",
  ],
};
