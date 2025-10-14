import { useEffect, useState, type ReactNode } from "react";
import { get } from "../util/http";
import ErrorMessage from "../components/ErrorMessage";
import type { PokeData } from "../components/PokeListItem";
import PokeList from "../components/PokeList";

type RawPokeData = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

function Home() {
  const [fetchedPokemon, setFetchedPokemon] = useState<PokeData[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function fetchPokemon() {
      setIsFetching(true);
      try {
        const data = (await get(
          "https://pokeapi.co/api/v2/pokemon?limit=9&offset=0"
        )) as RawPokeData;

        const pokeData: PokeData[] = data.results.map((rawPost) => {
          return {
            name: rawPost.name,
            url: rawPost.url,
          };
        });
        setFetchedPokemon(pokeData);
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
  }, []);

  let content: ReactNode;

  if (error) {
    content = <ErrorMessage text={error} />;
  }

  if (fetchedPokemon) {
    content = <PokeList pokemon={fetchedPokemon} />;
  }

  if (isFetching) {
    content = <p>Fetching posts...</p>;
  }

  return <main>{content}</main>;
}

export default Home;
