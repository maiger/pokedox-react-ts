import { useEffect, useState, type ReactNode } from "react";
import { get } from "../util/http";
import ErrorMessage from "../components/ErrorMessage";
import type { PokeData } from "../components/PokeListItem";
import PokeList from "../components/PokeList";
import SearchBar from "../components/SearchBar";

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
  const [filteredPokemon, setFilteredPokemon] = useState<PokeData[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    if (fetchedPokemon) {
      setFilteredPokemon(
        fetchedPokemon.filter((poke) => poke.name.includes(term))
      );
    }
  };

  // TODO: This useEffect fetch is used in multiple places, refactor if possible.
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
        setFilteredPokemon(pokeData);
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
  if (error) content = <ErrorMessage text={error} />;
  if (isFetching) content = <p>Fetching posts...</p>;
  if (filteredPokemon)
    content = (
      <div className="flex flex-col items-center">
        <SearchBar handleChange={handleChange} />
        {filteredPokemon.length > 0 ? (
          <PokeList pokemon={filteredPokemon} />
        ) : (
          <p>Pokemon not found!</p>
        )}
      </div>
    );

  return <main className="flex justify-center">{content}</main>;
}

export default Home;
