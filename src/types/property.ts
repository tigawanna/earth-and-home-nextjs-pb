import type { PropertiesResponse, UsersResponse } from "@/types/domain-types";

export type TProperties = PropertiesResponse & {
  expand: {
    owner_id?: UsersResponse[];
    agent_id?: UsersResponse[];
  };
};
