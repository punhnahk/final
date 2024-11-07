import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white p-4">
      <img
        src="https://static.vecteezy.com/system/resources/thumbnails/024/217/744/small_2x/design-template-for-web-page-with-404-error-isometric-page-not-working-error-png.png"
        alt="Page not found"
        className="w-64 md:w-80 mb-8"
      />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl md:text-2xl mb-6">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link to="/">
        <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition">
          Go back home
        </button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
