import { useEffect, useState, type ReactNode } from "react";
import ErrorMessage from "./ErrorMessage";
import { get } from "../util/http";

type EvolutionChainListProps = {
  id: number;
};

type EvolutionSpeciesType = {
  species: {
    name: string;
  };
  evolves_to?: EvolutionSpeciesType[];
};

type EvolutionChainType = {
  chain: EvolutionSpeciesType;
};

function EvolutionChainList({ id }: EvolutionChainListProps) {
  const [fetchedEvoChain, setFetchedEvoChain] = useState<string[]>();
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    function getEvolutionNames(evoChainData: EvolutionSpeciesType) {
      let names: string[] = [];

      // Find the end of the chain
      if (
        evoChainData.evolves_to === undefined ||
        evoChainData.evolves_to.length === 0
      ) {
        // Return the last name
        return [evoChainData.species.name];
      } else {
        // Not the last element, go deeper
        const name = getEvolutionNames(evoChainData.evolves_to[0]);
        names = names.concat(name);
        // Add the current level evolution name
        names.push(evoChainData.species.name);
        // Return all collected names thus far
        return names;
      }
    }

    // Fetch evolution chain url
    async function fetchEvoChainUrl(id: number) {
      try {
        const data = (await get(
          "https://pokeapi.co/api/v2/pokemon-species/" + id
        )) as { evolution_chain: { url: string } };
        const evoChainUrl: string = data.evolution_chain.url;
        return evoChainUrl;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.log(error);
        }
      }
    }

    // Get the evolution names from the url
    async function fetchEvoChain(ec_url: string) {
      try {
        const data = (await get(ec_url)) as EvolutionChainType;
        const evoData = getEvolutionNames(data.chain);
        return evoData;
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.log(error);
        }
      }
    }

    async function fetchAll() {
      setIsFetching(true);

      const ec_url = await fetchEvoChainUrl(id);
      console.log(ec_url);
      if (ec_url) {
        const evoChain = await fetchEvoChain(ec_url);
        setFetchedEvoChain(evoChain?.reverse());
      }
      setIsFetching(false);
    }

    fetchAll();
  }, [id]);

  let content: ReactNode;
  if (error) content = <ErrorMessage text={error} />;

  if (fetchedEvoChain) {
    content = (
      <ul className="flex flex-wrap gap-2">
        {fetchedEvoChain.map((name) => (
          <li key={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</li>
        ))}
      </ul>
    );
  }
  if (isFetching) content = <p>Loading...</p>;

  return (
    <div>
      <h3>Evolution Chain</h3>
      <div>{content}</div>
    </div>
  );
}

export default EvolutionChainList;
