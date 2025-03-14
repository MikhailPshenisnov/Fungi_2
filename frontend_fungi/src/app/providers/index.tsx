import { IWithProviderProps } from "./types";
import { WithQueryClient } from "./with-query-client";
import { WithRouter } from "./with-router";

export const Providers: React.FC<IWithProviderProps> = ({ children }) => {
  return (
    <WithRouter>
      <WithQueryClient>{children}</WithQueryClient>
    </WithRouter>
  );
};
