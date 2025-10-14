import { useEffect, useState, type ReactNode } from "react";
import { get } from "../util/http";
import ErrorMessage from "./ErrorMessage";

export type PokeData = {
  name: string;
  url: string;
};

type RawPokeDetails = {
  id: number;
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
};

type PokeDetails = {
  id: number;
  weight: number;
  height: number;
  art: string;
  types: string[];
};

function PokeListItem({ name, url }: PokeData) {
  const [fetchedPokemon, setFetchedPokemon] = useState<PokeDetails>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchPokemon() {
      setIsFetching(true);
      try {
        const data = (await get(url)) as RawPokeDetails;
        const pokeDetails: PokeDetails = {
          id: data.id,
          weight: data.weight,
          height: data.height,
          art: data.sprites.other["official-artwork"].front_default,
          types: data.types.map((type) => type.type.name),
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
  }, [url]);

  let content: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (fetchedPokemon) {
    content = (
      <div className="flex flex-col items-center">
        <h2>
          <span className="pr-1 italic">
            {"#" + fetchedPokemon.id.toString().padStart(3, "0")}
          </span>
          <span className="text-xl font-bold">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
        </h2>
        <p>Height: {fetchedPokemon.height}</p>
        <p>Weight: {fetchedPokemon.weight}</p>
        <img className="w-40" src={fetchedPokemon.art} alt={name} />
        <div>
          {fetchedPokemon.types.map((type) => (
            <span
              key={type}
              className="inline-block text-center w-20 mx-1 px-2 py-1 rounded-full bg-amber-200 text-sm"
            >
              {type}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (isFetching) {
    content = <p>Fetching Pokemon Details</p>;
  }

  return (
    <div className=" border-black border-2 rounded-2xl p-2 m-2">
      <div>{content}</div>
    </div>
  );
}

export default PokeListItem;
