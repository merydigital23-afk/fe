export function PasoIndicator({ actual }: { actual: 1 | 2 | 3 }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-earth/50">
        Paso {actual} de 3
      </p>
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-1.5 w-6 rounded-full ${n <= actual ? "bg-terracotta" : "bg-sand"}`}
          />
        ))}
      </div>
    </div>
  );
}
