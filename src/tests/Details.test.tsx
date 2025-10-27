import { describe, it, expect } from "vitest";
import { render, screen } from "../test-utils";
import Details from "../pages/Details";

describe("Details Page", () => {
  it("renders name", async () => {
    render(<Details />);
    // screen.debug(); // Logs the DOM structure
    const poke = await screen.findByText(/bulbasaur/i);

    expect(poke).toBeInTheDocument();
  });

  it("renders art with correct src url", async () => {
    render(<Details />);
    // screen.debug(); // Logs the DOM structure
    // Wait for api call to finish and populate screen
    await screen.findByText(/bulbasaur/i);

    const displayedImage = document.querySelector("img") as HTMLImageElement;
    expect(displayedImage.src).toContain("art_url_here");
  });

  it("renders height correctly ", async () => {
    render(<Details />);
    const height = await screen.findByText(/height: 0.7m/i);
    expect(height).toBeInTheDocument();
  });

  it("renders weight correctly ", async () => {
    render(<Details />);
    const weight = await screen.findByText(/weight: 6.9kg/i);
    expect(weight).toBeInTheDocument();
  });

  it.for([["Grass"], ["Poison"]])(
    "renders type %s correctly",
    async ([type]) => {
      render(<Details />);
      const typeText = await screen.findByText(type);
      expect(typeText).toBeInTheDocument();
    }
  );

  describe("PokeStats", () => {
    it.for([
      ["HP", 45],
      ["ATT", 49],
      ["DEF", 49],
      ["S. ATT", 65],
      ["S. DEF", 65],
      ["SPD", 45],
    ])("renders stat %s with value %i correctly", async ([stat, value]) => {
      render(<Details />);
      const statText = await screen.findByText(stat + ": " + value);
      expect(statText).toBeInTheDocument();
    });
  });
});
