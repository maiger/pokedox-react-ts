import { http, HttpResponse } from "msw";

import { mockPokemon, mockPokemonById } from "./mockData";

export const handlers = [
  http.get("https://pokeapi.co/api/v2/pokemon", () => {
    return HttpResponse.json(mockPokemon);
  }),
  http.get("https://pokeapi.co/api/v2/pokemon/:id", () => {
    return HttpResponse.json(mockPokemonById);
  }),
];
