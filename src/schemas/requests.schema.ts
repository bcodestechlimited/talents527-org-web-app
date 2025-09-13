import * as z from "zod";

export const newRequestSchema = z
  .object({
    title: z.string().min(1, { message: "Title is required" }),
    candidateRole: z.string().min(1, { message: "Candidate role is required" }),
    requestRequirements: z
      .string()
      .min(1, { message: "Request requirements is required" }),
    employmentType: z.enum(["full-time", "part-time", "contract"], {
      message: "Employment type is required",
    }),
    workSchedule: z.enum(["office-hours", "shifts"], {
      message: "Work schedule is required",
    }),
    resumptionTime: z.string().optional(),
    closingTime: z.string().optional(),
    startDate: z.date({ message: "Start date is required" }),
    endDate: z.date().optional(),
    workHours: z.string().optional(),
    workDays: z.string().min(1, { message: "Work days is required" }),
    workSiteAddress: z.string().optional(),
    modeOfWork: z.enum(["on-site", "remote", "hybrid"], {
      message: "Mode of work is required",
    }),
    language: z.string().optional(),
    genderPreference: z.enum(["no-preference", "male", "female"]).optional(),
    specialNote: z.string().optional(),
    documents: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      if (data.employmentType === "contract") {
        return data.endDate !== undefined;
      }
      return true;
    },
    {
      message: "End date is required for contract positions",
      path: ["endDate"],
    }
  )
  .refine(
    (data) => {
      if (data.workSchedule === "office-hours") {
        return (
          data.resumptionTime !== undefined &&
          data.resumptionTime.length > 0 &&
          data.closingTime !== undefined &&
          data.closingTime.length > 0
        );
      }
      return true;
    },
    {
      message: "Resumption time and closing time are required for office hours",
      path: ["resumptionTime"],
    }
  )
  .refine(
    (data) => {
      if (data.workSchedule === "shifts") {
        return data.workHours !== undefined && data.workHours.length > 0;
      }
      return true;
    },
    {
      message: "Work hours is required for shifts",
      path: ["workHours"],
    }
  );

export type NewRequestSchemaData = z.infer<typeof newRequestSchema>;
