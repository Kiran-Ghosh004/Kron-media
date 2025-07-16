import { Routes, Route } from "react-router";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostPage } from "./pages/PostPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { Intro } from "./components/Intro";


function App() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-grey-100 transition-opacity duration-300 pt-16">
      <Navbar />
      
      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/community/create" element={<CreateCommunityPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
          <Route path="/intro" element={<Intro/>}/>
          
        </Routes>
      </div>

      {/* Sticky Footer */}
      <footer className="text-gray-400 py-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} Kron.Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
