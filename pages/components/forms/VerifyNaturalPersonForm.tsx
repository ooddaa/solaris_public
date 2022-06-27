import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { Relationship } from "../../types";
import styles from "../../../styles/VerifyNaturalPersonForm.module.scss";
import isArray from "lodash/isArray";
interface VerifyNaturalPersonFormProps {
  verificationRequests: Relationship[];
}
interface VerificationEvent {
  available: boolean;
  verfificationRequestHash: string | null,
  result: boolean | null;
  reason?: string
}

const VerificationRequestsContext = createContext<any>(null)

export default function VerifyNaturalPersonForm({
  verificationRequests,
}: VerifyNaturalPersonFormProps) {
  const [verificationEventsMap, _thinkOfAGoodName] = useState(new Map<string, VerificationEvent>())
  
  const setVerificationEventsMap = (value: VerificationEvent) => {
    const key = value.verfificationRequestHash
    if (typeof key !== "string") return 
    _thinkOfAGoodName(verificationEventsMap.set(key, value))
  }

  const handleSubmit = () => {
    // console.log('submitting')
    console.log(verificationEventsMap)
  }

  return (
    <VerificationRequestsContext.Provider 
      value={{
        verificationEventsMap, 
        setVerificationEventsMap
      }}
    >
      {verificationRequests && isArray(verificationRequests)
        ? verificationRequests.map((vr, i) => <VerificationRequest key={i} verificationRequest={vr}/>)
        : "no verification requests"}
      <button onClick={handleSubmit}>Submit</button>
    </VerificationRequestsContext.Provider>
  );

};


function VerificationRequest({verificationRequest} : {verificationRequest: Relationship}
): JSX.Element {
  const { labels, properties, startNode, endNode } = verificationRequest;
  const [verificationEvent, setVerificationEvent] =
    useState<VerificationEvent>({
      available: false,
      verfificationRequestHash: null,
      result: null,
    });
  const { setVerificationEventsMap } = useContext(VerificationRequestsContext)

  const yes = (hash: string) => {
    const ve = {
      ...verificationEvent,
      available: true,
      verfificationRequestHash: hash,
      result: true,
    }
    setVerificationEvent(ve);
    /**@todo include endNode's _hash */
    console.log('yes', ve)
    setVerificationEventsMap(ve)
  };

  const no = (hash: string) => {
    const ve = {
      ...verificationEvent,
      available: true,
      verfificationRequestHash: hash,
      result: false,
    }
    setVerificationEvent(ve);
    console.log('no', ve)
    setVerificationEventsMap(ve)
  };

  const addReason = (e: React.ChangeEventHandler<HTMLInputElement>) => {

  }

  return (
    <div /* key={i}  */className="verification-request">
      <div className={styles["verification-request-card"]}>
        <div className="question">
          {endNode.properties.REQUESTER} wants to verify that{" "}
          {(startNode.properties.OWNER as string).slice(0, 6)}&rsquo;s{" "}
          {startNode.properties.KEY} is really{" "}
          <i>{startNode.properties.VALUE}</i>.
        </div>
        <div className={styles["buttons"]}>
          Do you concur?
          <button onClick={() => yes(endNode.properties._hash)}>Yes</button>
          <button onClick={() => no(endNode.properties._hash)}>No</button>
          {verificationEvent &&
            verificationEvent.available &&
            (verificationEvent.result ? (
              <div className="verification-result yes">ok</div>
            ) : (
              <div className="verification-result no">why?
                {/* <input type='text' name="verification-result-reason" onChange={addReason}/> */}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};


// const updateVerifications = useCallback((newVerificationEvent: any) => {
  //   const rv = [...verifications, newVerificationEvent]
  //   setVerificationEvents(rv)
  //   console.log('updateVerifications:', rv)
  // }, [])
  // const contextValue = useMemo(() => {
  //   // setVerificationEvents()
  // }, [])

/* verificationRequest is 
  Relationship {
    labels: [ 'HAS_VERIFICATION_REQUEST' ],
    properties: {
      _date_created: [ 2022, 6, 24, 5, 1656083112597 ],
      _hash: 'fe00375332c1cb781f9c3285e8cd3b6c063115be80858aa0f9b5345f2f845201',
      _type: 'HAS_VERIFICATION_REQUEST',
      _necessity: 'required',
      _uuid: '3b026516-45f2-47ff-894d-2bdaf226a3c2',
      _isCurrent: true,
      _hasBeenUpdated: false
    },
    startNode: EnhancedNode {
      labels: [ 'ATTRIBUTE' ],
      properties: {
        OWNER: 'f7e99766e1be9141c6d923beb680b594950c9d500e7fcf07fe4398c614538520',
        _template: 'Node',
        _date_created: [ 2022, 6, 24, 5, 1656069125529 ],
        _hash: '14c8027d6dd937772e0d7a3f6688c7ae709be13597f702126514f18d822ef9d9',
        VALUE: 'London',
        _uuid: 'a58ed134-fd5c-4ef1-91df-723d9fffa93b',
        _labels: [ 'ATTRIBUTE' ],
        _label: 'ATTRIBUTE',
        KEY: 'PLACE_OF_BIRTH'
      },
      identity: Integer { low: 24, high: 0 },
      relationships: { inbound: [], outbound: [] }
    },
    endNode: EnhancedNode {
      labels: [ 'VerificationRequest' ],
      properties: {
        VERIFIER: 'any',
        _hash: '1828b73a1021e783f5b4b4f81c8d93295006b21b1ff97707097a07c438992237',
        _template: 'Node',
        _date_created: [ 2022, 6, 24, 5, 1656083112596 ],
        TIMELIMIT: false,
        ATTRIBUTE_HASH: '14c8027d6dd937772e0d7a3f6688c7ae709be13597f702126514f18d822ef9d9',
        REQUESTER: 'Ronald MacDonald',
        otherConditions: [ 'cerial killers not to bother' ],
        _uuid: '9e8cece5-e032-4852-922d-52bebb4a1968',
        _label: 'VerificationRequest',
        _labels: [ 'VerificationRequest' ]
      },
      identity: Integer { low: 50, high: 0 },
      relationships: { inbound: [], outbound: [] }
    },
    identity: Integer { low: 17, high: 0 },
    direction: null,
    necessity: 'required'
  }
  */
