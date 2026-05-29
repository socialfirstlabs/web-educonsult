import Image from "next/image";

interface ServiceCardProps {
  title: string;
  description: string;
  features?: string | null;
  tags?: string | null;
  image_url?: string | null;
}

export function ServiceCard({ title, description, features, tags, image_url }: ServiceCardProps) {
  const tagList = tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const featureList = features ? features.split(",").map((f) => f.trim()).filter(Boolean) : [];

  return (
    <div
      className="group relative bg-white rounded-[20px] border border-jn-border overflow-hidden flex flex-col
                 shadow-[0_2px_12px_-4px_rgba(36,62,188,0.08)]
                 transition-all duration-300 ease-out
                 hover:-translate-y-2
                 hover:shadow-[0_24px_48px_-12px_rgba(36,62,188,0.18)]
                 hover:border-[#c7d0f5]"
    >
      {/* Image section */}
      <div className="relative h-[200px] overflow-hidden bg-jn-bg-off shrink-0">
        {image_url ? (
          <Image
            src={image_url}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full transition-colors duration-300 group-hover:bg-jn-primary-light">
            <span className="text-6xl select-none opacity-60 group-hover:opacity-90 transition-opacity duration-300">
              🎯
            </span>
          </div>
        )}
        {/* Gradient fade at bottom of image into content */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
      </div>

      {/* Content section */}
      <div className="flex flex-col flex-1 p-6 gap-3">
        {/* Title */}
        <h3
          className="text-[1.1rem] font-bold font-[family-name:var(--font-poppins)] text-jn-text-dark leading-snug
                     group-hover:text-jn-primary transition-colors duration-200"
        >
          {title}
        </h3>

        {/* Description — clamped to 3 lines for consistent card height */}
        <p className="text-[0.92rem] text-jn-text-muted leading-[1.65] line-clamp-3">
          {description}
        </p>

        {/* Features list */}
        {featureList.length > 0 && (
          <ul className="space-y-1.5 mt-1">
            {featureList.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-[0.875rem] text-jn-text-muted">
                <span className="mt-[3px] shrink-0 w-[14px] h-[14px] rounded-full border-2 border-jn-accent bg-jn-accent-light inline-block" />
                <span className="leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Spacer pushes tags to bottom */}
        <div className="flex-1" />

        {/* Tags */}
        {tagList.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-jn-border mt-1">
            {tagList.map((tag) => (
              <span
                key={tag}
                className="text-[0.72rem] font-semibold text-jn-text-muted border border-jn-border
                           bg-jn-bg-off px-2.5 py-[3px] rounded-md
                           group-hover:border-[#c7d0f5] group-hover:text-jn-primary group-hover:bg-jn-primary-light
                           transition-colors duration-200"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Left accent bar — slides in from top on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] bg-jn-primary
                   scale-y-0 group-hover:scale-y-100 origin-top
                   transition-transform duration-300 ease-out rounded-r-full"
      />
    </div>
  );
}
