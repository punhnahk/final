import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-100 to-white-200 text-center">
      <img
        src="https://seosherpa.com/wp-content/uploads/2020/12/404-error-page-header-transparent.png" // Replace with your error image
        alt="Error illustration"
        className="w-80 h-auto mb-6 animate-bounce object-contain" // Updated for better fit
      />
      <h1 className="text-5xl font-extrabold text-red-500 mb-2">
        Oops! Something Went Wrong
      </h1>
      <p className="mt-2 text-lg text-gray-700 max-w-md">
        We're sorry, but it seems there was an unexpected error. Try going back
        or head to our homepage.
      </p>
      <button
        onClick={() => window.location.assign("/")}
        className="mt-8 px-6 py-3 text-lg font-medium text-white bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-300 ease-in-out"
      >
        Go to Homepage
      </button>
    </div>
  );
};

export default ErrorPage;
