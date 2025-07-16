import { useState } from "react";

interface Props {
  onSearch: (query: string) => void;
}

export const PostSearch = ({ onSearch }: Props) => {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="mb-2">
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={handleChange}
        className="w-full p-2 border border-gray-600 rounded-lg bg-gray-900 text-white"
      />
    </div>
  );
};
