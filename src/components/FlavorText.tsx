import { useEffect, useState } from "react";
import { get } from "../util/http";
import ErrorMessage from "./ErrorMessage";
import { useQuery } from "@tanstack/react-query";

type FlavorTextProps = {
  id: number;
};

type FlavorTextType = {
  flavorText: string;
};

type RawFlavorTextType = {
  flavor_text_entries: { flavor_text: string }[];
};

function FlavorText({ id }: FlavorTextProps) {
  const [fetchedFlavorText, setFetchedFlavorText] = useState<FlavorTextType>();

  const { data, isLoading, error } = useQuery<RawFlavorTextType>({
    queryKey: ["pokemon"],
    queryFn: () =>
      get<RawFlavorTextType>("https://pokeapi.co/api/v2/pokemon-species/" + id),
  });

  useEffect(() => {
    if (data) {
      const flavorText: FlavorTextType = {
        flavorText: data.flavor_text_entries[0].flavor_text,
      };
      setFetchedFlavorText(flavorText);
    }
  }, [data]);

  if (isLoading) return <div>Loading...</div>;
  if (error instanceof Error) return <ErrorMessage text={error.message} />;

  return (
    <div>
      <h3>{fetchedFlavorText?.flavorText}</h3>
    </div>
  );
}

export default FlavorText;
