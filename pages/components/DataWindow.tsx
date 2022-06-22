import React, { useState } from "react";
import styles from "../../styles/DataWindow.module.scss";
import { Prism } from "@mantine/prism";
import { Tabs } from '@mantine/core';

interface DataWindowProps {
  data: string[]
}
const DataWindow = ({ data }: DataWindowProps) => {
  const tabs = data.map((datum, i) => {
    return (<Tabs.Tab key={i} label="Neo4j response">
    {<Prism language="tsx">{datum}</Prism>}
  </Tabs.Tab>)
  })
  console.log(tabs)
  return (
    <div className={styles.container}>
      
      <Tabs variant="outline">
        {
        tabs.length ? tabs :  <Tabs.Tab label="Nope">No data fetched yet</Tabs.Tab>
        }
      </Tabs>
    </div>
  )
}

export default DataWindow