import React, {
  createContext,
  useContext,
  useState,
} from "react";
import { Relationship, VerificationEvent } from "../../types";
import styles from "../../../styles/VerifyNaturalPersonForm.module.scss";
import isArray from "lodash/isArray";
import axios from 'axios'
import { Button } from "@mantine/core"
interface VerifyNaturalPersonFormProps {
  verificationRequests: Relationship[];
}

const VerificationRequestsContext = createContext<any>(null);

export default function VerifyNaturalPersonForm({
  verificationRequests,
}: VerifyNaturalPersonFormProps) {
  const [verificationEventsMap, _thinkOfAGoodName] = useState(
    new Map<string, VerificationEvent>()
  );

  const setVerificationEventsMap = (value: VerificationEvent) => {
    const key = value.verificationRequestHash;
    if (typeof key !== "string") return;
    _thinkOfAGoodName(verificationEventsMap.set(key, value));
  };

  const removeVerificationEventsMap = (value: VerificationEvent) => {
    const key = value.verificationRequestHash;
    if (typeof key !== "string") return;
    verificationEventsMap.delete(key)
    _thinkOfAGoodName(verificationEventsMap);
  };

  const handleSubmit = async () => {

    try {
      const response: VerificationEvent[] = Array.from(verificationEventsMap.values())
      // console.log(response)
      const data = await axios.post("/api/addVerificationEvent", response);

      console.log('response: ', data)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VerificationRequestsContext.Provider
      value={{
        verificationEventsMap,
        setVerificationEventsMap,
        removeVerificationEventsMap,
      }}
    >
      {verificationRequests && isArray(verificationRequests)
        ? verificationRequests.map((vr, i) => (
          /** take unique hash so that items get re-rendered correctly */
            <VerificationRequest key={vr.properties._hash} verificationRequest={vr} />
          ))
        : "no verification requests"}
      <Button className={styles["submit-btn"]} onClick={handleSubmit}>Submit</Button>
    </VerificationRequestsContext.Provider>
  );
}

function VerificationRequest({
  verificationRequest,
}: {
  verificationRequest: Relationship;
}): JSX.Element {
  const { labels, properties, startNode, endNode } = verificationRequest;
  const [message, setMessage] = useState<"yes"|"no"|"skip"|null>(null)
  const [verificationEvent, setVerificationEvent] = useState<VerificationEvent>(
    {
      verificationRequestHash: endNode.properties._hash,
      available: false,
      result: null,
      // verifierCredentials: 'oda', 
      verifierCredentials: 'Santa', 
    }
  );
  const { verificationEventsMap, setVerificationEventsMap, removeVerificationEventsMap } = useContext(VerificationRequestsContext);

  const yes = () => {
    const ve = {
      ...verificationEvent,
      available: true,
      result: true,
      verificationRequest,
    };

    setVerificationEvent(ve);
    console.log("yes", ve);
    setVerificationEventsMap(ve);
    setMessage("yes")
  };

  const no = () => {
    const ve = {
      ...verificationEvent,
      available: true,
      result: false,
      verificationRequest,
    };
    setVerificationEvent(ve);
    console.log("no", ve);
    setVerificationEventsMap(ve);
    setMessage("no")
  };

  const skip = () => {
    // needs to remove corresponding Yes/No choice if that has been registered
    const ve = {
      ...verificationEvent,
      available: false,
      result: null,
      verificationRequest,
    };
    removeVerificationEventsMap(ve)
    setMessage("skip")
  }

  const printVEs = () => {
    console.log(verificationEventsMap)
  }

  const addReason = (e: React.ChangeEventHandler<HTMLInputElement>) => {};

  return (
    <div className="verification-request">
      <div className={styles["verification-request-card"]}>
        <div className={styles["question"]}>
          <span className="attr attr-requester">{endNode.properties.REQUESTER}</span> wants to verify that{" "}
          <span className="attr attr-owner">{(startNode.properties.OWNER as string).slice(0, 6)}&rsquo;s</span>{" "}
          <span className="attr attr-key">{startNode.properties.KEY}</span> is really{" "}
          <span className='attr attr-value'>{startNode.properties.VALUE}</span>
        </div>
        <div className={styles["buttons"]}>

          <button onClick={yes}>Yes</button>
          <button onClick={no}>No</button>
          <button onClick={skip}>Skip</button>
          <button onClick={printVEs}>printVEs</button>

            { message && (
              message === 'yes' ? <div className="verification-result yes">ok</div> : message === 'no' ? <div className="verification-result no">
              no
            </div> : <div className="verification-result skip">
              skip
            </div>
            )}
        </div>
      </div>
    </div>
  );
}

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
