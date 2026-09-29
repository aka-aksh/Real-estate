"use client";

type Props = {
  label: "Hot" | "Warm" | "Cold" | null;
  value?: number | null;
};

export default function ScoreBadge({ label, value }: Props) {
  if (!label) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
        Unscored
      </span>
    );
  }

  const styles = {
    Hot: "bg-red-100 text-red-700",
    Warm: "bg-amber-100 text-amber-700",
    Cold: "bg-blue-100 text-blue-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[label]}`}
    >
      {label}
      {value != null && <span className="text-[10px] opacity-70">({value})</span>}
    </span>
  );
}
