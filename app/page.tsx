export default function SplashPage() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="font-display text-5xl font-semibold tracking-tight text-earth sm:text-6xl">
          CrespoTrueké
        </h1>
        <div className="mt-5 h-[3px] w-14 rounded-full bg-wood" />
        <p className="mt-6 text-sm text-earth/60">Crespo, Entre Ríos</p>
      </div>

      <div className="absolute bottom-16 flex gap-2" aria-hidden="true">
        <span className="h-2 w-2 animate-pulse rounded-full bg-earth/30 [animation-delay:-0.3s] motion-reduce:animate-none" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-earth/30 [animation-delay:-0.15s] motion-reduce:animate-none" />
        <span className="h-2 w-2 animate-pulse rounded-full bg-earth/30 motion-reduce:animate-none" />
      </div>
    </main>
  );
}
