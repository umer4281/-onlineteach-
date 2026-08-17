export default function VideoPlayer({ youtubeId }: { youtubeId: string }) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black shadow-lg">
      <iframe
        className="h-full w-full"
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
