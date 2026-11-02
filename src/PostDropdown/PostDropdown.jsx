import {
    MenuTrigger,
    Button,
    Popover,
    Menu,
    MenuItem,
    MenuSection,
} from "react-aria-components";

export default function DropdownMenu() {
    const handleAction = (key) => {
        console.log("Selected:", key);
    };

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