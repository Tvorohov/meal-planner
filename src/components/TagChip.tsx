import { TAG_META, type DishTag } from "../types";

export function TagChip({
  tag,
  onClick,
  active,
}: {
  tag: DishTag;
  onClick?: () => void;
  active?: boolean;
}) {
  const meta = TAG_META[tag];
  const base =
    "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium leading-none";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${base} transition ${
          active ? meta.cls : "border-slate-200 bg-white text-slate-400 hover:bg-slate-50"
        }`}
      >
        {meta.label}
      </button>
    );
  }

  return <span className={`${base} ${meta.cls}`}>{meta.label}</span>;
}
