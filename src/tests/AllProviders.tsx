import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { CartProvider } from "../providers/CartProvider";
import { Theme } from "@radix-ui/themes";
import { LanguageProvider } from "../providers/language/LanguageProvider";

const AllProviders = ({ children }: PropsWithChildren) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <LanguageProvider language="en">
          <Theme>
            {children}
          </Theme>
        </LanguageProvider>
      </CartProvider>
    </QueryClientProvider>
  );
}

export default AllProviders;
