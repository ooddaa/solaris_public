// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

// import { log } from "mango";
import { mango }  from '../db/neoj4Config'

type Result = {
  success: boolean
  data: EnhancedNode[]
}

/**
 * @todo this should come from Mango
 * just mocking for now
 */
 type EnhancedNode = {
  labels: string[],
  properties: { [key: string]: string | boolean | (string[] | number[] | boolean[])},
  identity: { low: number, high: number },
  relationships?: {
    inbound: any[],
    oubound: any[],
  }
} 

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result>
) {

  try {
    /* get all passports by label */

    let enodes: EnhancedNode[] = await mango.findNode(["NaturalPerson"]);
    // log(enodes)
    /* check success */
    res.status(200).json({ success: true, data: enodes })

  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, data: [] })
  }
}