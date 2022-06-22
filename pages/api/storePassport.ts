// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { PassportProps } from '../components/Passport'

import {
  Engine,
  Builder,
  log,
  isFailure,
  Mango,
  search,
  not,
  isNode,
} from "mango";

const engineConfig = {
  username: "neo4j",
  password: "pass",
  ip: "0.0.0.0",
  port: "7687",
  database: "neo4j",
};

const mango = new Mango({ engineConfig });

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
    /* get passport */
    // console.log(req.body)
    const passport = req.body
    // console.log(passport)
    /* fucking caveat - say hi to me from 2017ish. I need SNAKE_CASE for required props */
    const camelToSNAKE_CASE = (str:string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`).toUpperCase();

    /* how do I know which ones are required? */
    // let rv = 'ok'
    let rv /* : Node */ = await mango.buildAndMergeNode(["Passport"], passport);
    // let rv2 /* : Node */ = await mango.buildAndMergeNode(["Passport"], passport);
    log(rv)
    // log(rv2)
    res.status(200).json({ success: true, data: rv })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, data: [] })
  }
}