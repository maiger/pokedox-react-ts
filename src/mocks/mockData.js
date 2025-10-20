export const mockPokemon = {
  count: 1302,
  next: "https://pokeapi.co/api/v2/pokemon?offset=9&limit=9",
  previous: null,
  results: [
    {
      name: "bulbasaur",
      url: "https://pokeapi.co/api/v2/pokemon/1/",
    },
    {
      name: "ivysaur",
      url: "https://pokeapi.co/api/v2/pokemon/2/",
    },
    {
      name: "venusaur",
      url: "https://pokeapi.co/api/v2/pokemon/3/",
    },
  ],
};

export const mockPokemonById = {
  id: 1,
  sprites: {
    other: {
      "official-artwork": {
        front_default: "art_url_here",
      },
    },
  },
  types: [
    {
      type: {
        name: "grass",
      },
    },
    {
      type: {
        name: "poison",
      },
    },
  ],
};

// export const mockPokemonById = [
//   {
//     id: 1,
//     sprites: {
//       other: {
//         "official-artwork": {
//           front_default: "art_url_here",
//         },
//       },
//     },
//     types: {
//       type: {
//         name: "Bulbasaur",
//       },
//     },
//   },
//   {
//     id: 2,
//     sprites: {
//       other: {
//         "official-artwork": {
//           front_default: "art_url_here",
//         },
//       },
//     },
//     types: {
//       type: {
//         name: "Ivysaur",
//       },
//     },
//   },
//   {
//     id: 3,
//     sprites: {
//       other: {
//         "official-artwork": {
//           front_default: "art_url_here",
//         },
//       },
//     },
//     types: {
//       type: {
//         name: "Venusaur",
//       },
//     },
//   },
// ];
