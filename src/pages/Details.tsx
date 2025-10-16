import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { get } from "../util/http";

type RawFullPokeDetails = {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
  stats: {
    base_stat: number;
    stat: { name: string };
  }[];
};

type FullPokeDetails = {
  id: number;
  name: string;
  weight: number;
  height: number;
  art: string;
  types: string[];
  stats: {
    name: string;
    value: number;
  }[];
};

function Details() {
  const { id } = useParams();

  const [fetchedPokemon, setFetchedPokemon] = useState<FullPokeDetails>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchPokemon() {
      setIsFetching(true);
      try {
        const data = (await get(
          "https://pokeapi.co/api/v2/pokemon/" + id
        )) as RawFullPokeDetails;
        const pokeDetails: FullPokeDetails = {
          id: data.id,
          name: data.name,
          weight: data.weight,
          height: data.height,
          art: data.sprites.other["official-artwork"].front_default,
          types: data.types.map((type) => type.type.name),
          stats: data.stats.map((stat) => {
            return {
              name: stat.stat.name,
              value: stat.base_stat,
            };
          }),
        };
        setFetchedPokemon(pokeDetails);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.log(error);
        }
        // setError('Failed to fetch posts!');
      }

      setIsFetching(false);
    }

    fetchPokemon();
  }, [id]);

  let content: ReactNode;
  if (error) content = <ErrorMessage text={error} />;
  if (isFetching) content = <p>Fetching Pokemon Details</p>;

  if (fetchedPokemon) {
    const { name, art, weight, height, types, stats } = fetchedPokemon;

    // Stats
    const hp = stats.find((stat) => stat.name === "hp");
    const attack = stats.find((stat) => stat.name === "attack");
    const defence = stats.find((stat) => stat.name === "defense");
    const s_attack = stats.find((stat) => stat.name === "special-defense");
    const s_defence = stats.find((stat) => stat.name === "special-attack");
    const speed = stats.find((stat) => stat.name === "speed");

    content = (
      <div className="flex flex-col items-center">
        <h2>
          <span className="pr-1 text-2xl italic text-neutral-700">
            {"#" + fetchedPokemon.id.toString().padStart(3, "0")}
          </span>
          <span className="text-4xl font-bold">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
        </h2>
        <img className="w-40" src={art} alt={name} />
        <div>{weight / 10}kg</div>
        <div>{height / 10}m</div>
        <div>
          {types.map((type) => (
            <p key={type}>{type}</p>
          ))}
        </div>
        <div>HP: {hp?.value}</div>
        <div>Attack: {attack?.value}</div>
        <div>Defence: {defence?.value}</div>
        <div>Special Attack: {s_attack?.value}</div>
        <div>Special Defence: {s_defence?.value}</div>
        <div>Speed: {speed?.value}</div>
      </div>
    );
  }

  return <div>{content}</div>;
}

export default Details;
