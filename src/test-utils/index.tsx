import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render as RtlRender } from "@testing-library/react";
import { type PropsWithChildren, type ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";

// import { queryClientOptions } from "@/react-query/queryClient";

// ** FOR TESTING CUSTOM HOOKS ** //
// from https://tkdodo.eu/blog/testing-react-query#for-custom-hooks
export const createQueryClientWrapper = () => {
  const queryClient = generateQueryClient();
  return ({ children }: PropsWithChildren) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

// make a function to generate a unique query client for each test
const generateQueryClient = () => {
  // queryClientOptions.defaultOptions.queries.retry = false;
  // return new QueryClient(queryClientOptions);
  return new QueryClient();
};

// reference: https://testing-library.com/docs/react-testing-library/setup#custom-render
function customRender(ui: ReactElement, client?: QueryClient) {
  const queryClient = client ?? generateQueryClient();

  return RtlRender(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
}

// re-export everything
// eslint-disable-next-line react-refresh/only-export-components
export * from "@testing-library/react";

// override render method
export { customRender as render };
