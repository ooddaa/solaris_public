
import { z } from "zod";
import { sexEnum } from './enums'

/**
 * There are two layers of "required props" expressed via schema. 
 * 1. Neo4j level.
 *    SNAKE_CASED   - "a required prop" which will be used to uniquely identify the NaturalPerson in Neo4j.
 *                    We can have > 1 of required props, makes a Node constrained on set of its keys.
 *    camelCased    - "an optional prop" - this does not affect the 'uniquness' of NaturalPerson in Neo4j.
 * 
 * 2. Zod level. 
 *    The usual API to implement the form validation. 
 * 
 * @example
 * [Neo4j, Zod] 
 * [required, required]
 * [optional, required]
 * [optional, optional]
 * 
 * note that [required, optional] is not possible as we want to guarantee that users is required to 
 * supply data that is required to make Neo4j NaturalPerson a unique entity.
 *
 */
// export const NaturalPersonSchema = z.object({
//   /* person specific - wont */ 
//   FIRST_NAME: z.string().min(1).max(20).default('SpongeBob'),  // required to complete Passport, but not unique identifier of a Passport in Neo4j
//   LAST_NAME: z.string().min(1).max(20).default('SquarePants'),
//   otherNames: z.string().min(1).max(20).optional().default("many"),
//   previousNames: z.string().min(1).max(50).optional().default("none"),
//   SEX: sexEnum.default('Male'),
//   PLACE_OF_BIRTH: z.string().min(1).max(20).default("sea"),
//   DATE_OF_BIRTH: z.string().min(10).max(10).default("2000-01-01"),//.regex(/[d]*4-[d]*2-[d]*2/),
//   CURRENT_ADDRESS: z.string().min(1).max(100).default("bottom of the sea"),
//   otherProps: z.string().max(20).optional().default('has friends'),
// });
export const NaturalPersonSchema = z.object({
  /* person specific - wont */ 
  FIRST_NAME: z.string().max(20),  // required to complete Passport, but not unique identifier of a Passport in Neo4j
  LAST_NAME: z.string().max(20),
  otherNames: z.string().max(20).optional(),
  previousNames: z.string().max(50).optional(),
  SEX: sexEnum,
  PLACE_OF_BIRTH: z.string().max(20),
  DATE_OF_BIRTH: z.string().max(20),//.regex(/[d]*4-[d]*2-[d]*2/),
  CURRENT_ADDRESS: z.string().max(100),
  otherProps: z.string().max(20).optional(),
});

export type NaturalPersonProps = z.infer<typeof NaturalPersonSchema>;