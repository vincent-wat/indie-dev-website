import Image from "next/image";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-extrabold">Pippy Studios</h1>

        <p className="max-w-2xl text-base leading-relaxed text-black/80">
          We’re a small indie dev team looking to bring our ideas to life. Look forward to some fun friendslop!
        </p>

        <h2 className="pt-2 text-2xl font-extrabold">Projects</h2>

        <div className="grid gap-3">
          <div className="rounded-xl border border-black/10 p-4">
            <div className="text-xl font-extrabold">Turkish Tony</div>

            <div className="mt-2 text-black/80">
              <p>
                As our team starts off on our game dev journey, we set our sights on a simple Flappy Bird remake using Unreal
                Engine 5! This game helped establish our intended workflows for larger scale projects while also showing us
                the ropes of this robust game engine.
              </p>

              <p className="mt-4">Don&apos;t mind the rough performance, it will take about 2 minutes for shaders to load!</p>
            </div>

            <div className="mt-3 overflow-hidden rounded-xl border border-black/10">
              <Image
                src="/projects/project1.jpg"
                alt="Turkish Tony screenshot"
                width={1200}
                height={675}
                className="h-auto w-full"
                priority
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-black/70">
              <span>Status: Playtesting</span>

              <a
                href="https://drive.google.com/drive/folders/1Pbpusa3zfX472A76kVGh73gW9xnlhv9L?usp=drive_link"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-block rounded-full border border-black px-3 py-2 font-extrabold text-black transition-colors hover:bg-black hover:text-white"
              >
                Download demo
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-black/10 p-4">
            <div className="text-xl font-extrabold">Drafting our Studio Mascot: Pippy!</div>

            <div className="mt-2 text-black/80">
              Our team&apos;s artist is currently working on concept art for Pippy! We plan on having him be an aloof,
              rounded, chubby RATTTTT :D
            </div>

            <div className="mt-3 text-sm text-black/70">Status: Early concept</div>
          </div>
        </div>
      </div>
    </div>
  );
}