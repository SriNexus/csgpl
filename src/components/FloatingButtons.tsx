import { useState } from "react";
import { MessageCircle, X, Phone, Mail } from "lucide-react";
import { WhatsappIcon } from "./SocialIcons";

/* ============================================================
   FloatingButtons — WhatsApp pulse + chat popover (Chaty-style).
   Pure presentation; receives all URLs/contact info via props.
   ============================================================ */

export interface FloatingButtonsProps {
  whatsappUrl:        string;
  whatsappUrlWithMsg: string;
  phoneDisplay:       string;
  phoneRaw:           string;
  email:              string;
}

export default function FloatingButtons(props: FloatingButtonsProps) {
  return (
    <>
      <WhatsappButton url={props.whatsappUrlWithMsg} />
      <ChatPopover {...props} />
    </>
  );
}

function WhatsappButton({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 h-14 w-14 grid place-items-center rounded-full bg-[#25D366] text-white shadow-premium hover:scale-110 transition-transform relative animate-pulse-ring"
      aria-label="WhatsApp"
    >
      <WhatsappIcon className="h-7 w-7" />
    </a>
  );
}

function ChatPopover({
  phoneDisplay, phoneRaw, email, whatsappUrl,
}: FloatingButtonsProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button
        onClick={() => setOpen(!open)}
        className="h-14 w-14 grid place-items-center rounded-full bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-premium hover:scale-110 transition-transform"
        aria-label="Open chat"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
      {open && (
        <div className="absolute bottom-16 left-0 w-72 rounded-2xl bg-white shadow-premium border hairline p-4">
          <div className="text-xs font-bold text-ink-900 uppercase tracking-wider mb-3">Quick Contact</div>
          <QuickAction icon={Phone}         bg="bg-brand-100 text-brand-700"     label="Call us"   value={phoneDisplay}  href={`tel:${phoneRaw}`} />
          <QuickAction icon={Mail}          bg="bg-amber-100 text-amber-700"     label="Email us"  value={email}         href={`mailto:${email}`} />
          <QuickAction icon={MessageCircle} bg="bg-emerald-100 text-emerald-700" label="WhatsApp"  value="Start a chat"  href={whatsappUrl} external />
        </div>
      )}
    </div>
  );
}

function QuickAction({
  icon: Icon, bg, label, value, href, external,
}: { icon: any; bg: string; label: string; value: string; href: string; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-brand-50 transition"
    >
      <span className={`h-9 w-9 grid place-items-center rounded-lg ${bg}`}><Icon className="h-4 w-4" /></span>
      <div>
        <div className="text-xs text-ink-500">{label}</div>
        <div className="text-sm font-semibold text-ink-900">{value}</div>
      </div>
    </a>
  );
}
