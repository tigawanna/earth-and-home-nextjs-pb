import { PropertiesResponse, UsersResponse } from "@/lib/pocketbase/types/pb-types";

export type TProperties = PropertiesResponse & {
  expand:{
    owner_id?: UsersResponse[];
    agent_id?: UsersResponse[];
  }
}
