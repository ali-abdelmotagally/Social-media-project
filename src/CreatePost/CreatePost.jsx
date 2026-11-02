import React, { useState } from 'react'
import defaultPFP from '../assets/defaultPFP.svg'
import attachment from '../assets/attachment.svg'

export default function CreatePost() {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [postContent, setPostContent] = useState('')

    function handlePost() {
        if (!postContent.trim()) return

        console.log(postContent)

        setPostContent('')
        setIsModalOpen(false)
    }

    return (
        <>
            {/* Create Post Input */}
            <div
                className="w-full bg-white/80 rounded-lg border border-gray-200 shadow-sm p-4 flex justify-between items-center"
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
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                                placeholder="What's on your mind?"
                                rows={5}
                                autoFocus
                                className="w-full resize-none outline-none text-lg p-2"
                            />

                            <label htmlFor="file-input">
                                <input
                                    type="file"
                                    id="file-input"
                                    className="hidden"
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
                                onClick={handlePost}
                                disabled={!postContent.trim()}
                                className="cursor-pointer bg-black text-white px-6 py-2 rounded-lg hover:bg-black/80 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                Post
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}