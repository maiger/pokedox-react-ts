import { useEffect, useState, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import ErrorMessage from "../components/ErrorMessage";
import { get } from "../util/http";
import PokeStats from "../components/PokeStats";
import TypePill from "../components/TypePill";
import TypeDetails from "../components/TypeDetails";
import FlavorText from "../components/FlavorText";
import EvolutionChainList from "../components/EvolutionChainList";
import { useQuery } from "@tanstack/react-query";

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

  const { data, isLoading, error } = useQuery<RawFullPokeDetails>({
    queryKey: ["details", id],
    queryFn: () =>
      get<RawFullPokeDetails>("https://pokeapi.co/api/v2/pokemon/" + id),
  });

  useEffect(() => {
    if (data) {
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
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <ErrorMessage text={error.message} />;

  let content: ReactNode;
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
        <h2 className="my-6">
          <span className="pr-1 text-2xl italic text-neutral-700">
            {"#" + fetchedPokemon.id.toString().padStart(3, "0")}
          </span>
          <span className="text-4xl font-bold">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
        </h2>
        <div className="flex max-sm:flex-col max-sm:items-center gap-4">
          {/* // Left column | Art */}
          <div>
            <img
              className="flex flex-col items-center w-80 m-2 p-6 bg-amber-200 rounded-full"
              src={art}
              alt={name}
            />
          </div>
          {/* // Right column | */}
          <div className="flex flex-col gap-4 w-100">
            <FlavorText id={fetchedPokemon.id} />
            <div className="flex justify-around">
              <p className="bg-amber-200 px-4 py-2 rounded-2xl">
                Weight: {weight / 10}kg
              </p>
              <p className="bg-amber-200 px-4 py-2 rounded-2xl">
                Height: {height / 10}m
              </p>
            </div>
            {/* // Types */}
            <div>
              <div>
                <h4 className="mb-2">Type</h4>
                <ul className="flex flex-wrap">
                  {types.map((type) => (
                    <li key={type}>
                      <TypePill size="l" pokeType={type} />
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <h4 className="mb-2">Weaknesses</h4>
                <TypeDetails types={types} />
              </div>
            </div>
            {/* Stats */}
            <PokeStats stats={pokeStats} />
          </div>
        </div>
        <EvolutionChainList id={fetchedPokemon.id} />
      </div>
    );
  }

  return <div>{content}</div>;
}

export default Details;
