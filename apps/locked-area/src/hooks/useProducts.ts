import { useQuery } from "@tanstack/react-query";
import { client } from "../api/client";
import { GET_PRODUCTS } from "../api/queries";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const result = await client.query(GET_PRODUCTS, {}).toPromise();
      if (result.error) throw result.error;
      return result.data?.products;
    },
  });
};
