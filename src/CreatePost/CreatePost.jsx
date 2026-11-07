import React, { useRef, useState } from 'react'
import defaultPFP from '../assets/defaultPFP.svg'
import attachment from '../assets/attachment.svg'
import axios from 'axios'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'


export default function CreatePost() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [postContent, setPostContent] = useState('')
    const [filePreview, setFilePreview] = useState(null)

    const textInput = useRef(null) //this hook lets us  select any element from the DOM, just not directly like JS, then allows us to save it in a variable.
    
    //it ALWAYS returns an object with prop "current" which has the value inside it (right now null)

    const imgInput =useRef(null)
    const query = useQueryClient()
    
    // function handlePost() {
    //     if (!postContent.trim() && !filePreview) return //if no text AND no image are entered, don't allow.
        
    //     // console.log(postContent)
        
    //     setPostContent('')
    //     setIsModalOpen(false)
    // }

    function handlePreview(e) {
    const file = e.target.files[0];

    if (!file) return;

    const path = URL.createObjectURL(file);
    setFilePreview(path);
    }


    function handleRemovePreview(){
        setFilePreview(null)
        imgInput.current.value = ""
    }
    
    // prepare the data that goes into the post:
    function prepareData() {
    const formData = new FormData();

    formData.append("body", postContent);

    if (imgInput.current.files[0]) {
        formData.append("image", imgInput.current.files[0]);
    }

    return formData;
    }

    function createPost(){
        return axios.post(`https://route-posts.routemisr.com/posts`, //api-url
        prepareData(), //the formData the backend requested
        { //auth
            headers : 
            {Authorization : `Bearer ${localStorage.getItem("userToken")}`}
        }
        )
    }

    const { data, isPending, mutate, isError, error } = useMutation({
    mutationFn: createPost,

    onSuccess: () => {
        query.invalidateQueries({queryKey : ['getAllPosts']})
        toast.success(
        "Post Created Successfully", 
        {
        closeOnClick : true,
        position : "top-center",
        draggable : false,
        autoClose: 3000,
        }
        )
        setPostContent('');
        setFilePreview(null);
        imgInput.current.value = '';
        setIsModalOpen(false);
    },

    });

    return (
        <>
            {/* Create Post Input */}
            <div
                className="w-full bg-white/80 rounded-lg border border-gray-200 shadow-sm p-4 flex gap-2 justify-between items-center"
            >
                <img
                    src={defaultPFP}
                    alt="Profile"
                    className="w-10 h-10 object-cover rounded-full cursor-pointer"
                />

                <input
                    readOnly
                    type="text"
                    placeholder="What's on your mind?"
                    onClick={() => setIsModalOpen(true)}
                    className="w-[75%] p-2 rounded-full border-2 border-gray-300 focus:outline-none focus:border-gray-600 "
                />

                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="bg-black text-white px-4 py-2 rounded-lg hover:bg-black/80 cursor-pointer"
                >
                    Post
                </button>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-2000 flex justify-center items-center bg-black/50 p-4"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white w-full max-w-xl rounded-xl shadow-xl p-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b pb-3 mb-4">
                            <h2 className="text-xl font-bold">
                                Create Post
                            </h2>
                        </div>

                        {/* User Info */}
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={defaultPFP}
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                            />

                            <span className="font-semibold">
                                Your Profile
                            </span>
                        </div>

                        {/* Post Input */}
                        <div className="relative">
                            <textarea
                                ref={textInput}
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="What's on your mind?"
                                rows={5}
                                autoFocus
                                className="w-full resize-none outline-none text-lg p-2"
                            />

                            {filePreview && (
                                <div className="pb-8 relative">

                                    <button 
                                    className='text-xl absolute right-2 top-2 w-8 h-8 rounded-full cursor-pointer text-white bg-black/20 backdrop-blur-lg'
                                    
                                    onClick={handleRemovePreview}
                                    >
                                    &times;
                                    </button>
                            
                            <img
                            src={filePreview}
                            alt="Selected attachment"
                            className="w-full max-h-80 object-contain"
                            />

                                </div>
                            )}

                            <label htmlFor="file-input">
                                <input
                                    ref={imgInput}
                                    type="file"
                                    id="file-input"
                                    className="hidden"
                                    onChange={handlePreview}
                                />
                                <img
                                    src={attachment}
                                    alt="Attachment"
                                    className="absolute right-3 bottom-1 w-4 h-4 cursor-pointer"
                                />
                            </label>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 border-t pt-4 mt-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setPostContent('')
                                    setIsModalOpen(false)
                                }}
                                className="cursor-pointer px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={()=> mutate()}
                                disabled={isPending || (!postContent.trim() && !filePreview)}
                                className="cursor-pointer bg-black text-white px-6 py-2 rounded-lg hover:bg-black/80 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                               {isPending ? "Posting..." : "Post"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}