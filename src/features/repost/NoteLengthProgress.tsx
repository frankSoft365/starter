export default function NoteLengthProgress({ note }: { note: string }) {
  const progressValue = Math.min((note.length / 280) * 100, 100);
  return (
    <div>
      <div
        className={`radial-progress border-base-300 bg-base-200 border-2 mr-1 ${note.length > 280 ? "text-error" : ""}`}
        style={
          {
            "--value": progressValue,
            "--size": "1rem",
          } as React.CSSProperties
        }
        aria-valuenow={progressValue}
        role="progressbar"
      ></div>
      <span className="text-xs text-base-content/60">
        <span
          className={`text-base-content ${note.length > 280 ? "text-error " : ""}`}
        >
          {note.length}
        </span>
        /280
      </span>
    </div>
  );
}
