// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

import { log, Builder } from "mango";
import { mango, engine }  from '../db/neoj4Config'
import { EnhancedNode, Relationship, Result, VerificationEvent } from '../types'

type VerificationEventResponse = {
  success: boolean
  data: any[]
}

const builder = new Builder()
/**
 * VerificationEvent
 *
available: true
result: true
verifierCredentials: 'oda'
verificationRequestHash: "1828b73a1021e783f5b4b4f81c8d93295006b21b1ff97707097a07c438992237"
verificationRequest: {
  direction: null
  endNode: {labels: Array(1), properties: {…}, identity: {…}, relationships: {…}}
  identity: {low: 17, high: 0}
  labels: ['HAS_VERIFICATION_REQUEST']
  necessity: "required"
  properties: {_date_created: Array(5), _hash: 'fe00375332c1cb781f9c3285e8cd3b6c063115be80858aa0f9b5345f2f845201', _type: 'HAS_VERIFICATION_REQUEST', _necessity: 'required', _uuid: '3b026516-45f2-47ff-894d-2bdaf226a3c2', …}
  startNode: {labels: Array(1), properties: {…}, identity: {…}, relationships: {…}}
  [[Prototype]]: Object
  [[Prototype]]: Object
}
 *
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerificationEventResponse>
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

          if (!(verificationEvent?.verificationRequestHash)) {
            throw new Error(`api/addVerificationEvent: expected to receive verificationEvent.verificationRequestHash.\nverificationEvent: ${JSON.stringify(verificationEvent, null, 4)}`)
          }

          const { ATTRIBUTE_HASH, REQUESTER, VERIFIER, TIMELIMIT, otherConditions, _hash, _uuid, _label, _labels, _date_created, _template } = verificationEvent?.verificationRequest?.endNode.properties
          
          /** describe the VerificationRequest that we target */
          const partnerNode = builder.makeNode(["VerificationRequest"], {
            ATTRIBUTE_HASH,
            REQUESTER,
            VERIFIER,
            TIMELIMIT,
            otherConditions,
            _hash,
            _uuid,
            _label, 
            _labels, 
            _date_created,
            _template,
          })

          /**@todo atm there could be two VE/Vres per Verifier (true and false). We need to make sure there is max one Vres. */
          // log('endNode', verificationEvent?.verificationRequest?.endNode)
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
                partnerNode: partnerNode,
              }
            ]
          })
          // log('rv', rv)
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


          /* {
  VERIFIER: 'any',
  _hash: '9a39aedc2e7fb8168a8706f7ca5f0c37391938f1579e6b8c579809366560e0a6',
  _template: 'Node',
  _date_created: [ 2022, 6, 28, 2, 1656422443845 ],
  TIMELIMIT: false,
  ATTRIBUTE_HASH: '15f5a8ea06fb70ece116fb600f557d33c1a0083fd1101d203864459b3709d60b',
  REQUESTER: 'Ronald MacDonald',
  otherConditions: [ 'cereal killers not to bother' ],
  _uuid: '7067554b-acc9-4e6b-a7ba-c0855ee84ccd',
  _label: 'VerificationRequest',
  _labels: [ 'VerificationRequest' ]
} */