import { useState } from "react";
import type { Comment } from "./CommentSection";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  comment: Comment & {
    children?: Comment[];
  };
  postId: number;
}

const createReply = async (
  replyContent: string,
  postId: number,
  parentCommentId: number,
  userId?: string,
  author?: string
) => {
  if (!userId || !author) {
    throw new Error("You must be logged in to reply.");
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    content: replyContent,
    parent_comment_id: parentCommentId,
    user_id: userId,
    author: author,
  });

  if (error) throw new Error(error.message);
};

export const CommentItem = ({ comment, postId }: Props) => {
  const [showReply, setShowReply] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
 ;

  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (replyContent: string) =>
      createReply(
        replyContent,
        postId,
        comment.id,
        user?.id,
        user?.user_metadata?.user_name
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", postId] });
      setReplyText("");
      setShowReply(false);
    },
  });

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText) return;
    mutate(replyText);
  };

  return (
    <div className="pl-4 border-l border-white/10 ml-2">
  <div className="mb-3 bg-zinc-900/40 rounded-lg px-4 py-3 shadow-sm">
    <div className="flex items-center space-x-2 mb-1">
      <span className="text-sm font-semibold text-blue-400">
        {comment.author}
      </span>
      <span className="text-xs text-gray-400">
        {new Date(comment.created_at).toLocaleString()}
      </span>
    </div>
    <p className="text-zinc-200 text-sm leading-relaxed">{comment.content}</p>
    <button
      onClick={() => setShowReply((prev) => !prev)}
      className="text-sm mt-2 text-purple-400 hover:underline transition"
    >
      {showReply ? "Cancel" : "Reply"}
    </button>
  </div>

  {showReply && user && (
    <form onSubmit={handleReplySubmit} className="mb-4 ml-2 space-y-2">
      <textarea
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        className="w-full border border-white/10 bg-zinc-800 text-white p-2 rounded resize-none focus:ring-2 focus:ring-purple-500 outline-none"
        placeholder="Write a reply..."
        rows={2}
      />
      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded transition-all"
      >
        {isPending ? "Posting..." : "Post Reply"}
      </button>
      {isError && <p className="text-red-500 text-sm">Error posting reply.</p>}
    </form>
  )}

  {comment.children && comment.children.length > 0 && (
    <div className="ml-2">
      <button
        onClick={() => setIsCollapsed((prev) => !prev)}
        title={isCollapsed ? "Hide Replies" : "Show Replies"}
        className="flex items-center text-xs text-gray-400 hover:text-white transition"
      >
        {isCollapsed ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        )}
        <span className="ml-1">{isCollapsed ? "Show Replies" : "Hide Replies"}</span>
      </button>

      {!isCollapsed && (
        <div className="space-y-3 mt-2">
          {comment.children.map((child, key) => (
            <CommentItem key={key} comment={child} postId={postId} />
          ))}
        </div>
      )}
    </div>
  )}
</div>

  );
};