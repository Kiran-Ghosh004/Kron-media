import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

interface Props {
  postId: number;
}

const fetchPostById = async (id: number): Promise<Post> => {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);

  return data as Post;
};

export const PostDetail = ({ postId }: Props) => {
  const { data, error, isLoading } = useQuery<Post, Error>({
    queryKey: ["post", postId],
    queryFn: () => fetchPostById(postId),
  });

  if (isLoading) {
    return (
      <div className="text-center text-gray-400 py-10 text-lg animate-pulse">
        Loading post...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10 text-lg">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-xl text-white space-y-6 transition-all duration-300">
      <h2 className="text-4xl sm:text-5xl font-extrabold text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-sm">
        {data?.title}
      </h2>

      {data?.image_url && (
        <a
          href={data?.image_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={data?.image_url}
            alt={data?.title}
            className="w-full max-h-[500px] object-contain rounded-lg shadow-md hover:opacity-90 transition-opacity"
          />
        </a>
      )}

      <p className="text-lg text-zinc-300 leading-relaxed mt-5">
        {data?.content}
      </p>

      <p className="text-sm text-gray-500 border-t border-zinc-700 pt-4">
        📅 Posted on:{" "}
        <span className="text-gray-400">
          {new Date(data!.created_at).toLocaleDateString()}
        </span>
      </p>

      <div className="pt-2">
        <LikeButton postId={postId} />
      </div>

      <div className="pt-4">
        <CommentSection postId={postId} />
      </div>
    </div>
  );
};
