import { AdVideo } from "@/app/types/Ads";
import { mediaUrl } from "@/app/utils/ads";

// Our own copy of the ad. `preload="none"` means nothing but the poster image
// transfers until a reader actually presses play, and the width/height
// attributes give the browser the aspect ratio up front so the page doesn't
// shift once the video loads.
export default function RehostedAdVideo({
  video,
  name,
  className,
}: {
  video: AdVideo;
  name: string;
  className?: string;
}) {
  return (
    <video
      className={className}
      src={mediaUrl(video.mp4)}
      poster={mediaUrl(video.poster)}
      width={video.width ?? undefined}
      height={video.height ?? undefined}
      aria-label={`Video advertisement from ${name}`}
      controls
      preload="none"
      playsInline
    />
  );
}
