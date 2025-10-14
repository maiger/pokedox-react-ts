import type { PokeData } from "./PokeListItem";
import PokeListItem from "./PokeListItem";

type PokeListProps = {
  pokemon: PokeData[];
};

function PokeList({ pokemon }: PokeListProps) {
  return (
    <div id="blog-posts">
      <h1>Pokemon</h1>
      <ul>
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
