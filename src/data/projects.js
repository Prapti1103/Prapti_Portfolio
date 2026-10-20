// Every description below was written from the project's source code or live
// site. Screenshots in /public/projects are real captures of the live sites.
//
// Filters: only categories that have at least one project are shown.
export const categories = ['All', 'Featured', 'AI', 'Full Stack', 'Frontend', 'Education', 'E-commerce'];

export const courtAI = {
  id: 'court-ai',
  title: 'Court AI',
  subtitle: 'Legal-language AI workspace & court administration suite for Pune district courts',
  overview:
    'Court AI is a two-part platform: a public translation workspace that turns court documents into readable text in ten Indian languages, and an administration dashboard for managing cases, teams and virtual hearings.',
  problem:
    'Court records arrive as scanned orders, PDFs and Word files in Marathi, Hindi and English. Litigants, advocates and staff lose time when they cannot read a record in the language they understand.',
  apps: [
    {
      name: 'PuneCourtTranslator',
      image: '/projects/court-translator.jpg',
      live: 'https://punecourttranslator.netlify.app/#/',
      repo: 'https://github.com/Prapti1103/PuneCourtTranslator',
      features: [
        'OCR for scanned images with Tesseract.js in English, Marathi, Hindi and 7 more scripts',
        'Text extraction from PDFs (pdf.js) and Word documents',
        'Sentence-chunked machine translation across 10 languages',
        'User workspace with plan limits, usage meter and translation history',
        'One-click download of translated text',
        'Audio / video upload flow ready for a speech-to-text API endpoint',
      ],
    },
    {
      name: 'Pune Court Admin',
      image: '/projects/court-admin.jpg',
      live: 'https://punecourt.netlify.app/',
      repo: 'https://github.com/Prapti1103/PuneCourtAdmin',
      features: [
        'Case management with status tracking — In Progress, Upcoming, Completed, Delayed, On Hold',
        'Teams, leaders and members with court roles (Judge, Prosecutor, Clerk, Translator…)',
        'Task assignment, pending-task list and case-activity charts',
        'Virtual hearing room with camera/mic controls and screen sharing',
        'Paginated, searchable tables and a responsive sidebar layout',
      ],
    },
  ],
  stack: ['React 18', 'Vite', 'Tesseract.js', 'pdf.js', 'Translation API', 'Media Devices API', 'Lucide', 'Netlify'],
  contribution:
    'Designed and built both applications end-to-end — UI design, document-processing pipeline, translation chunking, admin data model and deployment.',
  note:
    'Court AI is an assistive reading tool. Machine translation and OCR can contain errors — it does not provide legal advice or replace certified translation.',
};

export const projects = [
  {
    id: 'court-translator',
    title: 'Court AI — Translator',
    tagline: 'Every word in court, understood in any language',
    image: '/projects/court-translator.jpg',
    categories: ['Featured', 'AI', 'Full Stack'],
    stack: ['React', 'Vite', 'Tesseract.js', 'pdf.js', 'Translation API'],
    live: 'https://punecourttranslator.netlify.app/#/',
    repo: 'https://github.com/Prapti1103/PuneCourtTranslator',
    summary:
      'A legal-language workspace that extracts text from scanned images, PDFs and Word files and translates it across 10 Indian languages.',
    caseStudy: {
      problem: 'Court documents are often scans in a language the reader does not understand.',
      approach: 'A file-type router sends images to OCR, PDFs to pdf.js and text files straight to translation. Long text is split on sentence boundaries (including the Devanagari danda “।”) into chunks under the API limit.',
      result: 'A working, deployed workspace with accounts, plan limits, history and downloadable output.',
    },
    courtAI: true,
  },
  {
    id: 'court-admin',
    title: 'Court AI — Admin',
    tagline: 'Clarity for every case',
    image: '/projects/court-admin.jpg',
    categories: ['Featured', 'AI', 'Full Stack'],
    stack: ['React', 'Vite', 'Lucide', 'Media Devices API'],
    live: 'https://punecourt.netlify.app/',
    repo: 'https://github.com/Prapti1103/PuneCourtAdmin',
    summary:
      'Court administration dashboard for cases, teams, tasks and virtual hearings with screen sharing.',
    caseStudy: {
      problem: 'Court staff juggle cases, hearing schedules and team assignments across spreadsheets.',
      approach: 'One workspace with a case table, status chips, team hierarchy, task board and an in-browser hearing room using getUserMedia / getDisplayMedia.',
      result: 'A responsive admin suite with charts, pagination and full CRUD on cases, teams and tasks.',
    },
    courtAI: true,
  },
  {
    id: 'shahu',
    title: 'Shri Shahu Prabodhini School',
    tagline: 'Live school website & Sankalp scholarship-exam platform',
    image: '/projects/shahu-school.jpg',
    gallery: ['/projects/shahu-school.jpg', '/projects/shahu-admin.jpg'],
    categories: ['Featured', 'Full Stack', 'Education'],
    stack: ['React', 'Vite', 'REST API', 'Admin auth', 'Leaderboard', 'Custom domain'],
    live: 'https://shrishahuprabodhini.in/',
    admin: 'https://admin.shrishahuprabodhini.in/login',
    summary:
      'Production website for a school in Maharashtra and home of the Sankalp Online Scholarship Exam — with bilingual content, admissions, toppers, gallery and a separate secured admin panel.',
    caseStudy: {
      problem: 'The school needed one place for admissions, announcements and running a state-level scholarship exam online.',
      approach: 'A React public site (courses, mentors, awards, toppers, gallery, faculty, testimonials) backed by a REST API for student records, exam categories, answer keys and leaderboards, plus a dedicated, authenticated admin sub-domain for staff.',
      result: 'Live in production at shrishahuprabodhini.in with the admin panel at admin.shrishahuprabodhini.in.',
    },
    professional: true,
  },
  {
    id: 'sankalp',
    title: 'Sankalp Foundation Exam Portal',
    tagline: 'State-level GK examination for Std 1st – 8th',
    image: '/projects/sankalp.jpg',
    categories: ['Full Stack', 'Education'],
    stack: ['React', 'Vite', 'Role-based UI', 'Netlify'],
    live: 'https://sankalpweb.netlify.app/',
    repo: 'https://github.com/Prapti1103/sankalpwelfareClient',
    summary:
      'Exam portal with student registration, roll-number results, online mock tests and separate Student, Coordinator and Admin dashboards.',
    caseStudy: {
      problem: 'A foundation running exams across districts needed online registration and results for Marathi, English and Semi-English students.',
      approach: 'Dependent District → Taluka → Exam-Centre dropdowns auto-assign a coordinator; three login roles open their own dashboards; students can take a timed mock test.',
      result: 'A complete frontend ready to plug into a real backend — later evolved into the Shri Shahu Prabodhini platform.',
    },
  },
  {
    id: 'mpsc',
    title: 'MPSC रणभूमी Academy',
    tagline: 'Competitive-exam coaching website in Marathi',
    image: '/projects/mpsc.jpg',
    categories: ['Frontend', 'Education'],
    stack: ['React', 'React Router', 'Vite', 'React Icons'],
    live: 'https://mpscranbhoomi.netlify.app/',
    repo: 'https://github.com/Prapti1103/mpsc_ranbhoomi',
    summary:
      'Multi-page academy site with course detail pages, test series, demo lectures, downloadable notes, feedback and a contact form.',
    caseStudy: {
      problem: 'The academy’s batches were advertised only through posters.',
      approach: 'Turned the posters into a routed React site with data-driven course pages, YouTube lecture grid, notes library, image lightbox and a floating WhatsApp button.',
      result: 'A Marathi-first, mobile-friendly site that is easy for the academy to update through simple data files.',
    },
  },
  {
    id: 'pmbooks',
    title: 'PM Books — Book Cart',
    tagline: 'Online bookstore storefront',
    image: '/projects/pmbooks.jpg',
    categories: ['Frontend', 'E-commerce'],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Swiper'],
    live: 'https://pmbooks.netlify.app/',
    summary:
      'Bookstore storefront with category browsing, featured and new-arrival carousels, deal of the day, reviews, blog and sign-in UI.',
  },
  {
    id: 'soil-serum',
    title: 'Soil Serumz',
    tagline: 'Personal-care e-commerce store',
    image: '/projects/soil-serum.jpg',
    categories: ['Frontend', 'E-commerce'],
    stack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'jQuery', 'Swiper'],
    live: 'https://soil-serum-web.netlify.app/',
    summary:
      'Store for hair, skin and body care with shop-by-concern navigation, cart with free-shipping progress, best sellers and deal of the week.',
  },
];
