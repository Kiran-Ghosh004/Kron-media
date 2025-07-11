import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";

interface Props {
    postId: number;
}

interface Vote {
    id: number;
    post_id: number;
    user_id: string;
    vote: number;
}

const vote = async (voteValue: number, postId: number, userId: string) => {
    const { data: existingVote } = await supabase
        .from("votes")
        .select("*")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .maybeSingle();

    if (existingVote) {
        // Liked -> 0, Like -> -1
        if (existingVote.vote === voteValue) {
            const { error } = await supabase
                .from("votes")
                .delete()
                .eq("id", existingVote.id);

            if (error) throw new Error(error.message);
        } else {
            const { error } = await supabase
                .from("votes")
                .update({ vote: voteValue })
                .eq("id", existingVote.id);

            if (error) throw new Error(error.message);
        }
    } else {
        const { error } = await supabase
            .from("votes")
            .insert({ post_id: postId, user_id: userId, vote: voteValue });
        if (error) throw new Error(error.message);
    }
};

const fetchVotes = async (postId: number): Promise<Vote[]> => {
    const { data, error } = await supabase
        .from("votes")
        .select("*")
        .eq("post_id", postId);

    if (error) throw new Error(error.message);
    return data as Vote[];
};

export const LikeButton = ({ postId }: Props) => {
    const { user } = useAuth();

    const queryClient = useQueryClient();

    const {
        data: votes,
        isLoading,
        error,
    } = useQuery<Vote[], Error>({
        queryKey: ["votes", postId],
        queryFn: () => fetchVotes(postId),
        refetchInterval: 5000,
    });

    const { mutate } = useMutation({
        mutationFn: (voteValue: number) => {
            if (!user) throw new Error("You must be logged in to Vote!");
            return vote(voteValue, postId, user.id);
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["votes", postId] });
        },
    });

    if (isLoading) {
        return <div> Loading votes...</div>;
    }

    if (error) {
        return <div> Error: {error.message}</div>;
    }

    const likes = votes?.filter((v) => v.vote === 1).length || 0;
    const dislikes = votes?.filter((v) => v.vote === -1).length || 0;
    const userVote = votes?.find((v) => v.user_id === user?.id)?.vote;

    return (
        <div className="flex items-center gap-4 my-6">
            <button
                onClick={() => mutate(1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition  shadow-md hover:scale-105 ${userVote === 1
                        ? "bg-green-600 text-white"
                        : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                    }`}
            >
                👍 <span>{likes}</span>
            </button>

            <button
                onClick={() => mutate(-1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition  shadow-md hover:scale-105 ${userVote === -1
                        ? "bg-red-600 text-white"
                        : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                    }`}
            >
                👎 <span>{dislikes}</span>
            </button>

            <button
                onClick={() => mutate(1)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition  shadow-md hover:scale-105 ${userVote === 2
                        ? "bg-pink-600 text-white"
                        : "bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                    }`}
            >
                ❤️ <span>{votes?.filter((v) => v.vote === 2).length || 0}</span>
            </button>
        </div>
    );

};