import { describe, it, expect } from "vitest";
import { render, screen } from "../test-utils";
import Home from "../pages/Home";

describe("Home Component", () => {
  it("renders correctly", async () => {
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
});
