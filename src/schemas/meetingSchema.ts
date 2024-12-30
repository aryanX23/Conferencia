import { z } from "zod";

export const meetingSchema = z.object({
  meetingCapacity: z.enum(["P2P", "GROUP"]).default("P2P"),
  meetingDuration: z.number({
    invalid_type_error: "Meeting Duration must be a number"
  }).gte(0, { message: "Meeting Duration should be positive" })
    .default(0)
});
