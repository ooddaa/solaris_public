// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { log, getRequiredProperties } from "mango";
import { mango }  from '../db/neoj4Config'

type Result = {
  success: boolean
  data: any
}

type SimplifiedNode = {
  labels: string[],
  properties: Object,
}

type SimplifiedRelationship = {
  labels: string[],
  properties?: Object,
  necessity?: "required" | "optional",
  direction?: "outbound" | ">" | "inbound" | "<",
  partnerNode: SimplifiedNode, 
}

/*
 * Once sent to /api/addNaturalPerson it's transformed into EnhancedNode and saved as
 * (NaturalPerson { ...props })-[:HAS_ATTR]->(Attribute { KEY: "FIRST_NAME", VALUE: "Whatever" })
 * where each 'required' prop gets extracted to become an (Attribute) Node. 
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result>
) {
  /* store in Neo4j */
  try {
    const naturalPerson = req.body

    /* Enhance */
    // log(naturalPerson)
    const requiredProps: Object = getRequiredProperties(naturalPerson)
    // log(requiredProps)

    const relationships = Object.entries(requiredProps)
      .reduce((acc, [KEY, VALUE]) => {
        return [...acc, {
          labels: ["HAS_ATTRIBUTE"],
          partnerNode: {
            labels: ["ATTRIBUTE"],
            properties: { KEY, VALUE },
          },
        }]
    }, [] as SimplifiedRelationship[])

    let rv = await mango.buildAndMergeEnhancedNode({
      labels: ["NaturalPerson"], 
      properties: naturalPerson,
      relationships
    })

    /* how do I know which ones are required? */
    log(rv)
    res.status(200).json({ success: true, data: rv })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, data: [] })
  }
}