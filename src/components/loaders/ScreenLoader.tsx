import { motion } from "framer-motion";

interface ScreenLoaderProps {
  title?: string;
  message?: string;
}

export const ScreenLoader = ({
  title = "Loading...",
  message = "Please wait while we prepare everything for you...",
}: ScreenLoaderProps) => {
  return (
    <div className="flex-2/3">
      <div className="max-w-md h-full mx-auto flex items-center justify-center w-full">
        <motion.div
          className="text-center space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>

          <div className="space-y-2">
            <motion.h2
              className="text-xl font-semibold text-gray-900"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {title}
            </motion.h2>
            <motion.p
              className="text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {message}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
