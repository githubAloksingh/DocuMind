import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Sparkles, Zap, CheckCircle, Upload, Scissors, BookOpen } from "lucide-react";

export function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center flex-1 px-6 py-20 relative overflow-hidden bg-gradient-to-br from-yellow-100 via-orange-100 to-yellow-50">
        {/* Soft Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,200,100,0.25),transparent_60%)]" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10"
        >
          {/* Logo Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-white/50 backdrop-blur-lg rounded-2xl flex items-center justify-center shadow-lg">
              <FileText className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 text-gray-800 leading-tight">
            Summarize Smarter, <br />
            <span className="text-orange-500">Save Hours Instantly ⚡</span>
          </h1>

          <p className="text-lg sm:text-xl mb-10 max-w-2xl mx-auto text-gray-600 leading-relaxed">
            Upload resumes, research papers, or any long documents and let AI
            craft clear, concise summaries — short, medium, or long.  
            <span className="font-semibold"> All in seconds.</span>
          </p>

          <Link
            to="/summarizer"
            className="inline-block px-8 py-4 rounded-2xl bg-orange-500 text-white text-lg font-bold shadow-lg hover:scale-105 hover:bg-orange-600 transition-transform duration-300"
          >
            🚀 Get Started
          </Link>
        </motion.div>
      </div>

      {/* Why Choose Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="bg-white rounded-t-3xl shadow-xl py-16 px-6 sm:px-12 lg:px-20 text-gray-800"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
          Why Choose <span className="text-orange-500">DocuMind</span> ?
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 bg-orange-50 rounded-2xl shadow-md hover:shadow-lg transition">
            <Sparkles className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">AI-Powered Precision</h3>
            <p className="text-gray-600">
              Get summaries that are accurate, clear, and perfectly structured.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-orange-50 rounded-2xl shadow-md hover:shadow-lg transition">
            <Zap className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
            <p className="text-gray-600">
              Upload your document and receive results within seconds.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-orange-50 rounded-2xl shadow-md hover:shadow-lg transition">
            <CheckCircle className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">Flexible Output</h3>
            <p className="text-gray-600">
              Short, medium, or long — you’re in control of the summary length.
            </p>
          </div>
        </div>
      </motion.div>

      {/* How It Works Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-50 py-20 px-6 sm:px-12 lg:px-20 text-gray-800"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12">
          How It Works
        </h2>

        <div className="grid gap-10 sm:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <Upload className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">1. Upload</h3>
            <p className="text-gray-600">
              Drop your resume, research paper, or document securely.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <Scissors className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">2. Summarize</h3>
            <p className="text-gray-600">
              Choose summary length — short, medium, or long.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition">
            <BookOpen className="w-10 h-10 text-orange-500 mb-4" />
            <h3 className="text-xl font-bold mb-2">3. Review</h3>
            <p className="text-gray-600">
              Get a crystal-clear summary ready to use instantly.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
