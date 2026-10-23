import axios from "axios";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import defaultPFP from "../../assets/defaultPFP.svg";
import like from "../../assets/heart-unclicked.svg";
import comment from "../../assets/comment.svg";
import share from "../../assets/share.svg";
import save from "../../assets/saved-icon.svg";

export default function Home() {
  const [allPosts, setAllPosts] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {

    async function getAllPosts() {
      try {
        const token = localStorage.getItem("userToken");

        if (!token) {
          setError("You must log in first.");
          return;
        }

        const response = await axios.get(
          "https://route-posts.routemisr.com/posts",
          {
            params: {limit : 50},
            headers: {Authorization: `Bearer ${token}`},
          }
        );
        setAllPosts(response.data.data.posts || []);
      } catch (err) {
        console.log("Couldn't fetch data");

        setError(
          err.response?.data?.message || "Unable to load posts."
        );
      } finally {
        setIsLoading(false);
      }
    }

    getAllPosts();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex w-full min-h-screen justify-center items-center">
      <h1 className="text-red-600 text-3xl font-bold">
        {"Oops. Couldn't fetch data :("}
      </h1>
      </div>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {allPosts.map((post) => {
        const postDate = new Date(post.createdAt).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric",
          }
        );

        return (
          <div
            key={post.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
          >
            {/* Post header */}
            <div className="flex items-center justify-between p-4 border-b  border-gray-200 mb-1">
              <div className="flex items-center gap-3">
                <img src={post.user?.photo || defaultPFP} alt={post.user?.name || "User profile"} className="w-11 h-11 rounded-full object-cover border border-gray-200"
                />

                <div>
                  <h2 className="font-semibold text-gray-900">
                    {post.user?.name || "Unknown user"}
                  </h2>

                  <p className="text-xs text-gray-500">
                    @{post.user?.username || "user"} · {postDate}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="text-gray-500 text-xl hover:text-gray-900"
                aria-label="Post options"
              >
                ⋯
              </button>
            </div>

            {/* Post body */}
            <div className="px-4 pb-4">
              <p className="text-gray-800 text-base whitespace-pre-wrap">
                {post.body}
              </p>
            </div>

            {post.image && (
              <img
                src={post.image}
                alt="Post attachment"
                className="w-full max-h-125 object-cover"
              />
            )}

            {/* Post actions */}
            <div className="border-t border-gray-200 px-4 py-3 flex justify-between text-sm text-gray-500">
              <button
                type="button"
                className="hover:text-red-500 transition-colors flex gap-1"
              >
                <img className="w-4 cursor-pointer" src={like}></img> {post.likesCount}
              </button>

              <button
                type="button"
                className="hover:text-blue-500 transition-colors flex gap-1"
              >
                <img className="w-4 cursor-pointer" src={comment}></img> {post.commentsCount}
              </button>

              <button
                type="button"
                className="hover:text-green-500 transition-colors flex gap-1"
              >
                <img className="w-4 cursor-pointer" src={share}></img> {post.sharesCount}
              </button>

              <button
                type="button"
                className="hover:text-yellow-500 transition-colors flex gap-1"
              >
                <img className="w-4  cursor-pointer" src={save}></img>
              </button>
            </div>
          </div>
        );
      })}
    </main>
  );
}