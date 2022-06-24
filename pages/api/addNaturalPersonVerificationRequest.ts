// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { log, getRequiredProperties } from "mango";
import { mango, engine }  from '../db/neoj4Config'
import { SimplifiedNode, SimplifiedRelationship } from '../types'

type Result = {
  success: boolean
  data: any
}

/**
 * Gets a NaturalPerson and adds (NP)-[:HAS_ATTRIBUTE]->(Attribute)-[:HAS]->(VerificationRequest). 
 * Then Users can search for (VR)s and resolve them. 
 *
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result>
) {
  /* store in Neo4j */
  try {
    const naturalPerson = req.body
    // log('naturalPerson', naturalPerson)
    /* 
    {
      labels: [ 'NaturalPerson' ],
      properties: {
        PLACE_OF_BIRTH: 'London',
        _date_created: [ 2022, 6, 24, 5, 1656069125493 ],
        _template: 'Node',
        _hash: 'f7e99766e1be9141c6d923beb680b594950c9d500e7fcf07fe4398c614538520',
        SEX: 'Male',
        _uuid: '169055c2-ffdc-4644-95f7-33b4f405ce23',
        LAST_NAME: '1000',
        _label: 'NaturalPerson',
        FIRST_NAME: 'Hrabrazavr',
        otherNames: 'Bodaka',
        CURRENT_ADDRESS: 'JamesLee',
        previousNames: 'sdf',
        nickname: 'Motya',
        DATE_OF_BIRTH: '2018-10-21',
        _labels: [ 'NaturalPerson' ]
      },
      identity: { low: 20, high: 0 },
      relationships: { inbound: [], outbound: [] }
    }
    */
  //  const owner = await mango.findNode(naturalPerson)

    const rv = await engine.enhanceNodes([naturalPerson])
    // log(rv)
    // const requiredProps: Object = getRequiredProperties(naturalPerson)

    // const owner = await mango.buildAndMergeNode(['NaturalPerson'], naturalPerson)

    // /* do checks */
    // if (!owner) return
    // if (!owner.getHash()) throw new Error(`addNaturalPerson: owner should have hash.\nowner: ${JSON.stringify(owner, null, 5)}`)

    // const relationships = Object.entries(requiredProps)
    //   .reduce((acc, [KEY, VALUE]) => {
    //     return [...acc, {
    //       labels: ["HAS_ATTRIBUTE"],
    //       partnerNode: {
    //         labels: ["ATTRIBUTE"],
    //         properties: { KEY, VALUE, OWNER: owner.getHash() },
    //       },
    //     }]
    // }, [] as SimplifiedRelationship[])

    // const rv = await mango.buildAndMergeEnhancedNode({
    //   labels: ["NaturalPerson"], 
    //   properties: naturalPerson,
    //   relationships
    // })

    // /* how do I know which ones are required? */
    // log(rv)
    // res.status(200).json({ success: true, data: rv })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, data: [] })
  }
}