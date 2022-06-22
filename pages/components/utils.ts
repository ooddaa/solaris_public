import { z } from 'zod'

/**
 * Returns array of optional schema keys.
 * Was going to use to adjust schemas to Mango prop case conventions (SNAKE_CASE for required props)
 * @param objectSchema 
 * @returns {string[]}
 */
export function optionalKeys<Schema extends z.SomeZodObject>(
  objectSchema: Schema
): string[] {
  return Object.entries(objectSchema.shape).reduce(
    (acc: string[], [key, value]) => {
      if (value.isOptional()) {
        return [...acc, key];
      }
      return acc;
    },
    []
  );
}