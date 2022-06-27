// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { log } from "mango";
import { mango, engine }  from '../db/neoj4Config'
import { EnhancedNode, Relationship, Result, VerificationEvent } from '../types'

/**
 * 
 * Map(2) {'1828b73a1021e783f5b4b4f81c8d93295006b21b1ff97707097a07c438992237' => {…}, '8411a6a169e4cb19bee7bec1ba7439cb3ee04728c0d8f59e0900eb81600fb18d' => {…}}
[[Entries]]
0: {"1828b73a1021e783f5b4b4f81c8d93295006b21b1ff97707097a07c438992237" => Object}
key: "1828b73a1021e783f5b4b4f81c8d93295006b21b1ff97707097a07c438992237"
value:
available: true
result: true
verifierCredentials: 'oda'
verificationRequestHash: "1828b73a1021e783f5b4b4f81c8d93295006b21b1ff97707097a07c438992237"
verificationRequest:
direction: null
endNode: {labels: Array(1), properties: {…}, identity: {…}, relationships: {…}}
identity: {low: 17, high: 0}
labels: ['HAS_VERIFICATION_REQUEST']
necessity: "required"
properties: {_date_created: Array(5), _hash: 'fe00375332c1cb781f9c3285e8cd3b6c063115be80858aa0f9b5345f2f845201', _type: 'HAS_VERIFICATION_REQUEST', _necessity: 'required', _uuid: '3b026516-45f2-47ff-894d-2bdaf226a3c2', …}
startNode: {labels: Array(1), properties: {…}, identity: {…}, relationships: {…}}
[[Prototype]]: Object
[[Prototype]]: Object
 *
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Result>
) {

  try {
    /**
     * In the case of NaturalPerson Verification Request.
     * we take endNode == VerificationRequest
     * and construct
     * (VerificationRequest)<-[:IN_RESPONSE_TO]-(VerificationEvent)<-[:ISSUED]-(Verifier { USER_ID: verifierCredentials })
     * 
     */
    const verificationEvents: VerificationEvent[] = req.body
    // log(verificationEvents)
    const rv = await Promise.all(
     verificationEvents.map(
        async (verificationEvent: VerificationEvent) => {
          // debugger
          // console.log(verificationEvent)

          if (!(verificationEvent?.verificationRequest?.endNode)) {
            throw new Error(`api/addVerificationEvent: expected to receive (VerificationRequest) as verificationEvent.verificationRequest.endNode.\nverificationEvent: ${JSON.stringify(verificationEvent, null, 4)}`)
          }

          // const ve = await engine.matchNodes([verificationEvent?.verificationRequest?.endNode],{
          //   extract: true,
          // })
          // console.log(ve)
          const { ATTRIBUTE_HASH, REQUESTER, VERIFIER, _hash } = verificationEvent?.verificationRequest?.endNode.properties
          const ve = await mango.findNode(['VerificationRequest'], { ATTRIBUTE_HASH, REQUESTER, VERIFIER, _hash })
          console.log(ve)

          const rv = await mango.buildAndMergeEnhancedNode({
            labels: ["VerificationEvent"],
            properties: { 
              RESULT: verificationEvent.result, 
              VERIFIER_CREDENTIALS: verificationEvent.verifierCredentials,
              VERIFICATION_REQUEST_HASH: verificationEvent.verificationRequestHash  
            },
            relationships: [
              {
                labels: ["IN_RESPONSE_TO"],
                /** @todo anything useful as rel props? */
                // properties: {}, 
                // partnerNode: verificationEvent?.verificationRequest?.endNode,
                partnerNode: ve,
                direction: "outbound",
              }
            ]
          })
          console.log(rv)
          return rv
        }
      )
    )

    res.status(200).json({ success: true, data: rv })
  } catch (error) {
    console.error(error)
    res.status(400).json({ success: false, data: [] })
  }
}