/**
 * FAQ — clean centered accordion. Narrower width = better readability.
 */

import { useState } from "react";
import { MessageCircle, Plus } from "lucide-react";
import { Section, SectionHeader, Button, Container } from "@/components/ui";
import { faqs as faqSeeds } from "@/data/content";
import type { FaqRecord } from "@/cms";

export interface FAQProps { items?: FaqRecord[] }
type FaqLike = { q: string; a: string };

export default function FAQ({ items }: FAQProps) {
  const list: FaqLike[] = (items && items.length ? items : faqSeeds) as FaqLike[];
  if (!list.length) return null;

  return (
    <Section tone="paper" padding="lg">
      <SectionHeader
        align="stacked"
        eyebrow="FAQ"
        title={
          <>
            Got questions? <br />
            <span className="serif font-normal text-ink-600">We've answered them.</span>
          </>
        }
        description="Couldn't find what you need? Our solar experts respond within 24 hours."
      />

      <Container size="prose" className="mt-12">
        <ul className="space-y-3">
          {list.slice(0, 6).map((f, i) => (
            <FaqItem key={f.q} index={i} q={f.q} a={f.a} defaultOpen={i === 0} />
          ))}
        </ul>

        <div className="mt-10 text-center">
          <Button
            as="a"
            href="#consultation"
            variant="dark"
            size="lg"
            trailing={
              <span className="h-8 w-8 rounded-full bg-white text-ink-900 grid place-items-center">
                <MessageCircle className="h-4 w-4" />
              </span>
            }
          >
            Talk to a solar expert
          </Button>
        </div>
      </Container>
    </Section>
  );
}

function FaqItem({ index, q, a, defaultOpen }: { index: number; q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <li className={`rounded-2xl border transition-all overflow-hidden ${open ? "bg-white border-ink-900/15 shadow-soft" : "bg-white/60 border-ink-900/[0.08] hover:bg-white"}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between gap-4 text-left px-5 sm:px-6 py-4">
        <span className="flex items-baseline gap-4">
          <span className="serif text-sm text-ink-400">{String(index + 1).padStart(2, "0")}</span>
          <span className="font-bold text-ink-900 text-[15px] sm:text-base">{q}</span>
        </span>
        <span className={`h-8 w-8 shrink-0 rounded-full grid place-items-center transition-all ${open ? "bg-brand-600 text-white rotate-45" : "bg-paper-2 text-ink-700"}`}>
          <Plus className="h-3.5 w-3.5" />
        </span>
      </button>
      <div className={`grid transition-all duration-300 ease-out ${open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">
          <p className="px-5 sm:px-6 pb-5 pl-[3.25rem] text-sm sm:text-[15px] text-ink-600 leading-relaxed">{a}</p>
        </div>
      </div>
    </li>
  );
}
