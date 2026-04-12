"use client";

import Hls from "hls.js";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Page() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);
  const params = useParams();
  const router = useRouter();
  const playlistUrl = `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/movie/${params.id}/stream.m3u8`;

  useEffect(() => {
    const video = videoRef.current;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    if (Hls.isSupported() && video) {
      const hls = new Hls({
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 5,
      });

      hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        console.info("HLS media attached");
      });

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        void video.play().catch((error) => {
          console.error("HLS autoplay failed", error);
        });
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.error("HLS error", data);

        if (!data.fatal) {
          return;
        }

        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            hls.destroy();
            alert("Live stream playback failed");
        }
      });

      hlsRef.current = hls;
      hls.loadSource(playlistUrl);
      hls.attachMedia(video);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        hls.destroy();
      };
    } else if (video?.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = playlistUrl;
      video.load();
      void video.play().catch((error) => {
        console.error("Native HLS autoplay failed", error);
      });
    } else {
      alert("Live streaming not supported in this browser");
    }

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [playlistUrl, router]);

  return (
    <video
      ref={videoRef}
      className="w-screen h-screen"
      controls
      playsInline
      autoPlay
    />
  );
}
