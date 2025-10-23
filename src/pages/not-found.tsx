import { useNavigate } from "react-router";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <div className="relative mb-8">
          <h1 className="text-[180px] md:text-[240px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-900 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-full shadow-lg flex items-center justify-center animate-pulse">
              <Search className="w-16 h-16 md:w-20 md:h-20 text-indigo-900" />
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Oops! The page you're looking for seems to have wandered off. Let's
            get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-900 rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-indigo-200"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>

          <button
            onClick={() => navigate("/")}
            className="group inline-flex items-center gap-2 px-6 py-3 bg-indigo-900 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-800"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto opacity-40">
          <div className="h-2 bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full animate-pulse"></div>
          <div className="h-2 bg-gradient-to-r from-indigo-500 to-indigo-700 rounded-full animate-pulse delay-75"></div>
          <div className="h-2 bg-gradient-to-r from-indigo-600 to-indigo-900 rounded-full animate-pulse delay-150"></div>
        </div>
      </div>
    </div>
  );
}
