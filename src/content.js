// Every piece of copy on the site lives here, so updating the portfolio
// after a resume change means editing this file only.

export const EMAIL = "bhavesh.ahalani@gmail.com";
export const RESUME_URL = `${process.env.PUBLIC_URL}/assets/Bhavesh_Resume.pdf`;
export const LINKEDIN_URL = "https://www.linkedin.com/in/bhavesh-ahalani/";
export const GITHUB_URL = "https://github.com/Bhavesh-Ahalani";

export const hero = {
  kicker: "Full stack engineer, AI platforms",
  firstName: "Bhavesh",
  lastName: "Ahalani",
  lead: "I build the layer between products and models. At Kapsy I own LLM routing, agent tooling and real-time collaboration.",
};

// One chapter per Kapsy project. `id` must match a shape in field/shapes.js
// (chapter order = shape order), and `label` shows in the side index.
export const kapsyChapters = [
  {
    id: "routing",
    label: "Routing",
    kicker: "Kapsy, 2026",
    title: "One router behind every AI call.",
    body: "Tiered model routes with automatic failover across Anthropic, OpenAI and Azure OpenAI. When a provider goes down, the call moves to the next one and the person using Kapsy never notices.",
    stat: { value: 5, suffix: "×", label: "lower inference spend after prompt caching" },
  },
  {
    id: "agents",
    label: "Agents",
    kicker: "Kapsy, 2026",
    title: "270 tools. A consent gate on every one.",
    body: "An agent reasoning loop and MCP tool server that let AI write to the CRM, author documents and edit live pages. Each tool asks before it acts, and every action can be undone.",
    stat: { value: 270, suffix: "+", label: "typed tools agents can call" },
    note: "Each cluster of light in this chapter is one tool.",
  },
  {
    id: "streaming",
    label: "Streaming",
    kicker: "Kapsy, 2026",
    title: "Answers arrive as they are written.",
    body: "Model output streams token by token over server-sent events and WebSockets. ETag optimistic concurrency stops people and agents from silently overwriting each other's edits.",
    demo: {
      question: "Example: summarise this week's pipeline",
      answer:
        "Three deals moved to negotiation, two are waiting on legal, and the Q4 renewal needs a reply from you by Friday.",
    },
  },
  {
    id: "builder",
    label: "Builder",
    kicker: "Kapsy, 2026",
    title: "An AI page editor that cannot make things up.",
    body: "Agent tools add and edit landing-page sections behind guardrails that refuse values the model invented and slots the layout cannot draw.",
    stat: { value: 54, suffix: "%", label: "smaller eager bundle, from 1,290 KB to 598 KB gzipped" },
  },
  {
    id: "video",
    label: "Video",
    kicker: "Kapsy, 2026",
    title: "Record, share, stream and meet.",
    body: "A browser recorder, a library whose folders pass permissions down the whole tree, signed playback for guests without an account, and LiveKit rooms and webinars with host controls and recording.",
  },
];

// `knot` is the employer's position on the helix, left to right:
// 0 TCS, 1 Cognizant, 2 Soroco, 3 Optum, 4 Kapsy.
export const companies = [
  {
    id: "optum",
    knot: 3,
    name: "Optum",
    years: "2025–2026",
    summary: "Software Engineering Lead. Automated data access from request to revocation.",
    meta: "Software Engineering Lead, Hyderabad. Dec 2025 to Jul 2026",
    points: [
      "Maintained and extended a central data product catalog where teams find datasets, see who owns them and request governed access.",
      "Improved the full data access lifecycle, from request and approval to provisioning and revocation, with automation, failure handling and real-time tracking. Less manual work and stronger compliance.",
    ],
  },
  {
    id: "soroco",
    knot: 2,
    name: "Soroco",
    years: "2022–2025",
    summary: "Built the SNDS design system: design cycles 40% faster, defects down 25%.",
    meta: "Software Engineer, Bengaluru, remote. Aug 2022 to Dec 2025",
    points: [
      "Built and scaled an enterprise work observability product that captures user interaction data to cut operating cost and effort.",
      "Designed REST APIs in Java and Spring Boot mapped straight from Figma flows, cutting integration defects 30%.",
      "Developed the Soroco Neo Design System in Angular, RxJS and NgRx: design cycles 40% faster, front-end defects down 25%.",
      "Led proofs of concept and cross-repository review with senior engineers, taking urgent monthly bugs from 15+ to under 5.",
      "Improved front-end performance and analytics across critical workflows, making pages 30% more responsive.",
    ],
    awards: "Spot Award 2025. Third place, Soroco Hackathon 2024. Torch Bearer Award 2023.",
  },
  {
    id: "cognizant",
    knot: 1,
    name: "Cognizant",
    years: "2022",
    summary: "Developed the Pilot Trading System front end in Angular.",
    meta: "Software Developer, Pune, remote. Feb 2022 to Aug 2022",
    points: [
      "Developed and maintained the Pilot Trading System front end in Angular, improving UI performance and lifting user engagement 15%.",
    ],
  },
  {
    id: "tcs",
    knot: 0,
    name: "TCS",
    years: "2019–2022",
    summary: "A transformer summarisation model that cut manual processing 60%.",
    meta: "Assistant Software Developer, Thane, Mumbai. Feb 2019 to Feb 2022",
    points: [
      "Built a complete user management system in Java, Spring Boot and Angular, making API responses 20% faster.",
      "Built a transformer-based document summarisation model that cut manual processing 60%.",
      "Trained a shareholder query classifier with scikit-learn ensembles that reached 92% accuracy.",
      "Created Power BI dashboards for Tata Innovista that cut decision time from 5 hours to 1.5.",
    ],
    awards:
      "Digital Cadre 2021. Special Initiative Award 2020. TCS Gems 2020. On-Spot Star Team Award 2019. ILP Kudos 2019.",
  },
];
