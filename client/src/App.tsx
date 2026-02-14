import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/HomePage";
import Landing from "@/pages/Landing";
import DriverPage from "@/pages/DriverPage";
import DispatchPage from "@/pages/DispatchPage";
import AboutUsPage from "@/pages/AboutUsPage";
import RedirectPage from "@/pages/RedirectPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/select" component={Landing} />
      <Route path="/driver" component={DriverPage} />
      <Route path="/dispatch" component={DispatchPage} />
      <Route path="/about-us" component={AboutUsPage} />
      <Route path="/features">{() => <RedirectPage to="/about-us" hash="features" />}</Route>
      <Route path="/pricing">{() => <RedirectPage to="/about-us" hash="pricing" />}</Route>
      <Route path="/contact">{() => <RedirectPage to="/about-us" hash="contact" />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
