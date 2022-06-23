import React, {useState} from "react";
import styles from "../../../styles/PassportsData.module.scss";
import axios from "axios";
import { isArray } from "lodash";

interface PassportsDataProps {
  onData: (data: string) => void
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


function PassportsData(/* { onData }: PassportsDataProps */) {
  const [passports, setPassports] = useState<EnhancedNode[]>([])
  const getAllPassports = async () => {
    try {
      const response = await axios.get('/api/getAllPassports')
      const result = response?.data
      if (! result.success) {
        throw new Error(`PassportsData.getAllPassports: result was not a success.\nresult: ${JSON.stringify(result, null, 5)}`)
      }
      const allPassports = result.data
      // console.log(allPassports)

      /* checks */
      if (!allPassports) return;
      if (!isArray(allPassports)) {
        throw new Error(`PassportsData.getAllPassports: allPassports must be array.\n${JSON.stringify(allPassports, null, 5)}`)
      }
      setPassports(allPassports)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <button onClick={getAllPassports}>Get all Passports</button>
      <div className={`passports-data ${styles["passports-data"]}`}>
        {
          (passports && passports.length) ?
          passports.map(thinkOfAGoodName) :
          `passports found: ${passports.length}`
        }
      </div>
    </div>
  );
}

const thinkOfAGoodName = (passport: EnhancedNode, i: number): JSX.Element => {
  return (
    <div key={i} className="passport">passport {i}</div>
  )
}

export default PassportsData;
