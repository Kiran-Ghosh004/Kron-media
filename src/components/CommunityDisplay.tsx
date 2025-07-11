import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { PostItem } from "./PostItem";

interface Props {
  communityId: number;
}

interface PostWithCommunity extends Post {
  communities: {
    name: string;
  };
}

export const fetchCommunityPost = async (
  communityId: number
): Promise<PostWithCommunity[]> => {
  const { data, error } = await supabase
    .from("posts")
    .select(
      `
        *,
        communities(name),
        votes(count),
        comments(count)
      `
    )
    .eq("community_id", communityId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data as any).map((post: any) => ({
    ...post,
    like_count: post.votes?.[0]?.count || 0,
    comment_count: post.comments?.[0]?.count || 0,
  })) as PostWithCommunity[];
};

export const CommunityDisplay = ({ communityId }: Props) => {
  const { data, error, isLoading } = useQuery<PostWithCommunity[], Error>({
    queryKey: ["communityPost", communityId],
    queryFn: () => fetchCommunityPost(communityId),
  });

  if (isLoading)
    return (
      <div className="text-center py-12 text-xl text-white/70 animate-pulse">
        Loading community posts...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 py-10 font-semibold text-lg">
        Error: {error.message}
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto px-4">
      {/* Community Header */}
      <h2 className="text-center text-4xl sm:text-5xl font-bold mb-10">
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          {data && data[0]?.communities?.name || "Community"}
        </span>{" "}
        <span className="text-zinc-300">Posts</span>
      </h2>

      {/* Posts Grid or Empty Message */}
      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((post) => (
            <PostItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg mt-16">
          No posts in this community yet.
        </p>
      )}
    </div>
  );
};
