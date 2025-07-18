import { fetcher } from "../fetcher";

export const fetchYears = async () => {
  return fetcher(`/api/academic-years`);
};
