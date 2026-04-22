import { AlertTriangle } from "lucide-react";

interface WarningBannerProps {
  title: string;
  description: string;
}

export function WarningBanner({ title, description }: WarningBannerProps) {
  return (
    <section className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
        <div>
          <p className="text-sm font-semibold text-amber-200">{title}</p>
          <p className="mt-1 text-sm text-amber-100/90">{description}</p>
        </div>
      </div>
    </section>
  );
}
