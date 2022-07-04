import React, { useState } from "react";
import styles from "../../../styles/VerificationRequestsData.module.scss";
import axios from "axios";
import { isArray } from "lodash";
import { AccordionElement } from "../AccordionElement";
import type { VerificationRequest } from "../../types";
import { Button } from "@mantine/core";

interface VerificationRequestsDataProps {
  data?: VerificationRequest[] // actually just EnhancedNode[] atm
}
function VerificationRequestsData({
  data,
}: VerificationRequestsDataProps) {
  

  return (
    <div className={styles.container}>
      {data && isArray(data) && data.map((datum, i) => {
        return <div key={i}>
          {JSON.stringify(datum,null, 4)}
        </div>
      })}
    </div>
  );
}


export default VerificationRequestsData;


// export async function getServerSideProps() {
//   let data/* : EnhancedNode[] */;
//   try {
//     data = await axios.get("/api/getAllVerificationRequests");
//     console.log('yay we have data:', data)
//     return { props: { data } }
//   } catch (error) {
//     console.error(error);
//   }

//   return { props: { data: [] } }
// }
