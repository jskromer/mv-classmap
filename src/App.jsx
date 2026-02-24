import { useState, useEffect } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";

function useAuth() {
  try {
    const { isLoaded, isSignedIn, user } = useUser();
    return { isLoaded, isSignedIn, user, enabled: true };
  } catch {
    return { isLoaded: true, isSignedIn: true, user: null, enabled: false };
  }
}

const C = {
  bg: "#f5f0e8", surface: "#ebe5d9", card: "#ffffff",
  border: "#d4cbbf", white: "#1a1612", text: "#3d3529",
  textSoft: "#6b5f52", textDim: "#998d7e",
  copper: "#b5632e", copperDim: "rgba(181,99,46,0.08)",
  blue: "#2c6fad", blueDim: "rgba(44,111,173,0.06)",
  amber: "#a67c28", amberDim: "rgba(166,124,40,0.08)",
  violet: "#7c5cbf", green: "#2d7d46", greenDim: "rgba(45,125,70,0.08)",
};

const PHASES = [
  {
    id: "intuition",
    num: 1,
    title: "Build Statistical Intuition",
    color: C.blue,
    goal: "You can look at a scatter plot and see a model. You understand what regression does and what the fit metrics mean.",
    checkpoint: "You can explain why CV(RMSE) < 15% doesn't guarantee a good model, and why a scatter plot tells you more than a time series for M&V.",
    steps: [
      { id: "s01", label: "Two Views of Data", time: "10 min", url: "https://cfdesigns.vercel.app/#/fundamentals", site: "cfdesigns", desc: "Same 12 months as time series vs. scatter plot. Why M&V needs the scatter view." },
      { id: "s02", label: "Why Linear Models?", time: "15 min", url: "https://cfdesigns.vercel.app/#/fundamentals", site: "cfdesigns", desc: "Drag your own regression line. Watch residuals update. Click 'Show OLS' to see what the math finds." },
      { id: "s03", label: "What Is a Residual?", time: "15 min", url: "https://cfdesigns.vercel.app/#/fundamentals", site: "cfdesigns", desc: "Click individual points to dissect the error. See squared errors. Spot patterns in residuals." },
      { id: "s04", label: "Goodness of Fit", time: "20 min", url: "https://cfdesigns.vercel.app/#/fundamentals", site: "cfdesigns", desc: "Animated variance decomposition. R², RMSE, CV(RMSE), NMBE — what each tells you and when they lie." },
      { id: "s05", label: "CV(RMSE) Deep Dive", time: "15 min", url: "https://cfdesigns.vercel.app/#/fundamentals", site: "cfdesigns", desc: "The baseload slider: watch CV(RMSE) drop without the model improving. The savings slider: when are savings detectable?" },
    ],
  },
  {
    id: "frequentist",
    num: 2,
    title: "The Frequentist Workbench",
    color: C.amber,
    goal: "You can select a building, choose a model, fit it, validate it, and calculate savings with uncertainty.",
    checkpoint: "You can take monthly utility data, select a change-point model, fit it, validate against ASHRAE Guideline 14, and report savings with a 95% confidence interval.",
    note: "Do this for all three buildings. Each teaches something different about model selection.",
    steps: [
      { id: "s06", label: "Heating Building — Office", time: "15 min", url: "https://cfdesigns.vercel.app/#/workbench", site: "cfdesigns", desc: "50k sq ft office, Chicago. Strong heating slope. Fit a 3-parameter heating model. All 5 workbench steps." },
      { id: "s07", label: "Cooling Building — Retail", time: "15 min", url: "https://cfdesigns.vercel.app/#/workbench", site: "cfdesigns", desc: "25k sq ft retail, Houston. Strong cooling slope. Fit a 3-parameter cooling model. Compare the change point." },
      { id: "s08", label: "Mixed Building — School", time: "20 min", url: "https://cfdesigns.vercel.app/#/workbench", site: "cfdesigns", desc: "75k sq ft school, Nashville. Both heating and cooling. Fit a 5-parameter model. The hardest of the three." },
    ],
  },
  {
    id: "bayesian",
    num: 3,
    title: "The Bayesian Workbench",
    color: C.violet,
    goal: "You understand what changes when you replace frequentist point estimates with Bayesian posterior distributions — and what stays the same.",
    checkpoint: "You can explain the difference between a confidence interval and a credible interval, and why the Bayesian change-point posterior matters.",
    note: "Open the frequentist workbench in a second tab. Same building, same data, side by side.",
    steps: [
      { id: "s09", label: "Heating Building — Bayesian", time: "25 min", url: "https://bayesian-mv.vercel.app/#/workbench", site: "bayesian-mv", desc: "Same office, Bayesian inference. Set priors, watch the posterior update, compare the savings distribution." },
      { id: "s10", label: "Mixed Building — Bayesian", time: "25 min", url: "https://bayesian-mv.vercel.app/#/workbench", site: "bayesian-mv", desc: "The 5P school is the most interesting Bayesian case — the change-point posterior shows genuine uncertainty about where heating stops and cooling starts." },
    ],
  },
  {
    id: "deeper",
    num: 4,
    title: "Go Deeper",
    color: C.copper,
    goal: "You understand the design decisions behind M&V — boundary, duration, adjustments — and can defend them.",
    checkpoint: "You can articulate why you chose that boundary, that baseline period, and how you'd handle a non-routine event.",
    note: "These can be done in any order. Pick what's relevant to your next project.",
    steps: [
      { id: "s11", label: "Measurement Boundary", time: "20 min", url: "https://cfdesigns.vercel.app/#/boundary", site: "cfdesigns", desc: "Where you draw the line determines what the model sees. Whole-facility vs. retrofit isolation tradeoffs." },
      { id: "s12", label: "Duration", time: "20 min", url: "https://cfdesigns.vercel.app/#/duration", site: "cfdesigns", desc: "How many months of baseline? The occupancy trap: same building, opposite savings conclusions depending on which 12 months." },
      { id: "s13", label: "Non-Routine Adjustments", time: "25 min", url: "https://cfdesigns.vercel.app/#/cases", site: "cfdesigns", desc: "A server room appears mid-reporting. A chiller fails during baseline. Toggle adjustments on/off and see the impact." },
      { id: "s14", label: "Beyond One Variable", time: "20 min", url: "https://cfdesigns.vercel.app/#/beyond", site: "cfdesigns", desc: "When monthly temperature isn't enough. Step through adding variables — watch R² go from 0.02 to 0.99." },
      { id: "s15", label: "Architecture of Uncertainty", time: "15 min", url: "https://cfdesigns.vercel.app/#/architecture", site: "cfdesigns", desc: "Epistemic vs. aleatory vs. ontological uncertainty. What we know, what we don't, and what ain't so." },
      { id: "s16", label: "Simulation as Physical Model", time: "15 min", url: "https://cfdesigns.vercel.app/#/simulation", site: "cfdesigns", desc: "When statistical models reach their limits. EnergyPlus, Bayesian calibration, and physics-based counterfactuals." },
    ],
  },
  {
    id: "framework",
    num: 5,
    title: "The Framework",
    color: C.green,
    goal: "You can articulate the three design decisions behind any M&V plan without reaching for protocol labels.",
    checkpoint: "You see Boundary, Model Form, and Duration as design choices — not checkboxes on an IPMVP form.",
    steps: [
      { id: "s17", label: "Counterfactual Designs Course", time: "30 min", url: "https://cfdesigns.vercel.app", site: "cfdesigns", desc: "The capstone. Boundary, Model Form, Duration — three dimensions that translate and sharpen the historic IPMVP Options A–D. After the hands-on work, this framework clicks." },
    ],
  },
  {
    id: "capstone",
    num: 6,
    title: "CMVP Capstone",
    color: "#c0392b",
    goal: "Apply everything to a realistic building. Build a complete M&V plan for a 62,000 sq ft government facility with four ECMs under an ESPC contract.",
    checkpoint: "You have a defensible M&V plan that selects approaches, fits baseline models, handles a non-routine adjustment, and reports savings with uncertainty.",
    note: "Uses EnergyPlus simulation data. The scenario includes a built-in NRA event that masks true savings — you have to find it.",
    steps: [
      { id: "s18", label: "Scenario & Stakeholders", time: "30 min", url: "https://cmvp-capstone.vercel.app", site: "cmvp-capstone", desc: "Meet the Greenfield Municipal Center. Four wings, four ECMs, seven stakeholders. Map risks and interests." },
      { id: "s19", label: "Boundaries & Approach Selection", time: "30 min", url: "https://cmvp-capstone.vercel.app", site: "cmvp-capstone", desc: "Draw measurement boundaries for each ECM. Choose retrofit isolation vs. whole facility. Justify your decisions." },
      { id: "s20", label: "Baseline Model Fitting", time: "45 min", url: "https://cmvp-capstone.vercel.app", site: "cmvp-capstone", desc: "Fit change-point models to monthly utility data. Validate against ASHRAE Guideline 14. Explore what happens when you override the change points." },
      { id: "s21", label: "NRA Protocol & Reporting", time: "30 min", url: "https://cmvp-capstone.vercel.app", site: "cmvp-capstone", desc: "Discover the non-routine event in the reporting data. Design a protocol. Calculate adjusted savings." },
      { id: "s22", label: "Plan Defense", time: "30 min", url: "https://cmvp-capstone.vercel.app", site: "cmvp-capstone", desc: "Assemble your M&V plan and prepare to defend it. Handle tough questions about gas increases, marginal significance, and ESCO disputes." },
    ],
  },
];

const SITE_COLORS = {
  "cfdesigns": C.copper,
  "bayesian-mv": C.violet,
  "cmvp-capstone": "#c0392b",
};

const SITE_LABELS = {
  "cfdesigns": "CF Designs",
  "bayesian-mv": "Bayesian Module",
  "cmvp-capstone": "CMVP Capstone",
};

const STORAGE_KEY = "mv-checklist-progress";

export default function StudentMap() {
  const [checked, setChecked] = useState({});
  const [expandedPhase, setExpandedPhase] = useState("intuition");
  const [loaded, setLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChecked(JSON.parse(saved));
    } catch (e) { /* start fresh */ }
    setLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch (e) { /* won't persist */ }
  }, [checked, loaded]);

  const toggle = (id) => setChecked(prev => ({ ...prev, [id]: !prev[id] }));

  const totalSteps = PHASES.reduce((s, p) => s + p.steps.length, 0);
  const doneSteps = Object.values(checked).filter(Boolean).length;
  const pct = totalSteps > 0 ? Math.round((doneSteps / totalSteps) * 100) : 0;

  const phaseProgress = (phase) => {
    const done = phase.steps.filter(s => checked[s.id]).length;
    return { done, total: phase.steps.length, pct: Math.round((done / phase.steps.length) * 100) };
  };

  const totalTime = () => {
    const mins = PHASES.reduce((s, p) => s + p.steps.reduce((ss, st) => ss + parseInt(st.time), 0), 0);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m > 0 ? m + "m" : ""}`;
  };

  const timeRemaining = () => {
    const mins = PHASES.reduce((s, p) => s + p.steps.filter(st => !checked[st.id]).reduce((ss, st) => ss + parseInt(st.time), 0), 0);
    if (mins === 0) return "Done!";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `~${h}h ${m > 0 ? m + "m" : ""} remaining`;
  };

  const reset = () => { if (confirm("Reset all progress?")) setChecked({}); };

  const { isLoaded, isSignedIn, user, enabled } = useAuth();

  // Loading state
  if (enabled && !isLoaded) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 14, color: C.textDim, fontFamily: "'IBM Plex Sans', sans-serif" }}>Loading…</div>
    </div>
  );

  // Welcome gate for unauthenticated users
  if (enabled && !isSignedIn) return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'IBM Plex Sans', sans-serif", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <div style={{ borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, padding: "72px 24px 64px" }}>
        <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 5, color: C.copper, fontWeight: 600, textTransform: "uppercase", marginBottom: 16, fontFamily: "'IBM Plex Mono', monospace" }}>
            Counterfactual Designs
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 700, color: C.white, margin: "0 0 16px", letterSpacing: -0.5, lineHeight: 1.2 }}>
            Statistical Modeling for<br />Measurement & Verification
          </h1>
          <p style={{ fontSize: 16, color: C.textSoft, lineHeight: 1.75, maxWidth: 500, margin: "0 auto 12px" }}>
            An interactive course in counterfactual reasoning for energy professionals. Six phases, twenty-two modules, ~9.5 hours.
          </p>
          <p style={{ fontSize: 13, color: C.textDim, fontStyle: "italic", marginBottom: 32 }}>
            Based on <em>The Role of the M&V Professional</em> by Steve Kromer (River Publishers, 2024)
          </p>
          <SignInButton mode="modal">
            <button style={{
              background: C.copper, color: "#fff", border: "none", borderRadius: 8,
              padding: "14px 36px", fontSize: 15, fontWeight: 600, cursor: "pointer",
              fontFamily: "'IBM Plex Sans', sans-serif", transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = 0.85}
              onMouseLeave={e => e.currentTarget.style.opacity = 1}>
              Sign In to Start →
            </button>
          </SignInButton>
          <p style={{ fontSize: 12, color: C.textDim, marginTop: 12 }}>
            Free account · Track your progress across all modules
          </p>
        </div>
      </div>

      {/* Course overview (visible to everyone) */}
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ fontSize: 11, letterSpacing: 4, color: C.copper, fontWeight: 600, textTransform: "uppercase", marginBottom: 20, fontFamily: "'IBM Plex Mono', monospace" }}>
          What You'll Learn
        </div>
        {PHASES.map(phase => (
          <div key={phase.id} style={{ display: "flex", gap: 16, marginBottom: 20, alignItems: "flex-start" }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${phase.color}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: phase.color, fontFamily: "'IBM Plex Mono', monospace", flexShrink: 0 }}>
              {phase.num}
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 2 }}>{phase.title}</div>
              <div style={{ fontSize: 13, color: C.textSoft, lineHeight: 1.5 }}>{phase.steps.length} modules · {phase.steps.reduce((s, st) => s + parseInt(st.time), 0)} min</div>
            </div>
          </div>
        ))}
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <SignInButton mode="modal">
            <button style={{
              background: "none", border: `1px solid ${C.border}`, borderRadius: 8,
              padding: "10px 24px", fontSize: 13, fontWeight: 600, color: C.copper,
              cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif",
            }}>
              Sign In to Begin →
            </button>
          </SignInButton>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${C.border}`, padding: "24px", textAlign: "center" }}>
        <div style={{ fontSize: 11, color: C.textDim }}>© 2025 Steve Kromer · SKEE</div>
      </div>
    </div>
  );

  // Signed in — full class map
  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'IBM Plex Sans', sans-serif", color: C.text }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* Auth nav */}
      {enabled && (
        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "8px 24px", borderBottom: `1px solid ${C.border}`, background: C.surface }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, color: C.textDim }}>{user?.primaryEmailAddress?.emailAddress}</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ borderBottom: `1px solid ${C.border}`, background: `linear-gradient(180deg, ${C.surface} 0%, ${C.bg} 100%)`, padding: "48px 24px 40px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <div style={{ fontSize: 11, letterSpacing: 5, color: C.copper, fontWeight: 600, textTransform: "uppercase", marginBottom: 16, fontFamily: "'IBM Plex Mono', monospace" }}>
            Learning Path
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 700, color: C.white, margin: "0 0 12px", letterSpacing: -0.5, lineHeight: 1.2 }}>
            M&V Statistical Modeling — Class Map
          </h1>
          <p style={{ fontSize: 15, color: C.textSoft, lineHeight: 1.7, maxWidth: 520, margin: "0 auto 28px" }}>
            Six phases, twenty-two modules. Check them off as you go.<br />
            Your progress is saved automatically.
          </p>

          {/* Progress bar */}
          <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: C.textDim, marginBottom: 6, fontFamily: "'IBM Plex Mono', monospace" }}>
              <span>{doneSteps} / {totalSteps} modules</span>
              <span>{pct}%</span>
            </div>
            <div style={{ height: 8, background: C.surface, borderRadius: 4, overflow: "hidden", border: `1px solid ${C.border}` }}>
              <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? C.green : C.copper, borderRadius: 4, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 11, color: C.textDim }}>
              <span>Total: {totalTime()}</span>
              <span>{timeRemaining()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px 80px" }}>
        {PHASES.map((phase, pi) => {
          const prog = phaseProgress(phase);
          const isExpanded = expandedPhase === phase.id;
          const isComplete = prog.done === prog.total;

          return (
            <div key={phase.id} style={{ marginBottom: 16 }}>
              {/* Phase header */}
              <div
                onClick={() => setExpandedPhase(isExpanded ? null : phase.id)}
                style={{
                  background: C.card, border: `1px solid ${isExpanded ? phase.color : C.border}`,
                  borderRadius: isExpanded ? "10px 10px 0 0" : 10,
                  padding: "20px 24px", cursor: "pointer", transition: "all 0.2s",
                  borderLeft: `4px solid ${phase.color}`,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: phase.color, fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 2 }}>
                        PHASE {phase.num}
                      </span>
                      {isComplete && (
                        <span style={{ fontSize: 10, background: C.greenDim, color: C.green, padding: "2px 8px", borderRadius: 10, fontWeight: 600 }}>
                          ✓ COMPLETE
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: C.white }}>{phase.title}</div>
                    <div style={{ fontSize: 13, color: C.textSoft, marginTop: 4, lineHeight: 1.5 }}>{phase.goal}</div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 20 }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: isComplete ? C.green : phase.color, fontFamily: "'IBM Plex Mono', monospace" }}>
                      {prog.done}/{prog.total}
                    </div>
                    <div style={{ fontSize: 18, color: C.textDim, marginTop: 4 }}>{isExpanded ? "▲" : "▼"}</div>
                  </div>
                </div>

                {/* Mini progress bar */}
                <div style={{ height: 3, background: C.surface, borderRadius: 2, marginTop: 12, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${prog.pct}%`, background: isComplete ? C.green : phase.color, borderRadius: 2, transition: "width 0.3s ease" }} />
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div style={{ background: C.card, border: `1px solid ${phase.color}`, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "4px 24px 20px" }}>
                  {phase.note && (
                    <div style={{ fontSize: 13, color: phase.color, fontStyle: "italic", padding: "12px 0 8px", borderBottom: `1px solid ${C.border}`, marginBottom: 8 }}>
                      💡 {phase.note}
                    </div>
                  )}

                  {/* Steps */}
                  {phase.steps.map((step, si) => {
                    const isDone = !!checked[step.id];
                    return (
                      <div key={step.id} style={{ display: "flex", gap: 12, padding: "14px 0", borderBottom: si < phase.steps.length - 1 ? `1px solid ${C.border}` : "none", alignItems: "flex-start" }}>
                        {/* Checkbox */}
                        <div
                          onClick={() => toggle(step.id)}
                          style={{
                            width: 24, height: 24, borderRadius: 6, flexShrink: 0, marginTop: 2,
                            border: `2px solid ${isDone ? C.green : C.border}`,
                            background: isDone ? C.greenDim : "transparent",
                            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                            transition: "all 0.15s",
                          }}
                        >
                          {isDone && <span style={{ color: C.green, fontSize: 14, fontWeight: 700 }}>✓</span>}
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                            <a href={step.url} target="_blank" rel="noopener noreferrer"
                              style={{
                                fontSize: 15, fontWeight: 600, textDecoration: "none",
                                color: isDone ? C.textDim : C.white,
                                borderBottom: `1px dashed ${isDone ? "transparent" : SITE_COLORS[step.site]}`,
                              }}>
                              {step.label}
                            </a>
                            <span style={{
                              fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: 600,
                              fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 1,
                              background: isDone ? C.surface : `${SITE_COLORS[step.site]}11`,
                              color: isDone ? C.textDim : SITE_COLORS[step.site],
                            }}>
                              {SITE_LABELS[step.site]}
                            </span>
                            <span style={{ fontSize: 11, color: C.textDim, fontFamily: "'IBM Plex Mono', monospace" }}>
                              {step.time}
                            </span>
                          </div>
                          <div style={{ fontSize: 13, color: isDone ? C.textDim : C.textSoft, lineHeight: 1.6, marginTop: 4, textDecoration: isDone ? "line-through" : "none", textDecorationColor: C.border }}>
                            {step.desc}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Checkpoint */}
                  <div style={{
                    marginTop: 16, padding: "16px 20px", borderRadius: 8,
                    background: isComplete ? C.greenDim : C.surface,
                    border: `1px solid ${isComplete ? C.green : C.border}`,
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: isComplete ? C.green : C.textDim, letterSpacing: 2, fontFamily: "'IBM Plex Mono', monospace", marginBottom: 6 }}>
                      {isComplete ? "✓ CHECKPOINT REACHED" : "CHECKPOINT"}
                    </div>
                    <div style={{ fontSize: 13, color: isComplete ? C.green : C.textSoft, lineHeight: 1.6, fontStyle: isComplete ? "normal" : "italic" }}>
                      {phase.checkpoint}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Footer */}
        <div style={{ marginTop: 32, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginBottom: 24 }}>
            {[
              { label: "Counterfactual Designs Course", url: "https://cfdesigns.vercel.app", color: C.copper },
              { label: "Bayesian Module", url: "https://bayesian-mv.vercel.app", color: C.violet },
              { label: "IPMVP Reference", url: "https://mv-course.vercel.app", color: C.amber },
              { label: "CMVP Capstone", url: "https://cmvp-capstone.vercel.app", color: "#c0392b" },
            ].map(s => (
              <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 13, color: s.color, textDecoration: "none", fontWeight: 600 }}>
                {s.label} →
              </a>
            ))}
          </div>
          <button onClick={reset}
            style={{ fontSize: 11, color: C.textDim, background: "none", border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 16px", cursor: "pointer", fontFamily: "'IBM Plex Sans', sans-serif" }}>
            Reset progress
          </button>
          <div style={{ marginTop: 12 }}>
            <a href="https://counterfactual-designs.com" target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 12, color: C.textDim, textDecoration: "none" }}>
              counterfactual-designs.com
            </a>
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 8 }}>
            Based on <em>The Role of the M&V Professional</em> by Steve Kromer (River Publishers, 2024)
          </div>
        </div>
      </div>
    </div>
  );
}
