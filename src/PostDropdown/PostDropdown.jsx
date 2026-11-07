import { useContext } from "react";
import {
    MenuTrigger,
    Button,
    Popover,
    Menu,
    MenuItem,
    MenuSection,
} from "react-aria-components";
import { AuthContext } from "../Components/Context/AuthCotext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function DropdownMenu({ postUserID, postId}) {

   const { userID } = useContext(AuthContext);


    const handleAction = (key) => {
        console.log("Selected:", key);
    };

    // Only render the dropdown if this is the logged-in user's post
    if (userID !== postUserID) return null;

    function deletePost() {
    return axios.delete(
        `https://route-posts.routemisr.com/posts/${postId}`,
        {
        headers: {Authorization: `Bearer ${localStorage.getItem("userToken")}`}
        }
    );
    }

    const query = useQueryClient()

    const {isPending, mutate} = useMutation({
        mutationFn : deletePost,

        onSuccess: ()=>{
        query.invalidateQueries(["getAllPosts"])

        toast.success("Post Deleted Successfully",
        {
        closeOnClick : true,
        position : "top-center",
        draggable : false,
        autoClose: 3000,
        }
        )},

        onError: ()=>{toast.error("Failed to Delete Post",
            {
            closeOnClick : true,
            position : "top-center",
            draggable : false,
            autoClose: 3000,
            }
        )},

        onSettled: ()=>{}
    })

    return (
        <MenuTrigger>
            {/* Dropdown trigger */}
            <Button
                aria-label="More options"
                className="rounded-md px-3 py-1 text-xl hover:bg-gray-200 cursor-pointer"
            >
                ⋮
            </Button>

            {/* Main dropdown */}
            <Popover className="w-52 rounded-lg bg-white p-1 shadow-lg">
                <Menu
                    onAction={handleAction}
                    className="outline-none"
                >

                    <MenuSection aria-label="Editing actions">

                        <MenuItem
                            id="edit"
                            className="cursor-pointer rounded-md px-3 py-2 text-sm hover:bg-gray-200"
                        >
                            Edit
                        </MenuItem>

                        <MenuItem
                        id="delete"
                        isDisabled={isPending}
                        onAction={() => mutate()}
                        className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-200"
                        >
                        Delete
                        </MenuItem>

                    </MenuSection>

                </Menu>
            </Popover>

        </MenuTrigger>
    );
}