import { useEffect, useState } from "react";
import { get } from "../util/http";
import ErrorMessage from "./ErrorMessage";
import TypePill from "./TypePill";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export type PokeData = {
  name: string;
  url: string;
};

type RawPokeDetails = {
  id: number;
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
};

type PokeDetails = {
  id: number;
  art: string;
  types: string[];
};

function PokeListItem({ name, url }: PokeData) {
  const [fetchedPokemon, setFetchedPokemon] = useState<PokeDetails>();

  const { data, isLoading, error } = useQuery<RawPokeDetails>({
    queryKey: ["list-item", name],
    queryFn: () => get<RawPokeDetails>(url),
  });

  useEffect(() => {
    if (data) {
      const pokeDetails: PokeDetails = {
        id: data.id,
        art: data.sprites.other["official-artwork"].front_default,
        types: data.types.map((type) => type.type.name),
      };
      setFetchedPokemon(pokeDetails);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <ErrorMessage text={error.message} />;

  return (
    <div className=" border-black border-2 rounded-2xl m-2 transform transition duration-200 hover:scale-105 hover:-translate-y-1.5">
      <Link to={`/${fetchedPokemon?.id}`}>
        <div className="flex flex-col items-center p-2">
          <h2>
            <span className="pr-1 italic">
              {"#" + fetchedPokemon?.id.toString().padStart(3, "0")}
            </span>
            <span className="text-xl font-bold">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </span>
          </h2>
          <img className="w-40" src={fetchedPokemon?.art} alt={name} />
          <ul className="flex">
            {fetchedPokemon?.types.map((type) => (
              <li key={type}>
                <TypePill size="sm" pokeType={type} />
              </li>
            ))}
          </ul>
          {/* <Link to={`/${fetchedPokemon.id}`}>Details</Link> */}
        </div>
      </Link>
    </div>
  );
}

export default PokeListItem;
