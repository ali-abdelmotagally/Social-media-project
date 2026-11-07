
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import attachment from '../assets/attachment.svg';



export default function CreateComment({ postId, onCommentCreated }) {

    const [commentContent, setCommentContent] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState('');

    // Clean up image preview URL when it changes or component unmounts
    useEffect(() => {
        if (!imagePreview) return;

        return () => {
            URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    // Send the comment to the API
    function createComment() {
        const formData = new FormData();

        formData.append('content', commentContent.trim());

        // Only append image if the user selected one
        if (imageFile) {
            formData.append('image', imageFile);
        }

        return axios.post( // we must write "return" to let tanstack know we're returning a promise.
            `https://route-posts.routemisr.com/posts/${postId}/comments`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("userToken")}`
                }
            }
        );
    }

    const {
        mutate,
        isPending,
        isError,
        error
    } = useMutation({
        mutationFn: createComment,

        onSuccess: () => {
            setCommentContent('');
            setImageFile(null);
            setImagePreview('');
            onCommentCreated?.();
        }
    });

    // Handle image selection
    function handleImageChange(e) {
        const file = e.target.files[0];

        if (!file) return;

        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));

        // Allow selecting the same image again after removing it
        e.target.value = '';
    }

    // Handle form submission
    function handleSubmit(e) {
        e.preventDefault();

        // Allow either text or an image
        if (!commentContent.trim() && !imageFile) return;

        if (isPending) return;

        mutate();
    }

    // Remove selected image
    function removeImage() {
        setImageFile(null);
        setImagePreview('');
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="border-t border-gray-200 px-3 py-3"
        >

            <div className="flex items-center gap-2">

                <input
                    type="text"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    placeholder="Write something..."
                    disabled={isPending}
                    className="px-4 w-full focus:outline-none"
                />

                {/* Image attachment */}
                <label className="cursor-pointer hover:opacity-70 transition-opacity">
                    <img
                        src={attachment}
                        alt="Attach image"
                        className="w-5 h-5"
                    />

                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isPending}
                        className="hidden"
                    />
                </label>

                <button
                    type="submit"
                    disabled={isPending || (!commentContent.trim() && !imageFile)}
                    className="cursor-pointer px-2 py-0.5 bg-black rounded-md text-white hover:bg-black/80 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isPending ? "Adding..." : "Add"}
                </button>

            </div>

            {/* Image preview */}
            {imagePreview && (
                <div className="mt-3 relative w-fit">

                    <img
                        src={imagePreview}
                        alt="Comment preview"
                        className="max-w-40 max-h-40 object-cover rounded-lg"
                    />

                    <button
                        type="button"
                        onClick={removeImage}
                        disabled={isPending}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6"
                    >
                        ×
                    </button>

                </div>
            )}

            {/* Error message */}
            {isError && (
                <p className="text-red-500 text-xs mt-2">
                    {error?.response?.data?.message || "Failed to add comment"}
                </p>
            )}

        </form>
    );
}
