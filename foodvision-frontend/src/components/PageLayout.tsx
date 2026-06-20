import Navigation from "@/components/Navigation";

type PageShellProps = {
  children: React.ReactNode;
  className?: string;
  mainClassName?: string;
  /** Trang full-screen (scanner) — không giới hạn max-width */
  fullBleed?: boolean;
};

export function PageShell({
  children,
  className = "",
  mainClassName = "",
  fullBleed = false,
}: PageShellProps) {
  return (
    <div
      className={`font-body-md text-body-md selection:bg-primary-fixed selection:text-on-primary-fixed min-h-screen bg-background text-on-background ${className}`}
    >
      <Navigation />
      <main
        className={`pt-24 pb-32 px-container-margin mx-auto ${
          fullBleed ? "w-full max-w-[1140px]" : "max-w-[1140px]"
        } ${mainClassName}`}
      >
        {children}
      </main>
    </div>
  );
}

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <section className="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-md">
      <div>
        {eyebrow && (
          <p className="font-label-md text-label-md text-outline uppercase tracking-widest mb-xs">
            {eyebrow}
          </p>
        )}
        <h1 className="font-headline-md text-headline-md text-on-surface mb-xs">{title}</h1>
        {description && (
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[672px]">
            {description}
          </p>
        )}
      </div>
      {action}
    </section>
  );
}

export function SectionDivider({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center mb-6 mt-8 opacity-90">
      <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5" />
      <h2 className="px-6 font-bold text-lg md:text-xl text-on-surface uppercase tracking-widest text-center whitespace-nowrap">
        {title}
      </h2>
      <div className="flex-1 border-t border-b border-[#b82c2a] h-1.5" />
    </div>
  );
}

type EditorialCardProps = {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  hover?: boolean;
};

export function EditorialCard({
  children,
  className = "",
  padding = "p-md",
  hover = false,
}: EditorialCardProps) {
  return (
    <div
      className={`bg-surface-container-lowest rounded-xl border border-[#F2EFE9] shadow-[0_20px_30px_rgba(27,28,28,0.04)] ${padding} ${
        hover ? "editorial-card" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function StatPill({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: string;
  tone?: "primary" | "secondary" | "tertiary";
}) {
  const tones = {
    primary: "bg-primary/10 border-primary/20 text-primary",
    secondary: "bg-secondary/10 border-secondary/20 text-secondary",
    tertiary: "bg-tertiary/10 border-tertiary/20 text-tertiary",
  };
  return (
    <div className={`px-4 py-2 rounded-full border ${tones[tone]}`}>
      <span className="font-label-sm text-label-sm">
        {value} {label}
      </span>
    </div>
  );
}

export function PrimaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`w-full bg-primary text-white py-4 rounded-xl font-label-md text-label-md shadow-lg active:scale-[0.98] transition-all hover:bg-primary-container disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function SecondaryButton({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`w-full bg-surface-container-lowest border border-outline-variant/40 text-on-surface-variant py-4 rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
