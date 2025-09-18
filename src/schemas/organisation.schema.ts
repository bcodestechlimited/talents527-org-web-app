import z from "zod";

export const userUpdateSchema = z.object({
  firstname: z.string().min(2, { message: "First name is required" }),
  lastname: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
});

export const buildOrgSchema = z.object({
  orgName: z.string().min(2, {
    message: "Org. name is required",
  }),
  role: z.string().min(2, {
    message: "Your role is required",
  }),
  website: z.string().url().min(2, "Website is required"),
  industry: z.string().min(2, "Industry is required"),
  orgSize: z.string().min(2, "Org. size is required"),
  orgType: z.string().min(2, "Org. type is required"),
});

export const aboutOrgSchema = z.object({
  aboutOrg: z.string().min(50, {
    message: "Description must be at least 50 characters.",
  }),
  location: z.object({
    country: z.string().min(1, { message: "Please select a country." }),
    state: z.string().min(1, { message: "Please enter a state." }),
    address: z.string().min(1, { message: "Please enter an address." }),
  }),
});

export const socialsOrgSchema = z.object({
  socials: z.object({
    facebook: z.string().url().optional().or(z.literal("")),
    twitter: z.string().url().optional().or(z.literal("")),
    linkedin: z.string().url().optional().or(z.literal("")),
    instagram: z.string().url().optional().or(z.literal("")),
    youtube: z.string().url().optional().or(z.literal("")),
  }),
});

export const orgSetupSchema = buildOrgSchema
  .merge(aboutOrgSchema)
  .merge(socialsOrgSchema);

export const updateProfileSchema = z.object({
  user: userUpdateSchema.partial(),
  organisation: orgSetupSchema.partial(),
});
