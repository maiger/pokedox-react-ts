import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { get } from "../util/http";
import { useQuery } from "@tanstack/react-query";
import EvolutionChainListItem from "./EvolutionChainListItem";

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

type EvoUrlType = { evolution_chain: { url: string } };

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

function EvolutionChainList({ id }: EvolutionChainListProps) {
  const [fetchedEvoChain, setFetchedEvoChain] = useState<string[]>();

  // Get evolution chain url
  const {
    data: url,
    isLoading: loadingUrl,
    error: errorUrl,
  } = useQuery<EvoUrlType>({
    queryKey: ["evo-chain-url", id],
    queryFn: () =>
      get<EvoUrlType>("https://pokeapi.co/api/v2/pokemon-species/" + id),
  });

  const evoUrl = url?.evolution_chain.url;

  // Get evolution names
  const {
    data: evoNames,
    isLoading: loadingEvo,
    error: errorEvo,
  } = useQuery<EvolutionChainType>({
    queryKey: ["evo-chain-names", evoUrl],
    // Enabled makes sure this wont be executed before evoUrl exists, hence "!"
    queryFn: () => get<EvolutionChainType>(evoUrl!),
    enabled: !!evoUrl,
  });

  useEffect(() => {
    if (evoNames) {
      const evolutionNames = getEvolutionNames(evoNames.chain);
      setFetchedEvoChain(evolutionNames.reverse());
    }
  }, [evoNames]);

  if (loadingUrl || loadingEvo) return <div>Loading...</div>;
  if (errorUrl instanceof Error)
    return <ErrorMessage text={errorUrl.message} />;
  if (errorEvo instanceof Error)
    return <ErrorMessage text={errorEvo.message} />;

  return (
    <div className="bg-amber-200 p-4 rounded-2xl mt-6">
      <h3>Evolution Chain</h3>
      <div>
        <ul className="flex flex-wrap gap-2">
          {fetchedEvoChain?.map((name) => (
            // <li key={name}>{name.charAt(0).toUpperCase() + name.slice(1)}</li>
            <li key={name}>
              <EvolutionChainListItem name={name} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default EvolutionChainList;
