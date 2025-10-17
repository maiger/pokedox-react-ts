type TypePillProps = {
  pokeType: string;
  size: "sm" | "l";
};

const typeColors = {
  normal: { bg: "bg-neutral-500", color: "text-white" },
  grass: { bg: "bg-lime-500", color: "text-black" },
  poison: { bg: "bg-purple-400", color: "text-white" },
  fire: { bg: "bg-amber-500", color: "text-white" },
  water: { bg: "bg-blue-500", color: "text-white" },
  flying: { bg: "bg-blue-300", color: "text-black" },
  bug: { bg: "bg-lime-700", color: "text-white" },
  ground: { bg: "bg-stone-200", color: "text-black" },
  rock: { bg: "bg-stone-400", color: "text-white" },
  ice: { bg: "bg-sky-400", color: "text-white" },
  psychic: { bg: "bg-pink-400", color: "text-white" },
  electric: { bg: "bg-yellow-400", color: "text-white" },
};

function TypePill({ pokeType, size }: TypePillProps) {
  let typeColor = typeColors[pokeType as keyof typeof typeColors];
  if (!typeColor) {
    typeColor = { bg: "bg-neutral-500", color: "text-white" };
    console.warn("No typeColor for ", pokeType);
  }

  let style = `inline-block text-center mx-1 my-1 px-1 py-1 rounded-full ${typeColor.bg} ${typeColor.color}`;
  if (size === "sm") style += ` w-20 text-xs`;
  if (size === "l") style += ` w-30 text-m`;

  return (
    <span className={style}>
      {pokeType.charAt(0).toUpperCase() + pokeType.slice(1)}
    </span>
  );
}

export default TypePill;
