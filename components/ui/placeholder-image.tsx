import { cn } from "@/lib/utils"

interface PlaceholderImageProps {
  width?: number
  height?: number
  className?: string
  text?: string
  aspectRatio?: "square" | "video" | "portrait" | "landscape"
}

export function PlaceholderImage({
  width,
  height,
  className,
  text = "Image à remplacer",
  aspectRatio = "video"
}: PlaceholderImageProps) {
  const aspectRatios = {
    square: "aspect-square",
    video: "aspect-video",
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]"
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-dashed border-[#D68C2D]/30 bg-gradient-to-br from-[#EFEFEA] to-white shadow-lg",
        aspectRatio && aspectRatios[aspectRatio],
        className
      )}
      style={width && height ? { width, height } : undefined}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-3 inline-flex rounded-xl bg-[#D68C2D]/10 p-4">
            <svg
              className="h-12 w-12 text-[#D68C2D]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="font-heading text-sm font-semibold text-[#1E1E1E]/60">
            {text}
          </p>
          <p className="mt-1 text-xs text-[#1E1E1E]/40">
            {width && height ? `${width}×${height}px` : "Responsive"}
          </p>
        </div>
      </div>
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#D68C2D]/5 via-transparent to-[#12A2AC]/5" />
    </div>
  )
}
