"use client";

import { useState, useTransition } from "react";
import { updateEnrollmentStatus, deleteEnrollment } from "@/lib/actions/enrollment.action";
import { Trash2 } from "lucide-react";

const STATUSES = [
  { value: "pending",    label: "Pending",    bg: "bg-yellow-100 text-yellow-800" },
  { value: "reviewing",  label: "Reviewing",  bg: "bg-blue-100   text-blue-800"   },
  { value: "contacted",  label: "Contacted",  bg: "bg-purple-100 text-purple-800" },
  { value: "enrolled",   label: "Enrolled",   bg: "bg-green-100  text-green-800"  },
  { value: "rejected",   label: "Rejected",   bg: "bg-red-100    text-red-800"    },
];

export function EnrollmentStatusSelect({
  id,
  current,
}: {
  id: string;
  current: string;
}) {
  const [status, setStatus] = useState(current);
  const [isPending, startTransition] = useTransition();

  function handleChange(next: string) {
    setStatus(next);
    startTransition(async () => {
      await updateEnrollmentStatus(id, next);
    });
  }

  const badge = STATUSES.find((s) => s.value === status) ?? STATUSES[0];

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={isPending}
      className={`text-xs font-semibold px-2 py-1 rounded-full border-none outline-none cursor-pointer disabled:opacity-60 ${badge.bg}`}
    >
      {STATUSES.map((s) => (
        <option key={s.value} value={s.value}>
          {s.label}
        </option>
      ))}
    </select>
  );
}

export function EnrollmentDeleteButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm("Delete this enrollment? This cannot be undone.")) return;
    startTransition(async () => {
      await deleteEnrollment(id);
    });
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      title="Delete enrollment"
      className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
    >
      <Trash2 size={15} />
    </button>
  );
}
