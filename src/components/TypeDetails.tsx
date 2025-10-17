import { useEffect, useState, type ReactNode } from "react";
import ErrorMessage from "./ErrorMessage";
import { get } from "../util/http";
import TypePill from "./TypePill";

type TypeDetails = {
  types: string[];
};

type RawTypeRelations = {
  damage_relations: {
    double_damage_from: {
      name: string;
    }[];
  };
};

type TypeRelations = {
  double_damage: string[];
};

function TypeDetails({ types }: TypeDetails) {
  const [fetchedTypeRelations, setTypeRelations] = useState<TypeRelations>({
    double_damage: [],
  });
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string>();

  // This seems to be fetched too often? Usually x3, one legit, once because of strict-mode, but also a third time?
  useEffect(() => {
    // Fetch type relations
    async function fetchTypeRelations(type: string) {
      setIsFetching(true);
      try {
        const data = (await get(
          "https://pokeapi.co/api/v2/type/" + type
        )) as RawTypeRelations;
        const typeRelations: TypeRelations = {
          double_damage: data.damage_relations.double_damage_from.map(
            (damage) => {
              return damage.name;
            }
          ),
        };

        setTypeRelations((prevTypeRelations) => {
          return {
            // Remove possible duplicates
            double_damage: [
              ...new Set([
                ...prevTypeRelations.double_damage,
                ...typeRelations.double_damage,
              ]),
            ],
          };
        });
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
          console.log(error);
        }
      }

      setIsFetching(false);
    }

    setTypeRelations({
      double_damage: [],
    });
    types.forEach((type) => {
      console.log("Fetching Type Details For: ", type);
      fetchTypeRelations(type);
    });
  }, [types]);

  let content: ReactNode;
  if (error) content = <ErrorMessage text={error} />;

  if (fetchedTypeRelations) {
    content = (
      <ul className="flex flex-wrap">
        {fetchedTypeRelations.double_damage.map((type) => (
          <li key={type}>
            <TypePill size="l" pokeType={type} />
          </li>
        ))}
      </ul>
    );
  }
  if (isFetching) content = <p>Loading...</p>;

  return <div>{content}</div>;
}

export default TypeDetails;
