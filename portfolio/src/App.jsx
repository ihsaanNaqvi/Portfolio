import React, { useState, useEffect, useRef } from "react";

// ============================================================
//  Syed Ihsaan Abbas Naqvi — Portfolio (single site, 3 modes)
//  Toggle: Engineering · Data Science · Research/PhD
//  Deploy on Vercel / Netlify / GitHub Pages.
// ============================================================

const INK = "#0E1116";
const PAPER = "#FAFAF7";
const MUTED = "#6B7280";
const SUB = "#4B5563";

// Mode-specific accent colors
const MODES = {
  engineering: { key: "engineering", label: "Engineering", accent: "#3D5AFE", tagline: "I ship production software — and the AI that makes it think." },
  data: { key: "data", label: "Data Science", accent: "#7C3AED", tagline: "I turn messy real-world data into models people can trust." },
  research: { key: "research", label: "Research / PhD", accent: "#00897B", tagline: "I research explainable, applied machine learning for real-world impact." },
};

// All projects with a "weight" per mode for ordering (higher = shown first)
const ALL_PROJECTS = [
  {
    title: "Recall AI",
    tag: "Full-Stack AI",
    sub: "AI second brain · production SaaS",
    desc: "An AI-powered personal memory system that ingests PDFs, articles, audio, and webpages, indexes them semantically, and answers questions in natural language. Local-first LLM inference with cloud fallback, vector search, audio transcription, auth, and billing — a complete production product.",
    stack: ["FastAPI", "Next.js", "ChromaDB", "Ollama", "Whisper", "Supabase", "Stripe"],
    link: "https://github.com/ihsaanNaqvi/Recall-AI",
    w: { engineering: 10, data: 8, research: 6 },
  },
  {
    title: "Progressor — AI Learning Platform",
    tag: "AI · Competition Winner",
    sub: "True Tech Arena 2026 — top placement (ЮНОВУС, Tomsk)",
    desc: "An AI-powered personalized learning assistant (Telegram bot + web app) that builds custom learning routes with real, verified resources from YouTube, Wikipedia, arXiv, Open Library, and Coursera. 16 languages, user accounts, and a freemium model. Recognized at the True Tech Arena 2026 System Hack.",
    stack: ["Python", "OpenAI GPT-4o", "Streamlit", "Telegram API", "Docker", "SQLite"],
    link: "https://github.com/ihsaanNaqvi/progressors-bot",
    w: { engineering: 9, data: 8, research: 6 },
  },
  {
    title: "Q-Chem — Quantum Chemistry AI Agent",
    tag: "AI Agent · Team Lead",
    sub: "Autonomous agent for quantum chemistry workflows",
    desc: "Led a team building an AI agent that automates quantum chemistry workflows — generating configurations, converting formats, and orchestrating computation through a conversational interface. Containerized, with a Chainlit-based frontend and a modular Python agent core.",
    stack: ["Python", "Chainlit", "LLM Agents", "Docker"],
    link: "https://github.com/VladimirZhilenkov/q-chem",
    w: { engineering: 8, data: 8, research: 8 },
  },
  {
    title: "Explainable ML for ICU Mortality Prediction",
    tag: "MSc Research",
    sub: "Time-Step SHAP · PhysioNet 2012",
    desc: "MSc final-year research: an explainable ML pipeline predicting in-hospital mortality from 48-hour ICU time-series. Introduces a time-step SHAP attribution method revealing when, not just which, clinical features drive predictions — closing a real interpretability gap in healthcare ML.",
    stack: ["Python", "PyTorch", "SHAP", "scikit-learn"],
    link: null,
    w: { engineering: 4, data: 9, research: 10 },
  },
  {
    title: "VAE-Based Anomaly Detection",
    tag: "Publication · TUSUR 2025",
    sub: "Industrial time-series signals",
    desc: "Published conference paper. A Variational Autoencoder for unsupervised anomaly detection on multivariate industrial sensor data, using reconstruction error and latent-space distance — benchmarked against Isolation Forest and One-Class SVM.",
    stack: ["Python", "PyTorch", "VAE", "Time-Series"],
    link: null,
    w: { engineering: 3, data: 9, research: 10 },
  },
  {
    title: "Multi-Agent Delivery System Simulation",
    tag: "Publication · TPU 2025 (in press)",
    sub: "Constrained urban environments",
    desc: "Conference paper (in press). A simulation study analysing throughput, latency, and routing-failure rates for delivery agents under urban road-network constraints, with proposed optimization strategies.",
    stack: ["Python", "Simulation", "Optimization"],
    link: null,
    w: { engineering: 4, data: 7, research: 9 },
  },
  {
    title: "Medical AI Assistant (GPT-OSS)",
    tag: "Applied ML",
    sub: "Healthcare knowledge retrieval",
    desc: "A medical AI assistant built on open-source GPT models, focused on reliable knowledge retrieval and safe conversational outputs for healthcare contexts, with retrieval-augmented generation to reduce hallucination.",
    stack: ["Python", "LLMs", "RAG", "NLP"],
    link: null,
    w: { engineering: 5, data: 8, research: 7 },
  },
  {
    title: "Automated ML Monitoring System",
    tag: "MLOps",
    sub: "Production reliability",
    desc: "A pipeline that continuously monitors deployed models for data drift and performance degradation, with automated retraining and deployment — bridging data science and production reliability.",
    stack: ["MLflow", "Docker", "Python"],
    link: null,
    w: { engineering: 7, data: 7, research: 5 },
  },
  {
    title: "Halifax Fan Selector",
    tag: "Engineering",
    sub: "UK client · full-stack web app",
    desc: "Modular fan-selection tool for a UK manufacturer. Built the full stack with secure cloud authentication and efficient database-driven product configuration.",
    stack: ["ASP.NET Core", "React", "SQL Server", "Azure AD B2C"],
    link: null,
    w: { engineering: 9, data: 2, research: 1 },
  },
  {
    title: "FATWAA & G2G Analytics Platforms",
    tag: "Engineering",
    sub: "Kuwait government · backend lead",
    desc: "Led backend development for government analytics systems, improving data-reporting efficiency by ~35%. Built with asynchronous messaging and a component-rich Blazor UI.",
    stack: ["ASP.NET Core", "Blazor", "RabbitMQ", "Radzen"],
    link: null,
    w: { engineering: 8, data: 3, research: 1 },
  },
  {
    title: "IT Help Desk Portal",
    tag: "Engineering",
    sub: "Askari Bank · internal service tool",
    desc: "Internal IT service-management portal that reduced ticket-resolution time by ~25% through workflow automation, serving banking staff at scale.",
    stack: ["ASP.NET", "SQL Server", "Web API"],
    link: null,
    w: { engineering: 7, data: 2, research: 1 },
  },
];

const EXPERIENCE = [
  { role: "Software Engineer", org: "GreyBeard Support (UK)", date: "May 2024 — Present", note: "Full-stack apps with ASP.NET Core & React; Azure AD B2C; ~20% performance gains." },
  { role: "Software Engineer", org: "Business Analytics / DPS Kuwait", date: "Apr 2023 — May 2024", note: "Enterprise Blazor + RabbitMQ systems for government analytics; ~30% efficiency gains." },
  { role: "Software Engineer", org: "Askari Bank ITG", date: "Jan 2021 — Apr 2023", note: "Banking IT portal & API integrations; ~25% faster ticket resolution." },
  { role: "Full-Stack Developer", org: "Synergy IT (Denmark clients)", date: "Jan 2018 — Dec 2019", note: "ASP.NET Core & React for Danish clients; SQL optimization." },
];

const TEACHING = [
  { role: "Lecturer — Computer Science & Data Science", org: "Tomsk State University", date: "2025 — Present", note: "Teaching CS and data science; mentoring students in ML and software engineering." },
  { role: "Lecturer — Computer Science & English", org: "Air University, Islamabad", date: "2020 — Present", note: "Undergraduate CS and technical communication; curriculum and assessment design." },
];

const SKILLS = {
  "Backend": ["C#", "ASP.NET Core", "Web API", "Blazor", "FastAPI", "Entity Framework", "RabbitMQ"],
  "Frontend": ["React.js", "Next.js", "TypeScript", "Tailwind", "Bootstrap"],
  "Data & ML": ["Python", "PyTorch", "TensorFlow", "scikit-learn", "Hugging Face", "SHAP", "LLMs / RAG"],
  "Data Infra": ["ChromaDB", "Apache Spark", "Hadoop", "SQL Server", "PostgreSQL", "Supabase"],
  "Cloud & DevOps": ["Docker", "Azure", "Vercel", "Railway", "CI/CD", "MLflow", "Git"],
};

function useReveal() {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, shown];
}

function Reveal({ children, delay = 0 }) {
  const [ref, shown] = useReveal();
  return (
    <div ref={ref} style={{
      opacity: shown ? 1 : 0,
      transform: shown ? "translateY(0)" : "translateY(22px)",
      transition: `opacity .6s ease ${delay}s, transform .6s cubic-bezier(.2,.7,.2,1) ${delay}s`,
    }}>{children}</div>
  );
}

export default function App() {
  const [mode, setMode] = useState("engineering");
  const M = MODES[mode];
  const accent = M.accent;

  const reduceMotion = typeof window !== "undefined" &&
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Sort projects by weight for current mode, show all
  const projects = [...ALL_PROJECTS].sort((a, b) => b.w[mode] - a.w[mode]);

  const stats = {
    engineering: [["5+", "Years engineering"], ["3", "Production AI apps"], ["4", "Countries' clients"], ["24", "GitHub repos"]],
    data: [["3", "Flagship AI/ML projects"], ["2", "Published papers"], ["1", "Hackathon win"], ["5.0", "MSc CGPA"]],
    research: [["2", "Conference papers"], ["5.0", "MSc CGPA"], ["8.0", "IELTS band"], ["5+", "Years applied work"]],
  };

  return (
    <div style={{ background: PAPER, color: INK, fontFamily: "'Inter', system-ui, sans-serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: ${reduceMotion ? "auto" : "smooth"}; }
        a { color: inherit; text-decoration: none; }
        ::selection { background: ${accent}; color: #fff; }
        .display { font-family: 'Space Grotesk', sans-serif; }
        .navlink { font-size: 14px; font-weight: 500; color: ${MUTED}; transition: color .2s; }
        .navlink:hover { color: ${INK}; }
        .toggle { display: inline-flex; background: #fff; border: 1px solid #E3E3DC; border-radius: 100px; padding: 4px; gap: 2px; }
        .toggle button { border: none; background: transparent; font-family: 'Inter'; font-size: 13.5px; font-weight: 500; color: ${MUTED}; padding: 9px 18px; border-radius: 100px; cursor: pointer; transition: all .25s; white-space: nowrap; }
        .toggle button.on { color: #fff; }
        .card { background: #fff; border: 1px solid #ECECE4; border-radius: 18px; padding: 24px; transition: transform .3s cubic-bezier(.2,.7,.2,1), box-shadow .3s, border-color .3s; height: 100%; display: flex; flex-direction: column; }
        .card:hover { transform: translateY(-6px); box-shadow: 0 24px 48px -24px rgba(14,17,22,.2); }
        .pill { font-size: 11.5px; font-weight: 500; color: ${MUTED}; background: ${PAPER}; border: 1px solid #ECECE4; padding: 4px 10px; border-radius: 7px; }
        .btn { display: inline-flex; align-items: center; gap: 8px; padding: 13px 24px; border-radius: 100px; font-weight: 600; font-size: 15px; transition: transform .2s; }
        .btn:hover { transform: translateY(-2px); }
        .exprow { display: grid; grid-template-columns: 1fr 1.3fr; gap: 20px; padding: 22px 0; border-top: 1px solid #ECECE4; }
        .repolink { font-size: 12.5px; font-weight: 600; margin-top: 14px; display: inline-flex; align-items: center; gap: 5px; }
        @media (max-width: 720px) {
          .hero-h1 { font-size: 40px !important; }
          .exprow { grid-template-columns: 1fr; gap: 6px; }
          .nav-links { display: none !important; }
          .grid2 { grid-template-columns: 1fr !important; }
          .toggle button { padding: 8px 13px; font-size: 12.5px; }
        }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(250,250,247,.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #ECECE4" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "14px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <a href="#top" className="display" style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.1, letterSpacing: -0.4 }}>
            SYED IHSAAN ABBAS NAQVI<span style={{ color: accent }}></span>
            <span style={{ display: "block", fontSize: 10.5, fontWeight: 500, color: MUTED, letterSpacing: 0, marginTop: 1 }}>Syed Ihsaan Abbas Naqvi</span>
          </a>
          <div className="nav-links" style={{ display: "flex", gap: 28 }}>
            <a className="navlink" href="#work">Work</a>
            <a className="navlink" href="#experience">Experience</a>
            <a className="navlink" href="#skills">Skills</a>
            <a className="navlink" href="#contact">Contact</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header id="top" style={{ position: "relative", maxWidth: 1080, margin: "0 auto", padding: "70px 28px 60px" }}>
        <div style={{ position: "absolute", top: 30, right: -60, width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle at 30% 30%, ${accent}22, transparent 70%)`, animation: reduceMotion ? "none" : "float 7s ease-in-out infinite", pointerEvents: "none", transition: "background .4s" }} />

        {/* MODE TOGGLE */}
        <Reveal>
          <div style={{ marginBottom: 30 }}>
            <div style={{ fontSize: 12.5, color: MUTED, marginBottom: 10, fontWeight: 500 }}>I'm here for —</div>
            <div className="toggle">
              {Object.values(MODES).map((m) => (
                <button key={m.key} className={mode === m.key ? "on" : ""}
                  style={{ background: mode === m.key ? m.accent : "transparent" }}
                  onClick={() => setMode(m.key)}>{m.label}</button>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <h1 className="display hero-h1" style={{ fontSize: 58, lineHeight: 1.04, letterSpacing: -1.8, fontWeight: 700, maxWidth: 860, transition: "color .3s" }}>
            {M.tagline}
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <p style={{ fontSize: 18.5, lineHeight: 1.6, color: SUB, maxWidth: 640, marginTop: 24 }}>
            I'm Syed Ihsaan Abbas Naqvi — a full-stack engineer with 5+ years of professional experience, an MSc in Data Science (CGPA 5.0/5.0), two published papers, and a hackathon-winning AI product. I work across production engineering and applied machine learning.
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <div style={{ display: "flex", gap: 13, marginTop: 34, flexWrap: "wrap" }}>
            <a className="btn" style={{ background: INK, color: "#fff" }} href="#work">View my work →</a>
            <a className="btn" style={{ border: "1px solid #DADAD2", color: INK }} href="#contact">Get in touch</a>
          </div>
        </Reveal>
        <Reveal delay={0.22}>
          <div style={{ display: "flex", gap: 38, marginTop: 56, flexWrap: "wrap" }}>
            {stats[mode].map(([n, l]) => (
              <div key={l}>
                <div className="display" style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1, color: accent, transition: "color .3s" }}>{n}</div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </header>

      {/* WORK */}
      <section id="work" style={{ maxWidth: 1080, margin: "0 auto", padding: "50px 28px" }}>
        <Reveal>
          <div style={{ fontSize: 13, fontWeight: 600, color: accent, letterSpacing: 1, textTransform: "uppercase", transition: "color .3s" }}>Selected Work</div>
          <h2 className="display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1, marginTop: 8, marginBottom: 28 }}>
            {mode === "engineering" ? "Systems I've shipped" : mode === "data" ? "Models & ML systems" : "Research & applied ML"}
          </h2>
        </Reveal>
        <div className="grid2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={(i % 2) * 0.05}>
              <div className="card">
                <span style={{ fontSize: 12, fontWeight: 600, color: accent, background: `${accent}14`, padding: "5px 11px", borderRadius: 7, alignSelf: "flex-start", transition: "all .3s" }}>{p.tag}</span>
                <h3 className="display" style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.2, marginTop: 14 }}>{p.title}</h3>
                <div style={{ fontSize: 13.5, color: MUTED, marginTop: 5, fontWeight: 500 }}>{p.sub}</div>
                <p style={{ fontSize: 14.5, lineHeight: 1.6, color: SUB, marginTop: 13, flex: 1 }}>{p.desc}</p>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 16 }}>
                  {p.stack.map((s) => <span key={s} className="pill">{s}</span>)}
                </div>
                {p.link && <a className="repolink" style={{ color: accent }} href={p.link} target="_blank" rel="noreferrer">View on GitHub →</a>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ maxWidth: 1080, margin: "0 auto", padding: "50px 28px" }}>
        <Reveal>
          <div style={{ fontSize: 13, fontWeight: 600, color: accent, letterSpacing: 1, textTransform: "uppercase", transition: "color .3s" }}>Experience</div>
          <h2 className="display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1, marginTop: 8, marginBottom: 10 }}>Professional background</h2>
        </Reveal>
        {EXPERIENCE.map((e, i) => (
          <Reveal key={e.org} delay={i * 0.04}>
            <div className="exprow">
              <div>
                <div className="display" style={{ fontSize: 18, fontWeight: 600 }}>{e.role}</div>
                <div style={{ fontSize: 14.5, color: accent, fontWeight: 500, marginTop: 4, transition: "color .3s" }}>{e.org}</div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{e.date}</div>
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: SUB, alignSelf: "center" }}>{e.note}</p>
            </div>
          </Reveal>
        ))}

        {/* Teaching — shown in all modes, framed as secondary except research */}
        <Reveal>
          <h3 className="display" style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5, marginTop: 40, marginBottom: 4 }}>
            {mode === "research" ? "Teaching & Academic Experience" : "Teaching Experience"}
          </h3>
          <p style={{ fontSize: 14, color: MUTED, marginBottom: 6 }}>
            {mode === "research"
              ? "University-level teaching — directly relevant to research assistant and teaching assistant roles."
              : "University teaching alongside engineering — sharpening communication and mentoring."}
          </p>
        </Reveal>
        {TEACHING.map((e, i) => (
          <Reveal key={e.org} delay={i * 0.04}>
            <div className="exprow">
              <div>
                <div className="display" style={{ fontSize: 18, fontWeight: 600 }}>{e.role}</div>
                <div style={{ fontSize: 14.5, color: accent, fontWeight: 500, marginTop: 4, transition: "color .3s" }}>{e.org}</div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{e.date}</div>
              </div>
              <p style={{ fontSize: 14.5, lineHeight: 1.6, color: SUB, alignSelf: "center" }}>{e.note}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* EDUCATION */}
      <section style={{ maxWidth: 1080, margin: "0 auto", padding: "50px 28px" }}>
        <Reveal>
          <div style={{ fontSize: 13, fontWeight: 600, color: accent, letterSpacing: 1, textTransform: "uppercase", transition: "color .3s" }}>Education</div>
          <h2 className="display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1, marginTop: 8, marginBottom: 18 }}>Academic foundation</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
          {[
            ["MSc — Big Data & Data Science", "Tomsk State University", "2024 — 2026 · CGPA 5.0/5.0"],
            ["BS — Information Technology", "Abbottabad University of Science & Tech", "2015 — 2019 · CGPA 3.55/4.0"],
            ["English Proficiency", "IELTS", "Band 8.0 (Fluent)"],
          ].map(([t, s, d], i) => (
            <Reveal key={t} delay={i * 0.05}>
              <div className="card" style={{ padding: 22 }}>
                <div className="display" style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.25 }}>{t}</div>
                <div style={{ fontSize: 14, color: accent, marginTop: 6, fontWeight: 500, transition: "color .3s" }}>{s}</div>
                <div style={{ fontSize: 13, color: MUTED, marginTop: 4 }}>{d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ maxWidth: 1080, margin: "0 auto", padding: "50px 28px" }}>
        <Reveal>
          <div style={{ fontSize: 13, fontWeight: 600, color: accent, letterSpacing: 1, textTransform: "uppercase", transition: "color .3s" }}>Toolkit</div>
          <h2 className="display" style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1, marginTop: 8, marginBottom: 26 }}>What I work with</h2>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
          {Object.entries(SKILLS).map(([cat, items], i) => (
            <Reveal key={cat} delay={i * 0.04}>
              <div className="card" style={{ padding: 20 }}>
                <div className="display" style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 12 }}>{cat}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                  {items.map((s) => <span key={s} className="pill">{s}</span>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ maxWidth: 1080, margin: "0 auto", padding: "60px 28px 40px" }}>
        <Reveal>
          <div style={{ background: INK, borderRadius: 26, padding: "56px 42px", color: "#fff", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -80, right: -40, width: 280, height: 280, borderRadius: "50%", background: `radial-gradient(circle, ${accent}55, transparent 70%)`, transition: "background .4s" }} />
            <div style={{ position: "relative" }}>
              <h2 className="display" style={{ fontSize: 38, fontWeight: 700, letterSpacing: -1.1, maxWidth: 560, lineHeight: 1.07 }}>Let's build something that lasts.</h2>
              <p style={{ fontSize: 16.5, color: "#A8B0BD", marginTop: 16, maxWidth: 480, lineHeight: 1.6 }}>
                Open to full-stack & ML engineering roles, data science positions, and PhD / research opportunities. Remote or relocation.
              </p>
              <div style={{ display: "flex", gap: 13, marginTop: 32, flexWrap: "wrap" }}>
                <a className="btn" style={{ background: "#fff", color: INK }} href="mailto:ihsaannaqvi@gmail.com">Email me</a>
                <a className="btn" style={{ border: "1px solid #3A414D", color: "#fff" }} href="https://wa.me/923229232022" target="_blank" rel="noreferrer">WhatsApp</a>
                <a className="btn" style={{ border: "1px solid #3A414D", color: "#fff" }} href="https://www.linkedin.com/in/syed-ihsaan-abbas-naqvi-a89b32154/" target="_blank" rel="noreferrer">LinkedIn</a>
                <a className="btn" style={{ border: "1px solid #3A414D", color: "#fff" }} href="https://github.com/ihsaanNaqvi" target="_blank" rel="noreferrer">GitHub</a>
              </div>
              <div style={{ marginTop: 32, display: "flex", gap: 24, flexWrap: "wrap", fontSize: 14, color: "#8B93A1" }}>
                <span>ihsaannaqvi@gmail.com</span>
                <span>WhatsApp: +92 322 9232022</span>
                <span>WhatsApp / Call: +7 952 880 4265</span>
                <span>Tomsk, Russia</span>
              </div>
            </div>
          </div>
        </Reveal>
        <footer style={{ textAlign: "center", padding: "40px 0 10px", fontSize: 13, color: MUTED }}>
          © {new Date().getFullYear()} Syed Ihsaan Abbas Naqvi · Built with React
        </footer>
      </section>
    </div>
  );
}
