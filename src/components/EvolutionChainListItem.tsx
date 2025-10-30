import { useQuery } from "@tanstack/react-query";
import { get } from "../util/http";
import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { Link } from "react-router-dom";

type EvolutionChainListProps = {
  name: string;
};

type RawArtSrc = {
  id: number;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
};

type ArtSrc = {
  id: number;
  art: string;
};

function EvolutionChainListItem({ name }: EvolutionChainListProps) {
  const [fetchedArtSrc, setFetchedArtSrc] = useState<string>();
  const [fetchedId, setFetchedId] = useState<number>();

  const { data, isLoading, error } = useQuery<RawArtSrc>({
    queryKey: ["evo-item", name],
    queryFn: () => get<RawArtSrc>("https://pokeapi.co/api/v2/pokemon/" + name),
  });

  useEffect(() => {
    if (data) {
      const artSrc: ArtSrc = {
        id: data.id,
        art: data.sprites.other["official-artwork"].front_default,
      };
      setFetchedArtSrc(artSrc.art);
      setFetchedId(artSrc.id);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <ErrorMessage text={error.message} />;

  return (
    <div className="flex flex-col items-center m-2">
      <Link to={`/${fetchedId}`}>
        <img
          src={fetchedArtSrc}
          alt={name}
          className="w-40 bg-white rounded-full p-6"
        />
      </Link>
      <p>{name.charAt(0).toUpperCase() + name.slice(1)}</p>
    </div>
  );
}

export default EvolutionChainListItem;
