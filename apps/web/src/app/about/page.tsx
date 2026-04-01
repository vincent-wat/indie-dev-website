export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold">About</h1>

      <p className="max-w-2xl leading-relaxed text-black/80">
        Pippy Studios is a 2-person indie dev team based in LA. We handle design, engineering, and production end-to-end
        with a focus on shipping fun, weird, replayable games.
      </p>

      <h2 className="pt-2 text-2xl font-extrabold">Team</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-black/10 p-4">
          <div className="text-lg font-extrabold">Developer 1</div>
          <div className="mt-2 text-black/80">
            Role/focus: gameplay systems, backend tools, infrastructure, and shipping the thing.
          </div>
        </div>

        <div className="rounded-xl border border-black/10 p-4">
          <div className="text-lg font-extrabold">Developer 2</div>
          <div className="mt-2 text-black/80">
            Role/focus: art, UI/UX, game feel, vibes, and making everything look adorable.
          </div>
        </div>
      </div>
    </div>
  );
}