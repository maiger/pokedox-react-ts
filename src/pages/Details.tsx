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
};

type FullPokeDetails = {
  id: number;
  name: string;
  weight: number;
  height: number;
  art: string;
  types: string[];
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

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (fetchedPokemon) {
    const { name } = fetchedPokemon;
    content = (
      <div>
        <h2>{name.charAt(0).toUpperCase() + name.slice(1)}</h2>
      </div>
    );
  }

  if (isFetching) {
    content = <p>Fetching Pokemon Details</p>;
  }

  return <div>{content}</div>;
}

export default Details;
