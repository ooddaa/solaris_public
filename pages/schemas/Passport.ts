
import { z } from "zod";
import { sexEnum, typeEnum, codeOfIssuingStateEnum } from './enums'

/**
 * There are two layers of "required props" expressed via schema. 
 * 1. Neo4j level.
 *    SNAKE_CASED   - "a required prop" which will be used to uniquely identify the Passport in Neo4j.
 *                    We can have > 1 of required props, makes a Node constrained on set of its keys.
 *    camelCased    - "an optional prop" - this does not affect the 'uniquness' of Passport in Neo4j.
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
 * supply data that is required to make Neo4j Passport a unique entity.
 * 
 * We could just request one required prop - PASSPORT_NUMBER, but in terms of business domain usage, 
 * it's never enough just to know the passport number, dates of issue/expiry, authority are always 
 * asked for.
 */
export const PassportSchema = z.object({
  /* document specific */
  TYPE: typeEnum,
  CODE_OF_ISSUING_STATE: codeOfIssuingStateEnum, // list of state codes
  PASSPORT_NUMBER: z.string().max(20),
  idNumber: z.string().max(20).optional(), // Israeli passport
  nationality: z.string().max(20),
  DATE_ISSUED: z.string(),
  DATE_EXPIRES: z.string(),
  ISSUING_AUTHORITY: z.string().max(20),
  
  /* person specific - wont */ 
  firstName: z.string().max(20),  // required to complete Passport, but not unique identifier of a Passport in Neo4j
  lastName: z.string().max(20),
  otherNames: z.string().max(20).optional(),
  sex: sexEnum,
  placeOfBirth: z.string().max(20),
  dateOfBirth: z.string(),
  otherProps: z.string().max(20).optional(),
});

export type PassportProps = z.infer<typeof PassportSchema>;