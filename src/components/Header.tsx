import React from "react";
import { FileText } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();

  const isSummarizerPage = location.pathname === "/summarizer";

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo + Title */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform duration-300">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-white tracking-wide">
                Document<span className="text-yellow-200">Summary Assistant</span>
              </h1>
              <p className="text-sm text-orange-100">AI-powered document insights</p>
            </div>
          </div>

          {/* Navigation / CTA */}
          <div className="flex items-center space-x-6">
            {!isSummarizerPage ? (
              <button
                onClick={() => navigate("/summarizer")}
                className="hidden sm:block px-5 py-2 rounded-full bg-white text-orange-600 font-semibold shadow-md hover:bg-orange-50 transition"
              >
                Summarize Now
              </button>
            ) : (
              <button
                onClick={() => navigate("/")}
                className="hidden sm:block px-5 py-2 rounded-full bg-white text-orange-600 font-semibold shadow-md hover:bg-orange-50 transition"
              >
                Home
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
