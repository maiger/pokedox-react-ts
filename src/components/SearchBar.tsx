type SearchBarProps = {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

function SearchBar({ handleChange }: SearchBarProps) {
  return (
    <div className="base-panel m-4 p-4">
      <label htmlFor="search-bar" className="mr-2">
        Search
      </label>
      <input
        id="search-bar"
        className="bg-white rounded-2xl pl-4 py-1"
        type="text"
        onChange={handleChange}
        aria-label="search-input"
      />
    </div>
  );
}

export default SearchBar;
