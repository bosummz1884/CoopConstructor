import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CoopProvider } from "./contexts/CoopContext";
import Home from "@/pages/Home";
import Results from "@/pages/Results";
import NotFound from "@/pages/not-found";
import { queryClient } from "./lib/queryClient";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CoopProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/results" element={<Results />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </CoopProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
