"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import { useStore } from "@/lib/store";
import { MOOD_EMOJI, MOOD_LABEL, Mood } from "@/lib/types";
import { dateKey } from "@/lib/utils";
import { Search, Trash2 } from "lucide-react";

const MOODS: Mood[] = ["great", "good", "okay", "low", "rough"];

export default function JournalPage() {
  const { data, addJournalEntry, deleteJournalEntry } = useStore();
  const [mood, setMood] = useState<Mood>("good");
  const [content, setContent] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      data.journal.filter((j) => j.content.toLowerCase().includes(query.toLowerCase())),
    [data.journal, query]
  );

  const submit = () => {
    if (!content.trim()) return;
    addJournalEntry({ date: dateKey(), mood, content: content.trim() });
    setContent("");
  };

  return (
    <div className="px-5 md:px-10 py-8 max-w-3xl mx-auto">
      <PageHeader
        eyebrow="One page a day"
        title="Journal"
        description="A quiet place to note the weather of your days."
      />

      <div className="card p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          {MOODS.map((m) => (
            <button
              key={m}
              onClick={() => setMood(m)}
              title={MOOD_LABEL[m]}
              className={`text-xl w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                mood === m ? "bg-moss-100 dark:bg-moss-800 ring-2 ring-moss-500" : "hover:bg-[var(--surface-2)]"
              }`}
            >
              {MOOD_EMOJI[m]}
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What happened today? What's on your mind?"
          rows={5}
          className="w-full bg-[var(--surface-2)] rounded-xl px-3.5 py-3 text-sm outline-none resize-none"
        />
        <div className="flex justify-end mt-3">
          <button
            onClick={submit}
            className="bg-moss-500 text-white px-5 py-2.5 rounded-xl text-sm hover:bg-moss-600 transition-colors"
          >
            Save entry
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4 card px-3.5 py-2.5">
        <Search size={15} className="text-[var(--ink-soft)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search past entries…"
          className="flex-1 bg-transparent outline-none text-sm"
        />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-sm text-[var(--ink-soft)] text-center py-8">
            {data.journal.length === 0 ? "No entries yet." : "No entries match your search."}
          </p>
        )}
        {filtered.map((j) => (
          <div key={j.id} className="card p-4 group">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium flex items-center gap-2">
                <span className="text-lg">{MOOD_EMOJI[j.mood]}</span> {j.date}
              </span>
              <button
                onClick={() => deleteJournalEntry(j.id)}
                className="opacity-0 group-hover:opacity-100 text-[var(--ink-soft)] hover:text-clay-500 transition-opacity"
              >
                <Trash2 size={15} />
              </button>
            </div>
            <p className="text-sm text-[var(--ink-soft)] whitespace-pre-wrap">{j.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
