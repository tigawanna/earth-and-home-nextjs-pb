import { AgentsResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";

interface SingleAgentDetailsProps {
  agent: AgentsResponse & {
    expand?:
      | {
          user_id?: UsersResponse | undefined;
        }
      | undefined;
  };
}

export function SingleAgentDetails({ agent }: SingleAgentDetailsProps) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
        SingleAgentDetails
    </div>
  );
}
