import { describe, it, expect } from "vitest";
import { fireEvent, render, screen } from "../test-utils";
import Home from "../pages/Home";

describe("Home Page", () => {
  it("renders PokeList", async () => {
    render(<Home />);
    const poke1 = await screen.findByText(/bulbasaur/i);
    const poke2 = await screen.findByText(/ivysaur/i);
    const poke3 = await screen.findByText(/venusaur/i);
    // screen.debug(); // Logs the DOM structure
    expect(poke1).toBeInTheDocument();
    expect(poke2).toBeInTheDocument();
    expect(poke3).toBeInTheDocument();

    // another way
    const pokes = await screen.findAllByText(/bulbasaur|ivysaur|venusaur/i);
    expect(pokes).toHaveLength(3);
  });

  it("renders SearchBar", async () => {
    render(<Home />);
    const text = await screen.findByText("Search");
    expect(text).toBeInTheDocument();
  });

  describe.only("SearchBar/PokeList", () => {
    it("filters for single results", async () => {
      render(<Home />);
      const input: HTMLInputElement = await screen.findByLabelText(
        "search-input"
      );

      fireEvent.change(input, { target: { value: "bulb" } });
      const poke1 = await screen.findByText(/bulbasaur/i);
      expect(poke1).toBeInTheDocument();

      fireEvent.change(input, { target: { value: "ivys" } });
      const poke2 = await screen.findByText(/ivysaur/i);
      expect(poke2).toBeInTheDocument();
      expect(poke1).not.toBeInTheDocument();

      fireEvent.change(input, { target: { value: "venu" } });
      const poke3 = await screen.findByText(/venusaur/i);
      expect(poke3).toBeInTheDocument();
      expect(poke1).not.toBeInTheDocument();
      expect(poke2).not.toBeInTheDocument();
    });

    it("filters for no results", async () => {
      render(<Home />);
      const input: HTMLInputElement = await screen.findByLabelText(
        "search-input"
      );

      fireEvent.change(input, { target: { value: "asd" } });
      const text = await screen.findByText(/Pokemon not found!/i);
      expect(text).toBeInTheDocument();
    });

    it("filters for multiple results", async () => {
      render(<Home />);
      const input: HTMLInputElement = await screen.findByLabelText(
        "search-input"
      );

      fireEvent.change(input, { target: { value: "v" } });

      const poke2 = await screen.findByText(/ivysaur/i);
      const poke3 = await screen.findByText(/venusaur/i);

      expect(poke2).toBeInTheDocument();
      expect(poke3).toBeInTheDocument();
    });
  });
});
