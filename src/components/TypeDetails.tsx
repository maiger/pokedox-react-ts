import { useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { get } from "../util/http";
import TypePill from "./TypePill";
import { useQueries } from "@tanstack/react-query";

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

  const typeQueries = useQueries({
    queries: types.map((type) => {
      return {
        queryKey: ["type-detail", type],
        queryFn: () =>
          get<RawTypeRelations>("https://pokeapi.co/api/v2/type/" + type),
      };
    }),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        isLoading: results.some((result) => result.isLoading),
        error: results.map((result) => result.error),
      };
    },
  });

  // TODO: Could this be simplified? Looks too much like a pyramid
  useEffect(() => {
    if (typeQueries.data) {
      // On data change, build and add correct type data
      typeQueries.data.forEach((data) => {
        if (data) {
          // Build correct type
          const typeRelations: TypeRelations = {
            double_damage: data.damage_relations.double_damage_from.map(
              (damage) => {
                return damage.name;
              }
            ),
          };

          // Save updated data
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
        }
      });
    }
  }, [typeQueries.data, types]);

  if (typeQueries.isLoading) return <div>Loading...</div>;
  if (typeQueries.error[0])
    return <ErrorMessage text={typeQueries.error[0].message} />;

  return (
    <div>
      <ul className="flex flex-wrap">
        {fetchedTypeRelations.double_damage.map((type) => (
          <li key={type}>
            <TypePill size="l" pokeType={type} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TypeDetails;
