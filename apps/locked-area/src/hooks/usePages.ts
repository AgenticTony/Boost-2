import { useQuery } from "@tanstack/react-query";
import { client } from "../api/client";
import { GET_PAGES } from "../api/queries";

export const usePages = () => {
  return useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const result = await client.query(GET_PAGES, {}).toPromise();
      if (result.error) throw result.error;
      return result.data?.pages;
    },
  });
};
