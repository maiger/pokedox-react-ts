import { useEffect, useState } from "react";
import { get } from "../util/http";
import ErrorMessage from "../components/ErrorMessage";
import type { PokeData } from "../components/PokeListItem";
import PokeList from "../components/PokeList";
import SearchBar from "../components/SearchBar";
import { useQuery } from "@tanstack/react-query";

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    if (fetchedPokemon) {
      setFilteredPokemon(
        fetchedPokemon.filter((poke) => poke.name.includes(term))
      );
    }
  };

  const { data, isLoading, error } = useQuery<RawPokeData>({
    queryKey: ["pokemon"],
    queryFn: () =>
      get<RawPokeData>("https://pokeapi.co/api/v2/pokemon?limit=9&offset=0"),
  });

  useEffect(() => {
    if (data) {
      const pokeData: PokeData[] = data.results.map((rawPost) => {
        return {
          name: rawPost.name,
          url: rawPost.url,
        };
      });
      setFetchedPokemon(pokeData);
      setFilteredPokemon(pokeData);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <ErrorMessage text={error.message} />;

  return (
    <main className="flex justify-center">
      <div className="flex flex-col items-center">
        <SearchBar handleChange={handleChange} />
        {filteredPokemon && filteredPokemon.length > 0 ? (
          <PokeList pokemon={filteredPokemon} />
        ) : (
          <p>Pokemon not found!</p>
        )}
      </div>
    </main>
  );
}

export default Home;
