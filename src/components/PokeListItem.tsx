import { useEffect, useState, type ReactNode } from "react";
import { get } from "../util/http";
import ErrorMessage from "./ErrorMessage";
import TypePill from "./TypePill";
import { Link } from "react-router-dom";

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
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchPokemon() {
      setIsFetching(true);
      try {
        const data = (await get(url)) as RawPokeDetails;
        const pokeDetails: PokeDetails = {
          id: data.id,
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
      <div className="flex flex-col items-center p-2">
        <h2>
          <span className="pr-1 italic">
            {"#" + fetchedPokemon.id.toString().padStart(3, "0")}
          </span>
          <span className="text-xl font-bold">
            {name.charAt(0).toUpperCase() + name.slice(1)}
          </span>
        </h2>
        <img className="w-40" src={fetchedPokemon.art} alt={name} />
        <ul className="flex">
          {fetchedPokemon.types.map((type) => (
            <li key={type}>
              <TypePill pokeType={type} />
            </li>
          ))}
        </ul>
        {/* <Link to={`/${fetchedPokemon.id}`}>Details</Link> */}
      </div>
    );
  }

  if (isFetching) {
    content = <p>Fetching Pokemon Details</p>;
  }

  return (
    <div className=" border-black border-2 rounded-2xl m-2 transform transition duration-200 hover:scale-105 hover:-translate-y-1.5">
      <Link to={`/${fetchedPokemon?.id}`}>{content}</Link>
    </div>
  );
}

export default PokeListItem;
