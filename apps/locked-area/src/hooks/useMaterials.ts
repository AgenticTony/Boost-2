import { useQuery } from "@tanstack/react-query";
import { client } from "../api/client";
import { GET_MATERIALS } from "../api/queries";

export const useMaterials = () => {
  return useQuery({
    queryKey: ["materials"],
    queryFn: async () => {
      const result = await client.query(GET_MATERIALS, {}).toPromise();
      if (result.error) throw result.error;
      return result.data?.materials;
    },
  });
};