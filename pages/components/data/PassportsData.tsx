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
      const data: EnhancedNode[] = await axios.post('/api/getAllPassports')
      // console.log(data)

      /* checks */
      if (!data) return;
      if (!isArray(data)) {
        throw new Error(`PassportsData.getAllPassports: data is not array.\n${JSON.stringify(data, null, 5)}`)
      }
      setPassports(data)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      <button onClick={getAllPassports}>Get all Passports</button>
      <div className={`passports-data ${styles["passports-data"]}`}>
        {passports && passports.length && passports.map(thinkOfAGoodName)}
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
