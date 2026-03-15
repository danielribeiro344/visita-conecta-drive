import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

const GlobalLoadingBar = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isActive = isFetching + isMutating > 0;

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute left-0 right-0 top-0 z-50"
        >
          <div className="h-0.5 w-full bg-gradient-to-r from-primary/20 via-primary/70 to-secondary/60 animate-pulse" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalLoadingBar;
