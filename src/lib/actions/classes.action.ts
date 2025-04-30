import { fetcher } from "../fetcher";

export const fetchClasses = async () => {
  return fetcher(`/api/classes`, undefined, "force-cache");
};
