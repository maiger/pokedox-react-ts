import type { PokeData } from "./PokeListItem";
import PokeListItem from "./PokeListItem";

type PokeListProps = {
  pokemon: PokeData[];
};

function PokeList({ pokemon }: PokeListProps) {
  return (
    <div className="max-w-240">
      <ul className="flex justify-center flex-wrap">
        {pokemon.map((poke) => (
          <li key={poke.name}>
            <PokeListItem name={poke.name} url={poke.url} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PokeList;
