// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import type {
  EnhancedNode,
  NaturalPersonVerificationScore,
  GetAllNaturalPersonsResponse,
} from "../types";

import { log, stringify } from "mango";
import { mango, engine } from "../db/neoj4Config";
import { isArray, isString } from "lodash";

/**
 * Will return all NaturalPersons and their VerificationScores.
 * @param req 
 * @param res 
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetAllNaturalPersonsResponse>
) {
  try {
    /* get all NaturalPersons */
    const enodes: EnhancedNode[] = await mango.findNode(["NaturalPerson"]);

    /* get all Verification Scores */
    /* prepare Cypher query template */
    const _cypherQuery = (_hash: string) => {
      if (!isString(_hash) || _hash.length === 0) {
        throw new Error(
          `[API] getAllNaturalPersons._cypherQuery: _hash must be a non-empty string.\n_hash: ${stringify(_hash)}`
        );
      }

      return `MATCH (np: NaturalPerson { _hash: "${_hash}" })-[:HAS_ATTRIBUTE]->(Attribute)-[:HAS_VERIFICATION_REQUEST]->(VerificationRequest)<-[:IN_RESPONSE_TO]-(ve:VerificationEvent)
      WITH np._hash as hash, collect(ve) as nodes
      RETURN [hash, reduce(baseScore = 0, n in nodes | baseScore + CASE WHEN n.RESULT = TRUE THEN 1 ELSE -1 END)]`;
    };

    /** we want to get Verification Scores to send to UI */
    const getScore = async (enode: EnhancedNode): Promise<NaturalPersonVerificationScore> => {
      const _hash = enode.getHash();
      const query = _cypherQuery(_hash);

      /* db call */
      const result /* Result */ = await engine.runQuery({ query, raw: true });

      /* data: [] */
      if (!result || !result.data || result.data.length === 0) {
        return { _hash, baseScore: 0 };
      }

      /* 
        data: [
          Record {
            _fields: [
              [
                '02f20ee016231b97bebfcddecb440ec5fb153cf329cb60307261e008d97f877b',
                Integer { low: 2, high: 0 }
              ]
        ], 
      */

      if (
        result &&
        result.data &&
        result.data[0]._fields &&
        isArray(result.data[0]._fields) &&
        result.data[0]._fields[0] !== undefined && // hash
        result.data[0]._fields[0][1] !== undefined && // score
        result.data[0]._fields[0][1].low !== undefined // number
      ) {
        return { _hash, baseScore: result.data[0]._fields[0][1].low };
      }

      return { _hash, baseScore: 0 };
    };

    const baseScores: NaturalPersonVerificationScore[] = await Promise.all(
      enodes.map(getScore)
    );

    /* package response to be sent to UI */
    const rv: [EnhancedNode, NaturalPersonVerificationScore][] = enodes.map(
      (enode) => {
        const [score]: NaturalPersonVerificationScore[] = baseScores.filter(
          ({ _hash }) => _hash === enode.getHash()
        );
        if (score === undefined) {
          throw new Error(
            `[API] getAllNaturalPersons: expected to match a score to _hash: ${enode.getHash()}.\nbaseScores: ${stringify(baseScores)}`
          );
        }
        return [enode, score];
      }
    );

    /* check success */
    res.status(200).json({ success: true, data: rv });
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, data: [] });
  }
}
