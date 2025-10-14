import { useEffect, useState, type ReactNode } from "react";
import { get } from "./util/http";
import ErrorMessage from "./components/ErrorMessage";

type PokeData = {
  name: string;
  url: string;
};

type RawPokeData = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

function App() {
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
        console.log("RAW DATA");
        console.log(data);

        const pokeData: PokeData[] = data.results.map((rawPost) => {
          return {
            name: rawPost.name,
            url: rawPost.url,
          };
        });
        setFetchedPokemon(pokeData);
        console.log(pokeData);
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
    content = <p>Fetching complete</p>;
  }

  if (isFetching) {
    content = <p>Fetching posts...</p>;
  }

  return <main>{content}</main>;
}

export default App;
