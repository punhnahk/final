import React, { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen text-center">
          <img
            src="/path/to/error-image.png" // Add a fallback error image
            alt="Error illustration"
            className="w-64 h-64 mb-4"
          />
          <h1 className="text-4xl font-bold text-red-600">
            Something went wrong
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            We're working on it! Please try again later or go back to the
            homepage.
          </p>
          <button
            onClick={() => window.location.assign("/")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
