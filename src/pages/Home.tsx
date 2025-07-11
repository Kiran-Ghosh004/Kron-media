import { PostList } from "../components/PostList";

export const Home = () => {
  return (
    <div className="pt-4">
      <h2 className=" text-3xl md:text-5xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
        Recent Posts
      </h2>
      <div>
        <PostList />
      </div>
    </div>
  );
};