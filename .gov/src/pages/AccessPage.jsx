import React, { useEffect, useMemo, useState } from "react";
import {
  Lock, Mail, User, Building2, ChevronDown, ArrowRight, Phone,
  ShieldCheck, Clock, HelpCircle, Landmark, Upload,
} from "lucide-react";
import heroAccessUrl from "../assets/hero-dataupdate.png";
import ashokaEmblemUrl from "../assets/ashoka-emblem.svg";
import {
  signIn, signUpRequestAccess, subscribe, getSession, signOutUser, isRemote,
} from "../services/authClient";

const NAV = [
  { label: "About", href: "#/" },
  { label: "Overview", href: "#/dashboard" },
  { label: "Watchlist", href: "#/watchlist" },
  { label: "Analytics", href: "#/analytics" },
];

const DESIGNATIONS = ["Joint Secretary", "Director", "Deputy Secretary", "Under Secretary", "Section Officer", "Analyst", "Consultant"];
const MINISTRIES = [
  "Ministry of Railways", "Ministry of Road Transport & Highways", "Ministry of Petroleum & Natural Gas",
  "Ministry of Power", "Ministry of Housing & Urban Affairs", "Ministry of Jal Shakti",
  "NITI Aayog", "MoSPI", "Other",
];
const STATES = ["Delhi", "Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Uttar Pradesh", "Odisha", "Jharkhand", "Telangana", "Other"];
const ROLES = [
  { id: "official", icon: User, title: "Government Official", desc: "Central / State Government officials" },
  { id: "analyst", icon: Building2, title: "Ministry Analyst", desc: "Analysts and research teams in line ministries" },
  { id: "nodal", icon: Landmark, title: "State Nodal Officer", desc: "State-level project monitoring officials" },
  { id: "partner", icon: ShieldCheck, title: "Authorized Partner", desc: "Researchers, development partners, or authorized agencies" },
];

function SessionBadge({ session }) {
  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-[#e6e9ee] shadow-[0_14px_40px_rgba(11,37,69,0.12)] p-8 max-w-md w-full text-center">
          <img src={ashokaEmblemUrl} alt="State Emblem of India" className="h-10 w-auto mx-auto national-emblem-dark" />
          <h1 className="font-serif text-2xl font-bold text-[#0b2545] mt-4">You're signed in</h1>
          <p className="text-sm text-[#5b7186] mt-1">{session.email}</p>
          <div className="mt-4 inline-flex items-center gap-2 bg-[#eef4fb] border border-[#d9e6f5] text-[#0b4f7d] text-xs font-semibold px-3 py-1.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> {session.role || "Government Official"}
          </div>
          <div className="mt-6 flex flex-col gap-2.5">
            <a href="#/dashboard" className="bg-[#0b2545] hover:bg-[#123a5e] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
              Enter PRAGATI Dashboard →
            </a>
            <button onClick={() => signOutUser()} className="border border-[#dbe2ea] hover:bg-[#f5f8fb] text-[#334155] text-sm font-semibold py-2.5 rounded-lg transition-colors">
              Sign out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AccessPage() {
  const [mode, setMode] = useState("signin"); // signin | request
  const [session, setSession] = useState(getSession());
  const [toast, setToast] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  /* sign-in form */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /* request-access wizard */
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    fullName: "", emailId: "", phone: "", designation: "", organization: "", stateUt: "",
    role: "official", purpose: "", docName: "",
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e?.target?.value ?? e }));

  useEffect(() => subscribe(setSession), []);

  const notify = (m) => {
    setToast(m);
    setTimeout(() => setToast(""), 3200);
  };

  async function handleSignIn(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const s = await signIn(email, password);
      notify(`Welcome back, ${s.name}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDemo() {
    setError("");
    setBusy(true);
    try {
      const { signInDemoOfficer } = await import("../services/authClient");
      const s = await signInDemoOfficer();
      notify(`Signed in as ${s.name} (demo officer).`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function validateStep1() {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.emailId)) return "Enter a valid official email.";
    if (!form.phone.trim()) return "Phone number is required.";
    if (!form.designation) return "Select your designation.";
    if (!form.organization) return "Select your organization / ministry.";
    return "";
  }

  function nextStep() {
    if (step === 1) {
      const v = validateStep1();
      if (v) { setError(v); return; }
      setError("");
    }
    if (step === 4) { submitRequest(); return; }
    setStep((s) => Math.min(4, s + 1));
  }

  async function submitRequest() {
    setError("");
    setBusy(true);
    try {
      const tempPassword = "pragati-" + Math.random().toString(36).slice(2, 10);
      const res = await signUpRequestAccess({
        fullName: form.fullName,
        email: form.emailId,
        phone: form.phone,
        role: ROLES.find((r) => r.id === form.role)?.title || form.role,
        organization: form.organization,
        stateUt: form.stateUt,
        purpose: form.purpose,
        /* Pass the generated password through so the stored account actually
           works with the credentials we show the requester (this was missing
           before — the account was created with password undefined). */
        password: tempPassword,
      });
      notify(res.needsEmailConfirm
        ? "Request submitted. Check your email to confirm the account."
        : "Request submitted. You can now sign in with your email and the temporary password shown.");
      if (!res.needsEmailConfirm) {
        setToast("");
        setError("");
        setNotice(`Request approved for preview. Sign in with ${form.emailId} and temporary password: ${tempPassword}`);
        // Seed the preview account with the same password we showed.
        setMode("signin");
        setEmail(form.emailId);
        setPassword(tempPassword);
        setStep(1);
        return;
      }
      setMode("signin");
      setEmail(form.emailId);
      setStep(1);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const stepper = useMemo(() => ["Basic Information", "Role & Organization", "Justification", "Review & Submit"], []);

  if (session) return <SessionBadge session={session} />;

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <header className="bg-white border-b border-[#e6e9ee] px-5 h-[58px] flex items-center justify-between shrink-0">
        <a className="flex items-center gap-2.5" href="#/">
          <img src={ashokaEmblemUrl} alt="State Emblem of India" className="h-8 w-auto national-emblem-dark" draggable="false" />
          <span className="font-serif text-[19px] font-bold text-[#0b2545] tracking-wide">PRAGATI</span>
          <span className="hidden sm:block w-px h-7 bg-[#dbe2ea] mx-1" />
          <span className="hidden sm:block text-[10.5px] leading-tight text-[#5b7186] font-medium">National Infrastructure<br />Intelligence</span>
        </a>
        <nav className="hidden md:flex items-center gap-6 text-[13px] text-[#4b5768]">
          {NAV.map((n) => <a key={n.label} href={n.href} className="hover:text-[#0b2545] font-medium">{n.label}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#5b7186] hidden sm:inline">Already have an account?</span>
          <button
            onClick={() => { setMode(mode === "signin" ? "request" : "signin"); setError(""); setNotice(""); }}
            className="text-xs font-bold text-[#0b4f7d] hover:text-[#0b2545] border-b border-[#0b4f7d] pb-0.5"
          >
            {mode === "signin" ? "Request Access →" : "Sign In →"}
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-[380px_minmax(0,1fr)_320px] gap-5 px-5 py-6">
        {/* Left hero panel — reference blend */}
        <aside className="relative rounded-2xl overflow-hidden hidden lg:flex flex-col justify-between min-h-[640px] shadow-[0_14px_40px_rgba(11,37,69,0.18)]">
          <div className="absolute inset-0" style={{ backgroundImage: `url(${heroAccessUrl})`, backgroundSize: "cover", backgroundPosition: "center 30%" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(11,27,48,0.78) 0%, rgba(11,37,69,0.55) 42%, rgba(11,31,53,0.24) 78%, rgba(11,27,48,0.55) 100%)" }} />
          <div className="relative z-10 p-7">
            <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.14em] text-[#cfe0f2] uppercase mb-3">
              <span className="w-6 h-px bg-[#F97316]" /> Join PRAGATI
            </div>
            <h2 className="font-serif text-[30px] leading-[1.15] text-white font-bold drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
              Access for a<br />More Resilient India.
            </h2>
            <p className="text-[12.5px] text-[#dbe7f4] mt-3 leading-relaxed max-w-[300px]">
              Request access to PRAGATI and be part of a unified effort to monitor, de-risk and accelerate India's infrastructure development.
            </p>
          </div>
          <div className="relative z-10 px-7 pb-6 space-y-5">
            {[
              { icon: Building2, t: "Role-based Access", d: "Secure, role-specific access for government officials and authorized partners." },
              { icon: ShieldCheck, t: "Trusted & Secure", d: "Built on Government of India security standards and data governance frameworks." },
              { icon: Clock, t: "Enable Better Decisions", d: "Access real-time data, analytics and intelligence to drive impactful outcomes." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="flex items-start gap-3.5">
                <div className="w-9 h-9 rounded-full bg-white/12 border border-white/25 grid place-items-center text-white shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white">{t}</p>
                  <p className="text-[11px] text-[#c9d8e8] leading-snug mt-0.5">{d}</p>
                </div>
              </div>
            ))}
            <div className="pt-2 border-t border-white/15">
              <p className="font-serif italic text-[13px] text-[#eaf2fb] leading-snug">"Better data. Stronger decisions.<br />A more resilient India."</p>
              <span className="text-[10px] font-bold tracking-widest text-[#9fb6cd] uppercase mt-1 block">— PRAGATI</span>
            </div>
          </div>
        </aside>

        {/* Center: form card */}
        <section className="bg-white rounded-2xl border border-[#e6e9ee] shadow-[0_10px_30px_rgba(11,37,69,0.08)] p-6 sm:p-8 self-start w-full">
          {mode === "signin" ? (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-serif text-[26px] font-bold text-[#0b2545]">Sign in to PRAGATI</h1>
                  <p className="text-[12.5px] text-[#5b7186] mt-1">Use your official government credentials.</p>
                </div>
                <button onClick={() => { setMode("request"); setError(""); }} className="text-xs font-bold text-[#0b4f7d] hover:text-[#0b2545] whitespace-nowrap pt-1">
                  No account? Request access →
                </button>
              </div>

              <form onSubmit={handleSignIn} className="mt-6 space-y-4 max-w-md">
                <label className="block">
                  <span className="text-[12px] font-semibold text-[#334155]">Official Email ID <b className="text-[#d64545]">*</b></span>
                  <div className="mt-1.5 flex items-center gap-2 border border-[#dbe2ea] rounded-lg px-3 h-11 focus-within:border-[#0b4f7d] bg-white">
                    <Mail className="w-4 h-4 text-[#8aa0b5]" />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="name@nic.in" className="flex-1 text-sm outline-none bg-transparent" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-[12px] font-semibold text-[#334155]">Password <b className="text-[#d64545]">*</b></span>
                  <div className="mt-1.5 flex items-center gap-2 border border-[#dbe2ea] rounded-lg px-3 h-11 focus-within:border-[#0b4f7d] bg-white">
                    <Lock className="w-4 h-4 text-[#8aa0b5]" />
                    <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" className="flex-1 text-sm outline-none bg-transparent" />
                  </div>
                </label>

                {error && <p className="text-[12px] text-[#d64545] bg-[#fdeaea] border border-[#f3d0d0] rounded-lg px-3 py-2">{error}</p>}
                {notice && <p className="text-[12px] text-[#0b6e3f] bg-[#e9f7ef] border border-[#cdebd8] rounded-lg px-3 py-2">{notice}</p>}

                <button type="submit" disabled={busy} className="w-full bg-[#0b2545] hover:bg-[#123a5e] disabled:opacity-60 text-white text-sm font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </button>
                <button type="button" onClick={handleDemo} disabled={busy} className="w-full border border-[#c9d7e6] hover:bg-[#f3f8fd] text-[#0b4f7d] text-sm font-bold py-2.5 rounded-lg transition-colors">
                  Enter as Demo Officer (A. Sharma)
                </button>
                <p className="text-[11px] text-[#8aa0b5] text-center">
                  {isRemote ? "Secured by Supabase Auth." : "Preview mode: accounts are stored locally until Supabase keys are configured."}
                </p>
              </form>
            </>
          ) : (
            <>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="font-serif text-[26px] font-bold text-[#0b2545]">Request Access</h1>
                  <p className="text-[12.5px] text-[#5b7186] mt-1">Fill in your details to request access. Your request will be reviewed by the PRAGATI team.</p>
                </div>
                <button onClick={() => { setMode("signin"); setError(""); }} className="text-xs font-bold text-[#0b4f7d] hover:text-[#0b2545] whitespace-nowrap pt-1">
                  Already have an account? <span className="border-b border-[#0b4f7d]">Sign In</span> →
                </button>
              </div>

              {/* Stepper */}
              <div className="mt-6 flex items-center">
                {stepper.map((label, i) => (
                  <React.Fragment key={label}>
                    {i > 0 && <div className={`flex-1 h-px ${i < step ? "bg-[#0b4f7d]" : "bg-[#e2e8f0]"}`} />}
                    <div className="flex flex-col items-center gap-1.5 px-1">
                      <div className={`w-8 h-8 rounded-full grid place-items-center text-[12px] font-bold border-2 transition-colors ${i + 1 < step ? "bg-[#0b4f7d] border-[#0b4f7d] text-white" : i + 1 === step ? "bg-[#0b4f7d] border-[#0b4f7d] text-white ring-4 ring-[#0b4f7d]/15" : "bg-white border-[#dbe2ea] text-[#8aa0b5]"}`}>
                        {i + 1 < step ? "✓" : i + 1}
                      </div>
                      <span className={`text-[10.5px] font-semibold whitespace-nowrap ${i + 1 <= step ? "text-[#0b2545]" : "text-[#8aa0b5]"}`}>{label}</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div className="mt-7 space-y-5">
                {step === 1 && (
                  <>
                    <h3 className="font-serif text-[17px] font-bold text-[#0b2545]">1. Basic Information</h3>
                    <p className="text-[11.5px] text-[#7c8798] -mt-3">Provide your official details to get started.</p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Full Name" required value={form.fullName} onChange={set("fullName")} placeholder="Enter your full name" icon={User} />
                      <Field label="Official Email ID" required value={form.emailId} onChange={set("emailId")} placeholder="name@nic.in" icon={Mail} type="email" />
                      <Field label="Phone Number" required value={form.phone} onChange={set("phone")} placeholder="Enter your mobile number" prefix="+91" />
                      <Select label="Designation" required value={form.designation} onChange={set("designation")} placeholder="Select designation" options={DESIGNATIONS} />
                      <Select label="Organization / Ministry" required value={form.organization} onChange={set("organization")} placeholder="Select ministry / department" options={MINISTRIES} />
                      <Select label="State / UT (if applicable)" value={form.stateUt} onChange={set("stateUt")} placeholder="Select state / UT" options={STATES} />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <h3 className="font-serif text-[17px] font-bold text-[#0b2545]">2. Access Role</h3>
                    <p className="text-[11.5px] text-[#7c8798] -mt-3">Select the role that best matches your responsibilities.</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {ROLES.map(({ id, icon: Icon, title, desc }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setForm((f) => ({ ...f, role: id }))}
                          className={`text-left rounded-xl border-2 p-4 transition-all ${form.role === id ? "border-[#0b4f7d] bg-[#f2f8fd] shadow-[0_4px_14px_rgba(11,79,125,0.12)]" : "border-[#e6e9ee] bg-white hover:border-[#c9d7e6]"}`}
                        >
                          <Icon className={`w-5 h-5 ${form.role === id ? "text-[#0b4f7d]" : "text-[#5b7186]"}`} />
                          <p className="text-[12.5px] font-bold text-[#0b2545] mt-2">{title}</p>
                          <p className="text-[10.5px] text-[#7c8798] mt-1 leading-snug">{desc}</p>
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <h3 className="font-serif text-[17px] font-bold text-[#0b2545]">3. Purpose of Access</h3>
                    <p className="text-[11.5px] text-[#7c8798] -mt-3">Tell us how you plan to use PRAGATI. This helps us route your request to the right approver.</p>
                    <textarea
                      value={form.purpose}
                      onChange={set("purpose")}
                      rows={5}
                      maxLength={500}
                      placeholder="Please describe the purpose of access, your role in project monitoring, and the specific information you need."
                      className="w-full border border-[#dbe2ea] rounded-xl px-3.5 py-3 text-sm outline-none focus:border-[#0b4f7d] resize-y bg-white"
                    />
                    <div className="text-right text-[10.5px] text-[#8aa0b5]">{form.purpose.length} / 500</div>
                    <div className="border-2 border-dashed border-[#c9d7e6] rounded-xl p-5 text-center bg-[#fafcfe]">
                      <Upload className="w-5 h-5 text-[#0b4f7d] mx-auto" />
                      <p className="text-[12.5px] font-semibold text-[#334155] mt-1.5">Drag and drop file here or click to upload</p>
                      <p className="text-[10.5px] text-[#8aa0b5] mt-0.5">Accepted formats: PDF, JPG, PNG (Max 5 MB) — optional</p>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <h3 className="font-serif text-[17px] font-bold text-[#0b2545]">4. Review & Submit</h3>
                    <p className="text-[11.5px] text-[#7c8798] -mt-3">Confirm your details before submitting the request.</p>
                    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2.5 text-[12.5px]">
                      {[
                        ["Full Name", form.fullName], ["Official Email", form.emailId], ["Phone", `+91 ${form.phone}`],
                        ["Designation", form.designation], ["Organization", form.organization], ["State / UT", form.stateUt || "—"],
                        ["Access Role", ROLES.find((r) => r.id === form.role)?.title], ["Purpose", form.purpose || "—"],
                      ].map(([k, v]) => (
                        <div key={k} className="flex gap-2 py-1.5 border-b border-[#eef1f5]">
                          <span className="text-[#7c8798] min-w-[110px]">{k}</span>
                          <span className="font-semibold text-[#0b2545]">{v}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {error && <p className="text-[12px] text-[#d64545] bg-[#fdeaea] border border-[#f3d0d0] rounded-lg px-3 py-2">{error}</p>}

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => { setError(""); setStep((s) => Math.max(1, s - 1)); }}
                    className={`text-sm font-semibold text-[#5b7186] hover:text-[#0b2545] ${step === 1 ? "invisible" : ""}`}
                  >
                    ← Back
                  </button>
                  <div className="flex gap-2.5">
                    <button type="button" onClick={() => notify("Draft saved locally.")} className="border border-[#dbe2ea] hover:bg-[#f5f8fb] text-[#334155] text-[13px] font-semibold px-4 py-2.5 rounded-lg">
                      Save as Draft
                    </button>
                    <button type="button" onClick={nextStep} disabled={busy} className="bg-[#0b4f7d] hover:bg-[#0b2545] disabled:opacity-60 text-white text-[13px] font-bold px-5 py-2.5 rounded-lg flex items-center gap-1.5">
                      {step === 4 ? "Submit Request" : "Review & Continue"} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Right rail */}
        <aside className="space-y-4 self-start w-full">
          <div className="bg-white rounded-2xl border border-[#e6e9ee] p-5 shadow-[0_6px_20px_rgba(11,37,69,0.06)]">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#eef4fb] grid place-items-center text-[#0b4f7d] shrink-0"><Lock className="w-4 h-4" /></div>
              <div>
                <h4 className="text-[13.5px] font-bold text-[#0b2545]">A Secure & Trusted Platform</h4>
                <p className="text-[11.5px] text-[#5b7186] leading-relaxed mt-1">
                  Access to PRAGATI is restricted to authorized government officials and approved partners. All requests are verified to ensure data security and responsible use.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#e6e9ee] p-5 shadow-[0_6px_20px_rgba(11,37,69,0.06)]">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-[#0b4f7d]" />
              <h4 className="text-[13.5px] font-bold text-[#0b2545]">What happens next?</h4>
            </div>
            <ol className="space-y-2.5">
              {["Submit your access request", "Your request will be reviewed by the PRAGATI admin team", "You will be notified via email within 3–5 working days", "Once approved, you can sign in and start using PRAGATI"].map((t, i) => (
                <li key={t} className="flex items-start gap-2.5 text-[12px] text-[#4b5768]">
                  <span className="w-5 h-5 rounded-full bg-[#eef4fb] text-[#0b4f7d] text-[10px] font-bold grid place-items-center shrink-0 mt-0.5">{i + 1}</span>
                  {t}
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-white rounded-2xl border border-[#e6e9ee] p-5 shadow-[0_6px_20px_rgba(11,37,69,0.06)]">
            <div className="flex items-center gap-2 mb-2.5">
              <HelpCircle className="w-4 h-4 text-[#0b4f7d]" />
              <h4 className="text-[13.5px] font-bold text-[#0b2545]">Need Help?</h4>
            </div>
            <p className="text-[11.5px] text-[#5b7186] mb-3">For any queries related to access, please contact the PRAGATI support team.</p>
            <div className="space-y-2">
              <a href="mailto:support-pragati@nic.in" className="flex items-center gap-2 border border-[#e6e9ee] rounded-lg px-3 py-2 text-[12px] font-semibold text-[#0b4f7d] hover:bg-[#f3f8fd]">
                <Mail className="w-3.5 h-3.5" /> support-pragati@nic.in
              </a>
              <div className="flex items-center gap-2 border border-[#e6e9ee] rounded-lg px-3 py-2 text-[12px] font-semibold text-[#0b4f7d]">
                <Phone className="w-3.5 h-3.5" /> +91 11 2436 XXXX
              </div>
              <button onClick={() => notify("Opening access guidelines…")} className="w-full text-center border border-[#e6e9ee] rounded-lg px-3 py-2 text-[12px] font-semibold text-[#0b4f7d] hover:bg-[#f3f8fd]">
                View Access Guidelines →
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-[#fdf6ec] border border-[#f2e3c9] p-5">
            <div className="flex items-start gap-3">
              <Landmark className="w-5 h-5 text-[#b87816] shrink-0 mt-0.5" />
              <p className="font-serif italic text-[13.5px] text-[#7a5410] leading-snug">
                Collaborating for infrastructure progress, across ministries, states and partners.
              </p>
            </div>
          </div>
        </aside>
      </main>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#0b2545] text-white text-[13px] font-semibold px-5 py-3 rounded-xl shadow-[0_14px_30px_rgba(11,37,69,0.3)] z-50">
          {toast}
        </div>
      )}
    </div>
  );
}

function Field({ label, required, value, onChange, placeholder, icon: Icon, type = "text", prefix }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[#334155]">{label} {required && <b className="text-[#d64545]">*</b>}</span>
      <div className="mt-1.5 flex items-center gap-2 border border-[#dbe2ea] rounded-lg px-3 h-11 focus-within:border-[#0b4f7d] bg-white">
        {prefix && <span className="text-[12px] text-[#7c8798] font-semibold">{prefix}</span>}
        {Icon && <Icon className="w-4 h-4 text-[#8aa0b5]" />}
        <input value={value} onChange={onChange} type={type} placeholder={placeholder} className="flex-1 text-sm outline-none bg-transparent" />
      </div>
    </label>
  );
}

function Select({ label, required, value, onChange, placeholder, options }) {
  return (
    <label className="block">
      <span className="text-[12px] font-semibold text-[#334155]">{label} {required && <b className="text-[#d64545]">*</b>}</span>
      <div className="mt-1.5 relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none border border-[#dbe2ea] rounded-lg px-3 h-11 text-sm outline-none focus:border-[#0b4f7d] bg-white text-[#334155]"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8aa0b5] pointer-events-none" />
      </div>
    </label>
  );
}
