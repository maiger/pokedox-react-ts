import { http, HttpResponse } from "msw";

import {
  mockPokemon,
  mockPokemonById,
  mockPokemonSpecies,
  mockTypeGrass,
} from "./mockData";

export const handlers = [
  http.get("https://pokeapi.co/api/v2/pokemon", () => {
    return HttpResponse.json(mockPokemon);
  }),
  http.get("https://pokeapi.co/api/v2/pokemon/:id", () => {
    return HttpResponse.json(mockPokemonById);
  }),

  // Types
  http.get("https://pokeapi.co/api/v2/type/grass", () => {
    return HttpResponse.json(mockTypeGrass);
  }),
  http.get("https://pokeapi.co/api/v2/type/poison", () => {
    return HttpResponse.json(mockTypePoison);
  }),

  // Species
  http.get("https://pokeapi.co/api/v2/pokemon-species/1", () => {
    return HttpResponse.json(mockPokemonSpecies);
  }),
];
