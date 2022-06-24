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
    const requiredProps: Object = getRequiredProperties(naturalPerson)

    /**
     * Version 1. Attributes are ideal. ie no copies. ie same dob is shared between twins. Place of birth is shared etc.
     */

    // const relationships = Object.entries(requiredProps)
    //   .reduce((acc, [KEY, VALUE]) => {
    //     return [...acc, {
    //       labels: ["HAS_ATTRIBUTE"],
    //       partnerNode: {
    //         labels: ["ATTRIBUTE"],
    //         properties: { KEY, VALUE },
    //       },
    //     }]
    // }, [] as SimplifiedRelationship[])

    // let rv = await mango.buildAndMergeEnhancedNode({
    //   labels: ["NaturalPerson"], 
    //   properties: naturalPerson,
    //   relationships
    // })

    /**
     * Version 2. Each Attribute belongs to only one owner.
     * Attributes are copied, by adding a uniqueProp - owner's _hash.
     * But for that we first need to build owner.
     */

    const owner = await mango.buildAndMergeNode(['NaturalPerson'], naturalPerson)

    /* do checks */
    if (!owner) return
    if (!owner.getHash()) throw new Error(`addNaturalPerson: owner should have hash.\nowner: ${JSON.stringify(owner, null, 5)}`)

    const relationships = Object.entries(requiredProps)
      .reduce((acc, [KEY, VALUE]) => {
        return [...acc, {
          labels: ["HAS_ATTRIBUTE"],
          partnerNode: {
            labels: ["ATTRIBUTE"],
            properties: { KEY, VALUE, OWNER: owner.getHash() },
          },
        }]
    }, [] as SimplifiedRelationship[])

    const rv = await mango.buildAndMergeEnhancedNode({
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