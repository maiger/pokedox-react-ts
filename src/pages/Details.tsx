import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { get } from "../util/http";
import PokeStats from "../components/PokeStats";
import TypePill from "../components/TypePill";

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
    const pokeStats = {
      hp: stats.find((s) => s.name === "hp")?.value.toString() || "N/A",
      attack: stats.find((s) => s.name === "attack")?.value.toString() || "N/A",
      defence:
        stats.find((s) => s.name === "defense")?.value.toString() || "N/A",
      s_attack:
        stats.find((s) => s.name === "special-defense")?.value.toString() ||
        "N/A",
      s_defence:
        stats.find((s) => s.name === "special-attack")?.value.toString() ||
        "N/A",
      speed: stats.find((s) => s.name === "speed")?.value.toString() || "N/A",
    };

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
        <div>Lorem ipsum dolor sit amet.</div>
        <div>{weight / 10}kg</div>
        <div>{height / 10}m</div>
        <ul className="flex">
          {types.map((type) => (
            <li key={type}>
              <TypePill size="l" pokeType={type} />
            </li>
          ))}
        </ul>
        <PokeStats stats={pokeStats} />
      </div>
    );
  }

  return <div>{content}</div>;
}

export default Details;
