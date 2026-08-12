import { Product } from '../types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'pdf-001',
    title: 'Full Stack Web Development Blueprint 2026',
    subtitle: 'Master React 19, Node.js, Next.js 15, Architecture & System Design',
    priceINR: 499,
    priceUSD: 9.99,
    originalPriceINR: 1499,
    originalPriceUSD: 29.99,
    category: 'eBook',
    rating: 4.9,
    reviewCount: 328,
    imageCover: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    pdfPageCount: 210,
    pdfFileSize: '8.4 MB',
    authorName: 'Alex Rivers, Senior Tech Architect',
    publishedYear: '2026',
    salesCount: 1420,
    description: `The ultimate modern web development roadmap designed for developers, students, and engineers looking to build production-grade scalable web applications. 

This 210-page comprehensive PDF guide covers everything from modern TypeScript design patterns, full-stack state management, serverless architectures, database indexing, to deploying high-concurrency microservices. Packed with real-world code snippets, architecture diagrams, and interview questions.`,
    keyTakeaways: [
      'Complete React 19 Server Components & Hooks masterclass',
      'Production Node.js & Express API design best practices',
      'PostgreSQL & MongoDB performance tuning & indexing',
      'System design patterns for high scale & instant deployments'
    ],
    tableOfContents: [
      { pageNumber: 1, title: 'Chapter 1: Modern Full Stack Ecosystem Overview' },
      { pageNumber: 25, title: 'Chapter 2: TypeScript & Advanced Type Safety' },
      { pageNumber: 60, title: 'Chapter 3: React 19 Architecture & Async Patterns' },
      { pageNumber: 110, title: 'Chapter 4: Scalable Node.js Server & Microservices' },
      { pageNumber: 165, title: 'Chapter 5: System Design, Caching & Cloud Security' }
    ],
    sampleTextPages: [
      `CHAPTER 1: MODERN FULL STACK ECOSYSTEM OVERVIEW\n\nIn 2026, web development has shifted towards server-first React architectures, edge computing, and AI-assisted workflows. A full-stack engineer is expected to master not just client UI rendering, but also database query efficiency, secure API endpoints, and low-latency network protocols.\n\nKey Pillars of Modern Web Apps:\n1. Server-Side Execution & Streaming\n2. Immutable Data State Management\n3. Zero-Trust Security & Token Authentication\n4. Database Schema Migrations without Downtime`,
      `CHAPTER 2: ADVANCED TYPESCRIPT & TYPE STRIPPING\n\nTypeScript continues to be the industry standard. With modern Node.js runtimes supporting direct type-stripping execution, developers can run .ts files with zero compilation lag in development.\n\nExample Utility Pattern:\ntype DeepReadonly<T> = {\n  readonly [P in keyof T]: DeepReadonly<T[P]>;\n};\n\nUsing strict type guards ensures your server routes validate payload invariants before touching the database.`
    ],
    customPdfContent: {
      chapters: [
        {
          title: '1. Modern Full Stack Architecture',
          content: [
            'Building modern applications requires a solid understanding of both frontend responsiveness and backend reliability.',
            'Key Focus Areas:',
            '- React 19 Server Components and streaming SSR.',
            '- Express & Node.js backend middleware pipelines.',
            '- Database security, indexing, and connection pooling.',
            '- Automated testing, type checking, and deployment pipelines.'
          ]
        },
        {
          title: '2. Backend API Design & Security',
          content: [
            'Always sanitize incoming payloads before processing.',
            'Use JWT tokens or secure HTTP-only cookies for session authentication.',
            'Implement rate-limiting and robust error handling on all production endpoints.'
          ]
        },
        {
          title: '3. Production Deployment Checklist',
          content: [
            '1. Ensure all environment variables are populated securely.',
            '2. Enable HTTP gzip/brotli compression.',
            '3. Set proper CORS headers for your trusted domains.',
            '4. Monitor server CPU, memory, and database connection latency.'
          ]
        }
      ]
    },
    reviews: [
      { id: 'r1', author: 'Rohan Sharma', rating: 5, date: '2 days ago', comment: 'Best ₹499 I ever spent! The code snippets are crystal clear and actionable.', verifiedBuyer: true },
      { id: 'r2', author: 'Priya Patel', rating: 5, date: '1 week ago', comment: 'Instant download right after UPI payment. High quality PDF with clear diagrams.', verifiedBuyer: true }
    ]
  },
  {
    id: 'pdf-002',
    title: 'UI/UX Design Systems & Figma Playbook',
    subtitle: 'Design Tokens, Responsive Layouts, Accessibility & Component Architecture',
    priceINR: 399,
    priceUSD: 7.99,
    originalPriceINR: 1199,
    originalPriceUSD: 23.99,
    category: 'Guide',
    rating: 4.8,
    reviewCount: 194,
    imageCover: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=800&auto=format&fit=crop',
    pdfPageCount: 145,
    pdfFileSize: '12.1 MB',
    authorName: 'Elena Rostova, Design Director',
    publishedYear: '2026',
    salesCount: 890,
    description: `A battle-tested handbook for product designers, frontend developers, and UI engineers. Learn how to architect multi-brand design systems in Figma and translate them into clean, accessible Tailwind CSS components.

Includes 145 pages of visual guidelines, color scale mathematics, typography pairing frameworks, micro-interaction motion curves, and accessibility compliance checklists (WCAG 2.2 AA).`,
    keyTakeaways: [
      'Design Token architecture for Light and Dark modes',
      'Mathematical spacing & typographic hierarchy scales',
      'Building scalable component libraries in Figma',
      'WCAG 2.2 Accessibility audit templates & guidelines'
    ],
    tableOfContents: [
      { pageNumber: 1, title: 'Part 1: Fundamentals of Design Tokens' },
      { pageNumber: 30, title: 'Part 2: Typographic Mathematics & Fluid Scales' },
      { pageNumber: 65, title: 'Part 3: Color Theory & WCAG Contrast Rules' },
      { pageNumber: 105, title: 'Part 4: Figma Variables to Tailwind CSS Handoff' }
    ],
    sampleTextPages: [
      `PART 1: DESIGN TOKENS ARCHITECTURE\n\nDesign tokens are the atomic visual building blocks of your brand system. They represent raw values (colors, spacing, font sizes, shadows) as semantic variables that can be consumed by both Figma and code repositories.\n\nPrimitive Tokens vs Semantic Tokens:\n- Primitive: color-blue-500 = #3B82F6\n- Semantic: color-bg-primary = var(--color-blue-500)\n- Component: button-bg = var(--color-bg-primary)`
    ],
    customPdfContent: {
      chapters: [
        {
          title: '1. Spacing & Typography Mathematics',
          content: [
            'Maintain strict rhythm using a 4px or 8px baseline grid system.',
            'Ensure typography steps follow a consistent mathematical ratio (e.g., 1.25 Major Third or 1.333 Perfect Fourth).',
            'Outer padding of containers should always equal or exceed inner item spacing.'
          ]
        },
        {
          title: '2. Accessible Color Contrast',
          content: [
            'Normal body text requires a minimum contrast ratio of 4.5:1 against its background.',
            'Large text (above 18pt or 14pt bold) requires at least 3.0:1 contrast ratio.',
            'Never rely purely on color to indicate state changes—always combine with icons or textual labels.'
          ]
        }
      ]
    },
    reviews: [
      { id: 'r3', author: 'Vikram Mehta', rating: 5, date: '3 days ago', comment: 'Extremely detailed PDF. Download link worked instantly on phone!', verifiedBuyer: true }
    ]
  },
  {
    id: 'pdf-003',
    title: 'Python AI & Data Science Cheat Sheet Vault',
    subtitle: 'NumPy, Pandas, PyTorch, LangChain, Prompt Engineering & LLM Tuning',
    priceINR: 299,
    priceUSD: 5.99,
    originalPriceINR: 899,
    originalPriceUSD: 17.99,
    category: 'Cheat Sheet',
    rating: 4.9,
    reviewCount: 412,
    imageCover: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop',
    pdfPageCount: 85,
    pdfFileSize: '5.2 MB',
    authorName: 'Dr. Aris Thorne, AI Researcher',
    publishedYear: '2026',
    salesCount: 2310,
    description: `The quick-reference desk cheat sheet bundle every Python engineer, data scientist, and AI developer needs. Contains high-density, color-coded code blocks, vector algebra formulas, LLM prompt engineering frameworks, and fine-tuning pipelines.

Formatted for quick ctrl+F searching, print-ready high resolution, and instant copy-paste usage.`,
    keyTakeaways: [
      'Pandas data manipulation & vectorized operation quick refs',
      'PyTorch tensor ops & neural network training loops',
      'LangChain & LlamaIndex AI agent orchestration snippets',
      'Structured output JSON prompting & guardrail tricks'
    ],
    tableOfContents: [
      { pageNumber: 1, title: 'Section 1: Python Data Wrangling & Numpy Shortcuts' },
      { pageNumber: 20, title: 'Section 2: Pandas Dataframe Mastery' },
      { pageNumber: 45, title: 'Section 3: PyTorch Deep Learning Cheat Sheet' },
      { pageNumber: 65, title: 'Section 4: Generative AI & Prompt Engineering' }
    ],
    sampleTextPages: [
      `SECTION 1: PYTHON DATA WRANGLING SHORTCUTS\n\nVectorized Array Multiplication:\nimport numpy as np\na = np.array([1, 2, 3])\nb = np.array([4, 5, 6])\ndot_product = np.dot(a, b) # 32\n\nPandas Filtering:\ndf_filtered = df[(df['age'] > 25) & (df['score'] >= 80)]`
    ],
    customPdfContent: {
      chapters: [
        {
          title: '1. PyTorch Neural Network Basics',
          content: [
            'Importing PyTorch and defining custom nn.Module classes.',
            'Standard training loop:',
            '1. optimizer.zero_grad()',
            '2. outputs = model(inputs)',
            '3. loss = criterion(outputs, targets)',
            '4. loss.backward()',
            '5. optimizer.step()'
          ]
        },
        {
          title: '2. LLM Prompting & Function Calling',
          content: [
            'Provide explicit schema constraints when demanding JSON response output.',
            'Use system instructions to anchor safety rules and persona.',
            'Always set lower temperatures (0.0 - 0.2) for deterministic code generation.'
          ]
        }
      ]
    }
  },
  {
    id: 'pdf-004',
    title: 'Startup Pitch Deck & Fundraising Guide',
    subtitle: 'Slide-by-Slide Strategy, Financial Model Templates & VC Investor Script',
    priceINR: 699,
    priceUSD: 13.99,
    originalPriceINR: 1999,
    originalPriceUSD: 39.99,
    category: 'Workbook',
    rating: 5.0,
    reviewCount: 156,
    imageCover: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=800&auto=format&fit=crop',
    pdfPageCount: 92,
    pdfFileSize: '9.8 MB',
    authorName: 'Marcus Vance, Ex-Y Combinator Founder',
    publishedYear: '2026',
    salesCount: 620,
    description: `A proven fundraising playbook that helped over 120+ early-stage startups raise seed and Series A funding.

Includes slide-by-slide breakdowns of problem statement, solution framing, market size (TAM/SAM/SOM), business model economics, unit metrics (CAC, LTV, Churn), financial projections, and investor email scripts.`,
    keyTakeaways: [
      'The 10-slide pitch deck structure that VCs actually read',
      'How to calculate realistic TAM, SAM, and SOM figures',
      'Financial model formulas for SaaS & Ecommerce',
      'Cold email templates with 40%+ investor response rate'
    ],
    tableOfContents: [
      { pageNumber: 1, title: 'Slide 1-3: Hooking Investors & Problem Framing' },
      { pageNumber: 25, title: 'Slide 4-6: Product Traction & Unit Economics' },
      { pageNumber: 50, title: 'Slide 7-9: Market Size & Competitive Moat' },
      { pageNumber: 75, title: 'Slide 10: The Ask, Valuation & Use of Funds' }
    ],
    sampleTextPages: [
      `SLIDE 1: THE HOOK & VALUE PROPOSITION\n\nYour opening slide must convey what your company does in under 5 seconds. Avoid vague buzzwords. State: [Company Name] is [X] for [Y].\n\nExample: "PDFStore is the Instant Stripe-powered Digital Product Delivery Engine for Solopreneurs."`
    ],
    customPdfContent: {
      chapters: [
        {
          title: '1. Strategic Problem & Solution Framing',
          content: [
            'Investors review 100+ pitch decks every week. Brevity wins.',
            'Describe the painful problem with quantifiable metrics (e.g. "Businesses lose $20B annually due to slow checkout friction").',
            'Show how your product solves this 10x better and faster than existing alternatives.'
          ]
        },
        {
          title: '2. Valuation & Term Sheet Essentials',
          content: [
            'Pre-money vs Post-money valuation fundamentals.',
            'SAFE (Simple Agreement for Future Equity) vs Convertible Notes.',
            'Key clauses to negotiate: Liquidation preference, pro-rata rights, board seats.'
          ]
        }
      ]
    }
  },
  {
    id: 'pdf-005',
    title: 'Personal Finance & Investment Blueprint 2026',
    subtitle: 'Wealth Creation, Index Funds, Tax Optimization & Budget Planner Worksheets',
    priceINR: 349,
    priceUSD: 6.99,
    originalPriceINR: 999,
    originalPriceUSD: 19.99,
    category: 'Finance',
    rating: 4.9,
    reviewCount: 520,
    imageCover: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?q=80&w=800&auto=format&fit=crop',
    pdfPageCount: 180,
    pdfFileSize: '6.7 MB',
    authorName: 'Siddharth Rao, Certified Financial Planner',
    publishedYear: '2026',
    salesCount: 3100,
    description: `Take total control of your money with this comprehensive 180-page financial blueprint and printable workbook.

Designed for working professionals, freelancers, and young earners who want to build passive income streams, optimize tax deductions (Section 80C/80CCD), automate mutual fund SIPs, and reach financial independence early (FIRE).`,
    keyTakeaways: [
      'Automated 50/30/20 budget framework & net worth tracker',
      'Step-by-step index fund & equity SIP allocation strategy',
      'Emergency fund calculation & term health insurance guide',
      'Tax-saving strategies and retirement planning milestones'
    ],
    tableOfContents: [
      { pageNumber: 1, title: 'Chapter 1: De-bugging Your Financial Mindset' },
      { pageNumber: 35, title: 'Chapter 2: Emergency Funds & Health Safety Nets' },
      { pageNumber: 80, title: 'Chapter 3: Wealth Building via Mutual Funds & Equity' },
      { pageNumber: 130, title: 'Chapter 4: Tax Optimization & Early Retirement (FIRE)' }
    ],
    sampleTextPages: [
      `CHAPTER 1: THE 50/30/20 ALLOCATION RULE\n\nDivide your monthly post-tax income into 3 clear buckets:\n- 50% Needs: Rent, Groceries, Utilities, Minimum Debt\n- 30% Wants: Dining, Outings, Subscriptions, Gadgets\n- 20% Wealth Building: SIPs, Stocks, Emergency Fund`
    ],
    customPdfContent: {
      chapters: [
        {
          title: '1. Building a Bulletproof Emergency Fund',
          content: [
            'Maintain 6 to 12 months of monthly living expenses in high-yield liquid funds.',
            'Never invest your emergency cash into volatile equity markets.',
            'Keep 20% in savings account and 80% in instant redemption liquid funds.'
          ]
        },
        {
          title: '2. The Power of Compounding (SIP Math)',
          content: [
            'A monthly SIP of ₹10,000 at 12% CAGR yields over ₹1 Crore in 20 years.',
            'Increasing your SIP by 10% every year cuts the time to ₹1 Crore in half!',
            'Consistency matters far more than timing the market.'
          ]
        }
      ]
    }
  },
  {
    id: 'pdf-006',
    title: 'Minimalist Tech Resume & Portfolio Kit',
    subtitle: 'ATS-Optimized Fillable PDF Templates & Cover Letter Formulas',
    priceINR: 199,
    priceUSD: 3.99,
    originalPriceINR: 599,
    originalPriceUSD: 11.99,
    category: 'Template',
    rating: 4.8,
    reviewCount: 280,
    imageCover: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop',
    pdfPageCount: 45,
    pdfFileSize: '3.1 MB',
    authorName: 'Sarah Jenkins, Tech Recruiter',
    publishedYear: '2026',
    salesCount: 1850,
    description: `Get noticed by top companies with ATS-friendly, clean, fillable resume templates designed specifically for Software Engineers, Product Managers, Data Scientists, and Designers.

Includes action verb word lists, bullet point impact formulas (Google XYZ formula), and copy-paste cover letter scripts.`,
    keyTakeaways: [
      '100% ATS compliant layout with clean typography',
      'The Google "XYZ" bullet point metric formula',
      'Fillable PDF fields & customizable sections',
      'High-impact cover letter scripts for cold emails'
    ],
    tableOfContents: [
      { pageNumber: 1, title: 'Section 1: The ATS Parsing Engine Rules' },
      { pageNumber: 12, title: 'Section 2: High Impact Bullet Point Writing' },
      { pageNumber: 25, title: 'Section 3: Standard 1-Page Resume Template' },
      { pageNumber: 38, title: 'Section 4: Senior Executive 2-Page Resume Template' }
    ],
    sampleTextPages: [
      `SECTION 1: GOOGLE XYZ BULLET POINT FORMULA\n\nStructure every bullet point as:\n"Accomplished [X] as measured by [Y], by doing [Z]."\n\nExample:\n"Increased API throughput by 42% (Y) by implementing Redis caching and database indexing (Z), reducing user checkout latency from 1.2s to 200ms (X)."`
    ],
    customPdfContent: {
      chapters: [
        {
          title: '1. Resume Optimization Checklist',
          content: [
            'Keep resume to strictly 1 page for less than 8 years of experience.',
            'Use standard sans-serif fonts (Helvetica, Inter, Arial) for 100% ATS readability.',
            'Never put essential text inside header/footer boxes as ATS parsers skip them.'
          ]
        }
      ]
    }
  }
];
