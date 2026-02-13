import schoolsJson from "./schools.json";
import * as z from "zod/v4";

const schoolsRuntype = z.array(
  z.object({
    id: z.int(),
    name: z.string(),
    buildings: z.array(
      z.object({
        relocated: z.boolean(),
        street: z.string(),
        postcode: z.string(),
        community: z.string(),
        community_key: z.string(),
        community_part: z.string(),
        community_part_key: z.string(),
        longitude: z.number(),
        latitude: z.number(),
      }),
    ),
  }),
);

export type School = z.TypeOf<typeof schoolsRuntype>[number];
export const schools = schoolsRuntype.parse(schoolsJson);
