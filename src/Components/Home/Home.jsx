
import axios from "axios";
import { useContext, useState } from "react";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import defaultPFP from "../../assets/defaultPFP.svg";
import like from "../../assets/heart-unclicked.svg";
import comment from "../../assets/comment.svg";
import share from "../../assets/share.svg";
import save from "../../assets/saved-icon.svg";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import DropdownMenu from "../../PostDropdown/PostDropdown";
import CreatePost from "../../CreatePost/CreatePost";
import CreateComment from "../../CreateComment/createComment";



export default function Home() {
  // const [allPosts, setAllPosts] = useState([]);
  const [openComments, setOpenComments] = useState({});
  const [postComments, setPostComments] = useState({});
  const [loadingComments, setLoadingComments] = useState({});
  const [commentsErrors, setCommentsErrors] = useState({});


  // we don't need states because that's the job of TanStack

  // Get all posts
  // useEffect(() => { // we're reloading posts EVERY TIME the home page renders, which is not optimal because sometimes we already have the data. We'll deal with that later in state management.

  function getAllPosts() {
    return axios.get(
      "https://route-posts.routemisr.com/posts",
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`
        }
      }
    );
  }

  const {
    data,
    isLoading,
    isFetching,
    isError /* is there an error? */,
    error /* the actual value of the error */
  } = useQuery({
    queryKey: ["getAllPosts"], // this is an array of posts, this renders every time the homepage is rendered, BUT, it checks the array of posts, if it's the same array, cache it, if even one post is added/deleted, rerender.

    queryFn: getAllPosts, // we call the API function but we don't manually handle the errors inside of it. Just the API reponse promise.
  });

  console.log("data", data?.data.data.posts);
  console.log("isLoading", isLoading);
  console.log("isFetching", isFetching);
  console.log("isError", isError);

  // getAllPosts();
  // }, []);

  // Get comments for a specific post
  async function getPostComments(postId) {
    try {
      const token = localStorage.getItem("userToken");

      setLoadingComments(prev => ({
        ...prev,
        [postId]: true,
      }));

      // Clear any previous error
      setCommentsErrors(prev => ({
        ...prev,
        [postId]: null,
      }));

      const response = await axios.get(
        `https://route-posts.routemisr.com/posts/${postId}/comments`,
        {
          params: { page: 1, limit: 5 },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Comments response:", response.data);

      const comments = response.data.data.comments || [];

      setPostComments(prev => ({
        ...prev,
        [postId]: comments,
      }));

    } catch (err) {
      console.log(
        "Couldn't fetch comments:",
        err.response?.data || err.message
      );

      setCommentsErrors(prev => ({
        ...prev,
        [postId]: err.response?.data?.message || "Couldn't load comments.",
      }));

    } finally {
      setLoadingComments(prev => ({
        ...prev,
        [postId]: false,
      }));
    }
  }

  // We don't need useForm here because CreateComment manages its own form using useState.
  // Each CreateComment component has its own input and submission logic.

  function handleCommentsClick(postId) {
    const isOpen = openComments[postId];

    setOpenComments(prev => ({
      ...prev,
      [postId]: !prev[postId],
    }));

    if (!isOpen && !Object.hasOwn(postComments, postId)) {
      getPostComments(postId);
    }
  }

  // This function runs after a comment is successfully created.
  // It refreshes the comments and the posts so the commentsCount gets updated.
  async function handleCommentCreated(postId) {
    // Automatically open the comments section
    setOpenComments(prev => ({
      ...prev,
      [postId]: true,
    }));

    // Fetch the updated comments for this post
    await getPostComments(postId);

    // Refresh posts so the commentsCount gets updated
    await queryClient.invalidateQueries({
      queryKey: ["getAllPosts"],
    });
  }

  // Access TanStack Query's cache
  const queryClient = useQueryClient();

  if (isError) {
    return (
      <div className="flex w-full min-h-screen justify-center items-center">
        <h1 className="text-red-600 text-3xl font-bold">
          {error?.message || "Something went wrong."}
        </h1>
      </div>
    );
  }

  if (isLoading) {
    // handling loading with a loading screen component
    return <LoadingScreen />;
  }

  return (
    <>
      <Helmet>
        <title>LinkUp | Home</title>
      </Helmet>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        <CreatePost />

        {data?.data.data.posts.map(post => {
          const postId = post.id || post._id;

          const postDate = new Date(
            post.createdAt
          ).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });

          return (
            <div
              key={postId}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
            >
              {/* Post header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 mb-1">
                <div className="flex items-center gap-3">
                  <img
                    src={post.user?.photo || defaultPFP}
                    alt={post.user?.name || "User profile"}
                    className="w-11 h-11 rounded-full object-cover border border-gray-200"
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

               <DropdownMenu 
               postUserID={post.user?._id}
               postId={post._id}
                />
              </div>

              {/* Post body */}
              <div className="px-4 pb-4">
                <p className="text-gray-800 text-base wrap-break-word">
                  {post.body}
                </p>
              </div>

              {/* Post image */}
              {post.image && (
                <img
                  src={post.image}
                  alt="Post attachment"
                  className="w-full max-h-125 object-cover"
                />
              )}

              {/* create comment */}
              {/* CreateComment handles its own form, input, and API request.
                  We pass postId so it knows which post to comment on.
                  onCommentCreated notifies Home after successful submission. */}
              <CreateComment
                postId={postId}
                onCommentCreated={() => handleCommentCreated(postId)}
              />

              {/* Post actions */}
              <div className="border-t border-gray-200 px-4 py-3 flex justify-between text-sm text-gray-500">
                <button
                  type="button"
                  className="hover:text-red-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <img className="w-4" src={like} alt="Like" />
                  {post.likesCount}
                </button>

                {/* comment button */}
                <button
                  type="button"
                  onClick={() => handleCommentsClick(postId)}
                  className="hover:text-blue-500 transition-colors flex items-center gap-1 cursor-pointer"
                  aria-expanded={!!openComments[postId]}
                >
                  <img className="w-4" src={comment} alt="Comments" />
                  {post.commentsCount}
                </button>

                <button
                  type="button"
                  className="hover:text-green-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <img className="w-4" src={share} alt="Share" />
                  {post.sharesCount}
                </button>

                {/* display comments */}
                <button
                  type="button"
                  className="hover:text-yellow-500 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <img className="w-4" src={save} alt="Save" />
                </button>
              </div>

              {openComments[postId] && (
                <div className="px-4 py-3 border-t border-gray-200">
                  {loadingComments[postId] ? (
                    <p className="text-sm text-gray-500">
                      Loading comments...
                    </p>
                  ) : commentsErrors[postId] ? (
                    <div>
                      <p className="text-sm text-red-500">
                        {commentsErrors[postId]}
                      </p>

                      <button
                        type="button"
                        onClick={() => getPostComments(postId)}
                        className="text-sm text-blue-600 hover:underline mt-1"
                      >
                        Try again
                      </button>
                    </div>
                  ) : postComments[postId]?.length > 0 ? (
                    postComments[postId].map(comment => (
                      <div
                        key={comment._id}
                        className="flex gap-2 mb-3"
                      >
                        <img
                          src={comment.commentCreator?.photo || defaultPFP}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover"
                        />

                        <div className="bg-gray-100 rounded-xl px-3 py-2">
                          <p className="font-semibold text-sm">
                            {comment.commentCreator?.name || "Unknown user"}
                          </p>

                          <p className="text-sm text-gray-700">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No comments yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </>
  );
}
