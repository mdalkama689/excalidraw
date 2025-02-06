interface ToastProps {
    type: string,
    text: string
}

export const Toast = ({type, text}: ToastProps) => {
    let svg = null;

    if (type === "loading") {
      svg = (
        <svg
          className="w-5 h-5 animate-spin text-gray-500 dark:text-gray-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
          ></path>
        </svg>
      );
    }
    if (type === "success") {
      svg = (
        <svg
          className="w-5 h-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
        </svg>
      );
    }
  
    if (type === "error") {
      svg = (
        <svg
          className="w-5 h-5 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M10 0.5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.536 12.036a1 1 0 0 1-1.414 1.414L10 11.414l-2.122 2.122a1 1 0 0 1-1.414-1.414L8.586 10 6.464 7.878a1 1 0 0 1 1.414-1.414L10 8.586l2.122-2.122a1 1 0 0 1 1.414 1.414L11.414 10Z" />
        </svg>
      );
    }

    return (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 flex items-center w-full max-w-xs p-4 text-gray-500 bg-white rounded-lg shadow-lg dark:text-gray-400 dark:bg-gray-800">
      <div
        className={`inline-flex items-center justify-center shrink-0 w-8 h-8  text-green-600 bg-green-100 rounded-lg ${type === "error" ? "dark:bg-red-800 " : "dark:bg-green-900"} dark:text-green-200`}
      >
       
        {svg}
      </div>

      <div className="ms-3 text-sm font-normal text-white">{text}</div>
    </div>
    )
}