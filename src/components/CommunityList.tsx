import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { Link } from "react-router";

export interface Community {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export const fetchCommunities = async (): Promise<Community[]> => {
  const { data, error } = await supabase
    .from("communities")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as Community[];
};

export const CommunityList = () => {
  const { data, error, isLoading } = useQuery<Community[], Error>({
    queryKey: ["communities"],
    queryFn: fetchCommunities,
  });

  if (isLoading)
    return (
      <div className="text-center py-6 text-gray-400 animate-pulse">
        Loading communities...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 py-6">
        Error: {error.message}
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-6 px-4">
      {data?.map((community) => (
        <div
          key={community.id}
          className="border border-white/10 bg-zinc-900/60 hover:bg-zinc-800 transition-colors p-6 rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-1 duration-200"
        >
          <Link
            to={`/community/${community.id}`}
            className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent hover:underline transition"
          >
            {community.name}
          </Link>
          <p className="text-gray-300 mt-3 leading-relaxed tracking-wide text-sm sm:text-base">
            {community.description}
          </p>
        </div>
      ))}
    </div>
  );
};
