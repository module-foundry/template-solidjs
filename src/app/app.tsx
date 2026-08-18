import { Router } from "@solidjs/router";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";

import { routes } from "./router";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>{routes}</Router>
    </QueryClientProvider>
  );
};

export default App;
