"use client";

import { useState } from "react";
import type { FaqCategory } from "@/lib/types";

export default function FaqAccordion({
  categories,
}: {
  categories: FaqCategory[];
}) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {categories.map((cat) => (
        <div key={cat.id}>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ew-primary/10">
              <svg className="h-5 w-5 text-ew-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-ew-dark">{cat.title}</h2>
              {cat.description && (
                <p className="text-sm text-ew-grey">{cat.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-2 pl-0 md:pl-[3.25rem]">
            {cat.faqItems?.map((item) => {
              const isOpen = openItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className="overflow-hidden rounded-xl border border-gray-100 bg-white"
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <span className="pr-4 font-medium text-ew-dark">
                      {item.question}
                    </span>
                    <svg
                      className={`h-5 w-5 shrink-0 text-ew-primary transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  <div
                    className={`transition-all duration-300 ${
                      isOpen ? "max-h-96 pb-5" : "max-h-0"
                    } overflow-hidden`}
                  >
                    {item.answer?.html && (
                      <div
                        className="prose-ew px-5"
                        dangerouslySetInnerHTML={{
                          __html: item.answer.html,
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
