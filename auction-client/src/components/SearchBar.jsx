export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <label htmlFor="search" className="visually-hidden">
        Sök auktioner på titel
      </label>
      <input
        id="search"
        type="search"
        placeholder="Sök på titel, t.ex. cykel eller tavla"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
    </div>
  );
}
