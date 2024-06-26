import PropTypes from "prop-types";
import {IoClose} from "react-icons/io5";

export const PopUp = ({ setOpen, children }) => {
  return (
    <div className="fixed inset-0 z-[80] overflow-x-hidden overflow-y-auto flex items-center justify-center px-6 sm:px-0">
      <div className="fixed inset-0 bg-black opacity-70 h-full min-h-screen" />
      <div className="opacity-100 ease-out transition-all w-full max-w-sm mx-auto">
        <div className="relative flex flex-col bg-white shadow-lg rounded-xl dark:bg-neutral-900">
          <div className="absolute top-2 right-2">
            <button
              type="button"
              className="flex justify-center items-center size-7 text-sm font-semibold rounded-lg border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:border-transparent dark:hover:bg-neutral-700"
              onClick={() => {
                setOpen(false);
              }}
            >
              <span className="sr-only">Close</span>
              <IoClose className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 text-center overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

PopUp.propTypes = {
  setOpen: PropTypes.func.isRequired,
  children: PropTypes.node,
};
