import { addDays } from "date-fns";

export const generateDays = (count = 7) =>
  Array.from({ length: count }).map((_, i) => addDays(new Date(), i));
