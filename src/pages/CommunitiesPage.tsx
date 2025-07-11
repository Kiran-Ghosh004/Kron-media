import { CommunityList } from "../components/CommunityList";


export const CommunitiesPage = () => {
  return (
    <div className="pt-14">
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
  Communities
</h2>
      
        <p className="text-center text-gray-400 mb-8">Explore and join communities that match your interests.</p>
      <CommunityList />
    </div>
  );
};
