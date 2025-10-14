import { useEffect, useState, type ReactNode } from "react";
import { get } from "../util/http";
import ErrorMessage from "./ErrorMessage";

export type PokeData = {
  name: string;
  url: string;
};

type RawPokeDetails = {
  id: number;
  weigth: number;
  height: number;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
};

type PokeDetails = {
  id: number;
  weigth: number;
  height: number;
  art: string;
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
          weigth: data.weigth,
          height: data.height,
          art: data.sprites.other["official-artwork"].front_default,
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
      <div>
        <p>Height: {fetchedPokemon.height}</p>
        <p>Weight: {fetchedPokemon.weigth}</p>
        <img src={fetchedPokemon.art} alt={name} />
      </div>
    );
  }

  if (isFetching) {
    content = <p>Fetching Pokemon Details</p>;
  }

  return (
    <div>
      <h2>{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
      <div>{content}</div>
    </div>
  );
}

export default PokeListItem;
