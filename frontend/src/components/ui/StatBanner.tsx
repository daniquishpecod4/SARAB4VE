interface StatBannerProps {
  icon?: string;
  text: string;
}

export default function StatBanner({ icon = "group", text }: StatBannerProps) {
  return (
    <div className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-semibold text-sm">
      <span className="material-symbols-rounded text-xl" aria-hidden="true">
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}
