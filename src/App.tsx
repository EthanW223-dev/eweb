import { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { DottedSurface } from "@/components/ui/dotted-surface";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { PageLoader } from "@/components/site/page-loader";

const HomePage = lazy(() => import("@/pages/home"));
const ServicesPage = lazy(() => import("@/pages/services"));
const WorkPage = lazy(() => import("@/pages/work"));
const PricingPage = lazy(() => import("@/pages/pricing"));
const ContactPage = lazy(() => import("@/pages/contact"));
const AboutPage = lazy(() => import("@/pages/about"));
const NotFoundPage = lazy(() => import("@/pages/not-found"));

const pageVariants = {
  initial: { opacity: 0, y: 18, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -18, filter: "blur(8px)" },
};

function AnimatedRoutes() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // On every route change: scroll to top and briefly show a loader.
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key={`loader-${location.pathname}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <PageLoader />
        </motion.div>
      ) : (
        <motion.div
          key={location.pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/work" element={<WorkPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <div className="relative isolate min-h-screen overflow-x-hidden bg-background">
      {/* Animated dotted surface background — full strength, like the reference */}
      <DottedSurface className="z-0" />

      {/* Very subtle bottom scrim only, so the dots stay crisp but the footer text stays readable */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-48 bg-gradient-to-t from-background/70 to-transparent"
      />

      {/* Foreground content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
    </div>
  );
}
