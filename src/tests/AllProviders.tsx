import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CartProvider } from "../providers/CartProvider";
import { Theme } from "@radix-ui/themes";

const AllProviders = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false
        }
      }
    });

    return(
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Theme>
            { children}
          </Theme>
        </CartProvider>
      </QueryClientProvider>
    );
}

export default AllProviders;