import { Link } from "react-router";
import kron from "./../assets/kron.jpg";

export const PinnedPost = () => {
  return (
    <div className="relative group">
      <div className="absolute -inset-1 rounded-[20px] bg-gradient-to-r from-yellow-400 to-orange-500 blur-sm opacity-40 group-hover:opacity-60 transition duration-300 pointer-events-none"></div>

      <Link to="/intro" className="block relative z-10">
        <div className="w-80 h-76 bg-[rgb(24,27,32)] border border-yellow-400/40 rounded-[20px] text-white flex flex-col p-5 overflow-hidden transition-colors duration-300 group-hover:bg-gray-800">
          {/* Title */}
          <div className="flex flex-col">
            <div className="text-[20px] leading-[22px] font-semibold mt-2 text-yellow-300 text-center">
              Welcome to Kron.Media 🚀
            </div>
          </div>

          {/* Banner */}
          <div className="mt-2 flex-1">
            <img
              src={kron}
              alt="Kron Media Intro"
              className="w-full rounded-[20px] object-contain max-h-[150px] mx-auto bg-zinc-800"
            />
          </div>

          {/* Community label */}
          <div className="mt-2">
            <span className="text-sm text-yellow-400 font-semibold">
              📌 Pinned: App Introduction
            </span>
          </div>

          {/* Date */}
          <div className="mt-1">
            <span className="text-[14px] text-gray-400">
              Posted on:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};
