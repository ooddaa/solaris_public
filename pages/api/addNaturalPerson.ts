// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

// import { log } from "mango";
import { mango }  from '../db/neoj4Config'

type Result = {
  success: boolean
  data: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result>
) {
  /* store in Neo4j */
  try {
    const naturalPerson = req.body

    /* how do I know which ones are required? */
    let rv /* : Node */ = await mango.buildAndMergeNode(["NaturalPerson"], naturalPerson);
    // log(rv)
    res.status(200).json({ success: true, data: rv })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, data: [] })
  }
}