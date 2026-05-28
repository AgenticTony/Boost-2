import { useQuery } from "@tanstack/react-query";
import { fetchTeamMembers } from "@/api/client";

export function useTeamMembers() {
  return useQuery({
    queryKey: ["teamMembers"],
    queryFn: fetchTeamMembers,
  });
}
