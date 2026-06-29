interface CategoryCardProps {
  icon: string;
  title: string;
  description: string;
  selected?: boolean;
  onClick?: () => void;
}

/**
 * Tarjeta de categoría para el formulario SOS Step 1.
 */
export default function CategoryCard({
  icon,
  title,
  description,
  selected = false,
  onClick,
}: CategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all min-h-[72px] ${
        selected
          ? "border-primary bg-primary-fixed text-primary"
          : "border-outline-variant bg-surface-container-low text-on-surface hover:border-outline hover:bg-surface-container"
      } focus-visible:outline-3 focus-visible:outline-primary focus-visible:outline-offset-2`}
    >
      <span
        className={`material-symbols-rounded text-3xl mt-0.5 flex-shrink-0 ${
          selected ? "text-primary" : "text-on-surface-variant"
        }`}
        aria-hidden="true"
      >
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-base leading-snug">{title}</p>
        <p className="text-sm text-on-surface-variant mt-0.5 leading-snug">
          {description}
        </p>
      </div>
      {selected && (
        <span className="material-symbols-rounded text-primary flex-shrink-0" aria-hidden="true">
          check_circle
        </span>
      )}
    </button>
  );
}
