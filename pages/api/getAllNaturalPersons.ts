// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import type { EnhancedNode, NaturalPersonStatistics, GetAllNaturalPersonsResponse } from '../types'

// import { log } from "mango";
import { mango, engine }  from '../db/neoj4Config'
import { isString } from 'lodash'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetAllNaturalPersonsResponse>
) {

  try {
    /* get all passports by label */

    const enodes: EnhancedNode[] = await mango.findNode(["NaturalPerson"]);

    /* get base scores */
    const _constructQuery = (_hash: string) => {
      if (!isString(_hash) || _hash.length === 0) {
        throw new Error(`[API] getAllNaturalPersons._constructQuery: _hash must be a non-empty string.\n_hash: ${JSON.stringify(_hash, null, 4)}`)
      }

      return `MATCH (np: NaturalPerson { _hash: "${_hash}" })-[:HAS_ATTRIBUTE]->(Attribute)-[:HAS_VERIFICATION_REQUEST]->(VerificationRequest)<-[:IN_RESPONSE_TO]-(ve:VerificationEvent)
      WITH np._hash as hash, collect(ve) as nodes
      RETURN [hash, reduce(baseScore = 0, n in nodes | baseScore + CASE WHEN n.RESULT = TRUE THEN 1 ELSE -1 END)]`
    }

    const baseScores: NaturalPersonStatistics[] = await Promise.all(
      enodes.map( async (enode: EnhancedNode) => {
        const _hash = enode.getHash()
        const query = _constructQuery(_hash)
        const result = await engine.runQuery({ query, raw: true })
        const score = result.getData()[0]["_fields"][0]
        //
        const stats: NaturalPersonStatistics = { _hash, baseScore: score[1].low }
        // log(stats)
        return stats
      })
    )

    

    /* package response */
    const rv:[EnhancedNode, NaturalPersonStatistics][]  =  enodes.map(enode => {
      const [score]: NaturalPersonStatistics[] = baseScores.filter(({ _hash }) => _hash === enode.getHash())
      if (score === undefined) {
        throw new Error(`[API] getAllNaturalPersons: expected to match a score to _hash: ${enode.getHash()}.\nbaseScores: ${JSON.stringify(baseScores, null, 4)}`)
      }
      return [enode, score]
    })

    // log(rv)

    /* check success */
    res.status(200).json({ success: true, data: rv })

  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, data: [] })
  }
}