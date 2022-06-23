import { z } from "zod";

export const sexEnum = z.enum(["Male", "Female", "None"]);
export type SexEnum = z.infer<typeof sexEnum>;

export const typeEnum = z.enum(["P", "ID"]);
export type TypeEnum = z.infer<typeof typeEnum>;

export const codeOfIssuingStateEnum = z.enum(["ISR", "RUS", "GBR", "unknown"]);
export type CodeOfIssuingStateEnum = z.infer<typeof codeOfIssuingStateEnum>;