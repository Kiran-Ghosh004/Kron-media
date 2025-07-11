import { useQuery } from "@tanstack/react-query";
import type { Post } from "./PostList";
import { supabase } from "../supabase-client";
import { LikeButton } from "./LikeButton";
import { CommentSection } from "./CommentSection";

interface Props {
    postId: number;
}

// Update: fetch post with its community name
const fetchPostById = async (
    id: number
): Promise<Post & { community: { name: string } }> => {
    const { data, error } = await supabase
        .from("posts")
        .select("*, community:communities(name)")
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Post & { community: { name: string } };
};

export const PostDetail = ({ postId }: Props) => {
    const { data, error, isLoading } = useQuery<
        Post & { community: { name: string } },
        Error
    >({
        queryKey: ["post", postId],
        queryFn: () => fetchPostById(postId),
    });

    if (isLoading) {
        return (
            <div className="text-center text-gray-500 text-lg py-10 animate-pulse">
                Loading posts...
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 text-lg py-10">
                Error loading posts: {error.message}
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto bg-zinc-900 border border-zinc-700 p-6 rounded-xl shadow-lg text-white space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                {data?.title}
            </h2>

            {/* 👇 Community name display */}
            {(
                <p className="text-sm text-gray-400 mt-1">
                    Posted in:{" "}
                    <span className="font-medium">
                        {data?.community?.name ? data.community.name : "General"}
                    </span>
                </p>
            )}

            <a href={data?.image_url} target="_blank" rel="noopener noreferrer">
                <img
                    src={data?.image_url}
                    alt={data?.title}
                    className="w-full max-h-[500px] object-contain rounded-lg shadow-md"
                />
            </a>


            <h3 className="text-lg leading-relaxed text-zinc-300 mt-5">{data?.content}</h3>

            <div className="flex justify-between items-center mt-6">
                <span className="text-gray-400 text-sm">
                    Posted on: {new Date(data!.created_at).toLocaleDateString()}
                </span>
                {data?.avatar_url && (
                    <img
                        src={data.avatar_url}
                        alt="User Avatar"
                        className="w-[35px] h-[35px] rounded-full object-cover border border-white/20 shadow-sm"
                    />
                )}
            </div>

            <LikeButton postId={postId} />
            <CommentSection postId={postId} />
        </div>
    );
};
