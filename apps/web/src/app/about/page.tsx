export default function AboutPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold">About</h1>

      <p className="max-w-2xl leading-relaxed text-black/80">
        Pippy Studios is a 2-person indie dev team based in LA. We handle design, engineering, and production end-to-end
        with a focus on shipping fun, weird, replayable games for friends and family to enjoy.
      </p>

      <h2 className="pt-2 text-2xl font-extrabold">Team</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-black/10 p-4">
          <div className="text-lg font-extrabold">Vincent</div>
          <div className="mt-2 text-black/80">
            Role/focus: gameplay systems, backend tools, infrastructure, and website dev.
          </div>
        </div>

        <div className="rounded-xl border border-black/10 p-4">
          <div className="text-lg font-extrabold">Lilian</div>
          <div className="mt-2 text-black/80">
            Role/focus: gameplay systems, concept art, UI/UX, game feel, adding a lil pizzazz.
          </div>
        </div>
      </div>
    </div>
  );
}