import { useState } from "react";
import type { ChangeEvent } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import { fetchCommunities } from "./CommunityList";
import type { Community } from "./CommunityList";

interface PostInput {
    title: string;
    content: string;
    avatar_url: string | null;
    community_id?: number | null;
    

}

const createPost = async (post: PostInput, imageFile: File) => {
    const filePath = `${post.title}-${Date.now()}-${imageFile.name}`;

    const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(filePath, imageFile);

    if (uploadError) throw new Error(uploadError.message);

    const { data: publicURLData } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

    const { data, error } = await supabase
        .from("posts")
        .insert({ ...post, image_url: publicURLData.publicUrl });

    if (error) throw new Error(error.message);

    return data;
};

export const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [communityId, setCommunityId] = useState<number | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const { user } = useAuth();

    const { data: communities } = useQuery<Community[], Error>({
        queryKey: ["communities"],
        queryFn: fetchCommunities,
    });

    const { mutate, isPending, isError } = useMutation({
        mutationFn: (data: { post: PostInput; imageFile: File }) =>
            createPost(data.post, data.imageFile),
        onSuccess: () => {
            setTitle("");
            setContent("");
            setCommunityId(null);
            setSelectedFile(null);
            setIsSuccess(true);

            // Hide success message after 3 seconds
            setTimeout(() => setIsSuccess(false), 3000);
        },
    });

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (!selectedFile) return;
        mutate({
            post: {
                title,
                content,
                avatar_url: user?.user_metadata.avatar_url || null,


                community_id: communityId,
            },
            imageFile: selectedFile,
        });
    };

    const handleCommunityChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setCommunityId(value ? Number(value) : null);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-zinc-900/60 rounded-xl shadow-lg space-y-6">
            <div>
                <label htmlFor="title" className="block mb-2 text-white font-semibold tracking-wide">
                    Title with your name
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-white/10 bg-zinc-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                    required
                />
            </div>

            <div>
                <label htmlFor="content" className="block mb-2 text-white font-semibold tracking-wide">
                    Content
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border border-white/10 bg-zinc-800 text-white p-3 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
                    rows={3}
                    required
                />
            </div>

            <div>
                <label className="block mb-2 text-white font-semibold tracking-wide">
                    Select Community
                </label>
                <select
                    id="community"
                    value={communityId ?? ""}
                    onChange={handleCommunityChange}
                    className="w-full border border-white/10 bg-zinc-800 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="">Choose a Community</option>
                    {communities?.map((community) => (
                        <option key={community.id} value={community.id}>
                            {community.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="image" className="block mb-2 text-white font-semibold tracking-wide">
                    Upload Image
                </label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 transition-colors text-white font-semibold py-3 rounded-lg"
            >
                {isPending ? "Creating..." : "Create Post"}
            </button>

            {isSuccess && <p className="text-green-500 text-sm mt-2">✅ Post created successfully!</p>}
            {isError && <p className="text-red-500 text-sm mt-2">❌ Error creating post.</p>}
        </form>
    );
};
