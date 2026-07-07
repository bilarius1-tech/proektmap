interface Video {
  title: string;
  url: string;
  platform: "youtube" | "vk" | "rutube";
}

export default function VideoBlock({ videos }: { videos: Video[] }) {
  if (!videos || videos.length === 0) return null;

  return (
    <div style={{
      padding: "var(--space-l)", background: "var(--color-bg-secondary)",
      borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)",
      marginTop: "var(--space-m)",
    }}>
      <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>
        📺 Видео по теме
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px,1fr))", gap: "var(--space-m)" }}>
        {videos.map((v, i) => {
          const embedUrl = v.platform === "youtube"
            ? v.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")
            : v.platform === "vk"
            ? v.url.replace("vk.com/video", "vk.com/video_ext")
            : v.url;
          
          return (
            <div key={i} style={{
              background: "var(--color-bg-primary)", borderRadius: "var(--radius-m)",
              border: "1px solid var(--color-border-light)", overflow: "hidden",
            }}>
              <div style={{ padding: "var(--space-s)" }}>
                <div style={{ fontWeight: 600, fontSize: "var(--text-s)", marginBottom: "var(--space-xs)" }}>{v.title}</div>
              </div>
              <div style={{ position: "relative", paddingBottom: "56.25%", background: "#000" }}>
                <iframe src={embedUrl}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
