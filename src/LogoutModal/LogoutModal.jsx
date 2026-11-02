

import React from "react";

export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm">

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        className="w-80 mx-4 text-center bg-white shadow-2xl rounded-xl p-6"
      >
        <h2 id="logout-title" className="text-lg font-bold">
          Log out?
        </h2>

        <p className="text-gray-600 mt-2">
          Are you sure you want to log out?
        </p>

        <div className="flex gap-4 justify-center mt-5">

          <button
            onClick={onConfirm}
            className="bg-red-400 px-4 py-2 rounded-md cursor-pointer shadow-md hover:bg-red-600 hover:text-white transition-colors duration-200"
          >
            Yes
          </button>

          <button
            onClick={onCancel}
            className="bg-blue-300 px-4 py-2 rounded-md cursor-pointer shadow-md hover:bg-blue-400 hover:text-white transition-colors duration-200"
          >
            Cancel
          </button>

        </div>
      </div>

    </div>
    
  );
}