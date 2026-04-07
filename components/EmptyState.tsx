"use client";

export default function EmptyState({
  icon,
  title,
  description,
  action,
  actionLabel,
}: {
  icon: string;
  title: string;
  description: string;
  action?: () => void;
  actionLabel?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 text-center max-w-xs mb-4">{description}</p>
      {action && actionLabel && (
        <button
          onClick={action}
          className="rounded-xl bg-slate-900 text-white font-semibold px-5 py-2.5 text-sm hover:bg-slate-800 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
