import { QueryProvider } from "./providers/QueryProvider";
import { RouterProvider } from "./providers/RouterProvider";

export const App = () => (
  <QueryProvider>
    <RouterProvider />
  </QueryProvider>
);
