interface PointCardProps {
  icon: string;
  title: string;
  description: string;
  badge?: string;
  distance?: string;
}

/**
 * Tarjeta de punto de ayuda (refugio, organización, recurso).
 */
export default function PointCard({
  icon,
  title,
  description,
  badge,
  distance,
}: PointCardProps) {
  return (
    <article className="flex items-start gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant">
      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center">
        <span className="material-symbols-rounded text-primary text-2xl" aria-hidden="true">
          {icon}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-base text-on-surface">{title}</h3>
          {badge && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary-fixed text-secondary">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-on-surface-variant mt-0.5">{description}</p>
        {distance && (
          <p className="text-xs text-primary font-semibold mt-1 flex items-center gap-1">
            <span className="material-symbols-rounded text-base" aria-hidden="true">
              location_on
            </span>
            {distance}
          </p>
        )}
      </div>
    </article>
  );
}
