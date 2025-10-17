import { useEffect, useState, type ReactNode } from "react";
import { get } from "../util/http";
import ErrorMessage from "./ErrorMessage";

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
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    // Fetch type relations
    async function fetchTypeRelations(id: number) {
      setIsFetching(true);
      try {
        const data = (await get(
          "https://pokeapi.co/api/v2/pokemon-species/" + id
        )) as RawFlavorTextType;
        const flavorText: FlavorTextType = {
          flavorText: data.flavor_text_entries[0].flavor_text,
        };

        setFetchedFlavorText(flavorText);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.log(error);
        }
      }

      setIsFetching(false);
    }

    fetchTypeRelations(id);
  }, [id]);

  let content: ReactNode;
  if (error) content = <ErrorMessage text={error} />;

  if (fetchedFlavorText) {
    content = <h3>{fetchedFlavorText.flavorText}</h3>;
  }
  if (isFetching) content = <p>Loading...</p>;

  return <div>{content}</div>;
}

export default FlavorText;
