import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

import { PostSearch } from "./PostSearch";

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: string;
  image_url: string;
  avatar_url?: string;
  like_count?: number;
  comment_count?: number;
}

const fetchPosts = async (): Promise<Post[]> => {
  const { data, error } = await supabase.rpc("get_posts_with_counts");

  if (error) throw new Error(error.message);

  return data as Post[];
};

export const PostList = () => {
  const { data, error, isLoading } = useQuery<Post[], Error>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = data?.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="px-4 sm:px-6 lg:px-20 py-7 ">
      {/* Search Input */}
      <div className="flex justify-center mb-8">
        <div className="w-full max-w-xl">
          <PostSearch onSearch={setSearchQuery} />
        </div>
      </div>

      {/* Pinned Post */}
      <div className="flex justify-center mb-7">
        
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center text-white text-lg font-medium">Loading posts...</div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center text-red-500 text-lg font-medium">
          Error: {error.message}
        </div>
      )}

      {/* Posts Grid */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {filteredPosts && filteredPosts.length > 0 ? (
            filteredPosts.map((post) => <PostItem key={post.id} post={post} />)
          ) : (
            <div className="col-span-full text-center text-gray-400 text-md">
              No posts found for "<span className="italic">{searchQuery}</span>"
            </div>
          )}
        </div>
      )}
    </div>
  );
};
