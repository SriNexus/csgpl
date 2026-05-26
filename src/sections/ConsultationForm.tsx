import { useState } from "react";
import {
  CheckCircle2, Loader2, User, Phone, Mail, MapPin, Zap, IndianRupee, ArrowRight,
  ShieldCheck, BadgeCheck, Clock,
} from "lucide-react";
import { Section, Eyebrow, Heading, Lead, Backdrop, Input, Select } from "@/components/ui";
import { submitLead } from "@/lib/leads";
import { consultationOptions } from "@/data/content";
import { site } from "@/data/site";

const initialForm = { name: "", phone: "", email: "", city: "", systemType: "", monthlyBill: "" };
type FormState = typeof initialForm;
type Status = "idle" | "loading" | "success" | "error";

const trustPoints = [
  { icon: ShieldCheck, t: "100% Free Site Survey",            d: "No obligations. No hidden fees." },
  { icon: BadgeCheck,  t: "Subsidy & Net Metering Assistance",d: "We handle all paperwork end-to-end." },
  { icon: Clock,       t: "Custom Quote in 24 Hours",         d: "Detailed BOQ with full financial model." },
];

/**
 * ConsultationForm — premium dark CTA with form on the right.
 * Refactored: uses Section/Backdrop/Input/Select primitives; decomposed pieces.
 */
export default function ConsultationForm() {
  return (
    <Section id="consultation" tone="dark" backdrop={<Backdrop preset="dark-cinematic" />}>
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        <FormCopy />
        <div className="lg:col-span-7"><FormCard /></div>
      </div>
    </Section>
  );
}

/* ----- decomposed pieces ----- */

function FormCopy() {
  return (
    <div className="lg:col-span-5">
      <Eyebrow tone="white">Free Consultation</Eyebrow>
      <Heading invert className="mt-5">
        <span className="serif font-normal text-white/60">Let's design</span> <br />
        your <span className="text-gradient-warm">solar future.</span>
      </Heading>
      <Lead invert className="mt-6">
        Share a few details and a CSGPL solar expert will personally design your system,
        estimate your savings & guide you through the subsidy process.
      </Lead>

      <ul className="mt-10 space-y-5">
        {trustPoints.map((b) => {
          const Icon = b.icon;
          return (
            <li key={b.t} className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-white/[0.06] border border-white/10 grid place-items-center text-brand-300">
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 pt-1">
                <div className="font-bold text-white">{b.t}</div>
                <div className="text-sm text-white/55">{b.d}</div>
              </div>
            </li>
          );
        })}
      </ul>

      <SocialProof />
    </div>
  );
}

function SocialProof() {
  return (
    <div className="mt-10 pt-6 border-t border-white/[0.08] flex items-center gap-5">
      <div className="flex -space-x-2">
        {["RK","PS","MF","AM"].map((c, i) => (
          <div key={i} className="h-9 w-9 rounded-full ring-2 ring-ink-950 bg-gradient-to-br from-brand-500 to-brand-800 grid place-items-center text-white text-[10px] font-bold">
            {c}
          </div>
        ))}
      </div>
      <div className="text-sm">
        <div className="font-bold">Trusted by {site.trust.reviewsCount}+ customers</div>
        <div className="text-white/50 text-xs">{site.trust.rating} ★ average rating</div>
      </div>
    </div>
  );
}

function FormCard() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<Status>("idle");
  const [msg, setMsg] = useState("");

  const update =
    (k: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [k]: e.target.value });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.phone) {
      setStatus("error");
      setMsg("Please enter your name and phone.");
      return;
    }
    setStatus("loading");
    const res = await submitLead({ ...form, source: "homepage" });
    setStatus("success");
    setMsg(
      res.ok
        ? "Thank you. Our solar expert will reach out within 24 hours."
        : "Thanks! Your enquiry is saved — our team will contact you shortly."
    );
    setForm(initialForm);
  }

  return (
    <form onSubmit={onSubmit} className="relative rounded-[1.75rem] bg-white text-ink-900 p-7 sm:p-10 shadow-premium">
      <div className="absolute -top-4 left-8 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-700 to-brand-500 text-white text-[11px] font-extrabold uppercase tracking-[0.18em] px-3 py-1.5 shadow-md">
        ⚡ Free Quote
      </div>

      <div className="flex items-start justify-between gap-3 mb-7">
        <div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-ink-900 tracking-tight">Tell us about your project</h3>
          <p className="text-sm text-ink-500 mt-1">Takes less than 60 seconds.</p>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-[10px] uppercase tracking-[0.18em] text-ink-500">Response in</div>
          <div className="text-sm font-bold text-brand-700">&lt; 24 hours</div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Input icon={<User className="h-4 w-4" />}        label="Full Name *" name="name"        value={form.name}        onChange={update("name")}        placeholder="Your name" />
        <Input icon={<Phone className="h-4 w-4" />}       label="Phone *"     name="phone"       value={form.phone}       onChange={update("phone")}       placeholder="+91 9xxxx xxxxx" type="tel" />
        <Input icon={<Mail className="h-4 w-4" />}        label="Email"       name="email"       value={form.email}       onChange={update("email")}       placeholder="you@example.com" type="email" />
        <Input icon={<MapPin className="h-4 w-4" />}      label="City"        name="city"        value={form.city}        onChange={update("city")}        placeholder="Lucknow / Varanasi" />
        <Select icon={<Zap className="h-4 w-4" />}        label="System Type" name="systemType"  value={form.systemType}  onChange={update("systemType")}  options={consultationOptions.systemTypes} />
        <Select icon={<IndianRupee className="h-4 w-4" />}label="Monthly Bill"name="monthlyBill" value={form.monthlyBill} onChange={update("monthlyBill")} options={consultationOptions.billRanges} />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary mt-7 w-full rounded-2xl pl-6 pr-3 py-3.5 text-sm font-bold inline-flex items-center justify-between gap-3 disabled:opacity-60"
      >
        <span>{status === "loading" ? "Submitting…" : "Get My Free Consultation"}</span>
        <span className="h-9 w-9 rounded-full bg-white/15 grid place-items-center backdrop-blur">
          {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
        </span>
      </button>

      {status === "success" && (
        <div className="mt-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3 inline-flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" /> {msg}
        </div>
      )}
      {status === "error" && (
        <div className="mt-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm px-4 py-3">{msg}</div>
      )}

      <p className="mt-5 text-[11px] text-ink-500 text-center leading-relaxed">
        By submitting, you agree to be contacted by CSGPL via phone, email or WhatsApp. We never share your data.
      </p>
    </form>
  );
}
