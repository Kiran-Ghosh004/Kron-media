export const Intro = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 text-white">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-4">
        Welcome to Kron.Media 🚀
      </h1>

      <p className="text-lg text-gray-300 mb-6">
        Kron.Media is a modern social media platform built for communities,
        creators, and conversation. Whether you want to share your thoughts,
        join discussions, or create your own community, Kron.Media gives you
        the tools and space to do so — beautifully and seamlessly.
      </p>

      <h2 className="text-2xl font-bold text-orange-400 mb-2">👨‍💻 Creator</h2>

<p className="text-gray-300 mb-4">
  This app was crafted by{" "}
  <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold">
    Kiran Ghosh
  </span>, a developer passionate about building meaningful web experiences. connect with the developer on LinkedIn to see more of my work and projects.
</p>

{/* LinkedIn Button */}
<div className="mt-2 mb-6">
  <a
    href="https://www.linkedin.com/in/kiran-ghosh-0b56632a1/"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
  >
    🔗 LinkedIn
  </a>
</div>


      <h2 className="text-2xl font-bold text-orange-400 mb-2">👨‍💻 Creator</h2>
      <p className="text-gray-300 mb-6">
        This app was crafted by{" "}
        <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent font-semibold">
          Kiran Ghosh
        </span>
        , a developer passionate about building meaningful web experiences.
      </p>

      <h2 className="text-2xl font-bold text-orange-400 mb-2">🎁 Special Note</h2>
      <p className="text-gray-300">
        The person who interacts the most on Kron.Media will receive{" "}
        <span className="text-yellow-300 font-semibold">
          the full source code of this app for free
        </span>{" "}
        — exclusively for students.
      </p>

      <div className="mt-6 text-sm text-gray-500">
        🔗 Want to go back?{" "}
        <a href="/" className="text-purple-400 hover:underline">
          Return to Home
        </a>
      </div>

      {/* LinkedIn Button */}
      
    </div>
  );
};
