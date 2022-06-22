import React, { useState } from "react";
import styles from "../../styles/DataWindow.module.scss";
import { Prism } from "@mantine/prism";
import { Tabs } from '@mantine/core';

interface DataWindowProps {
  data: string
}
const DataWindow = ({ data }: DataWindowProps) => {
  return (
    <div className={styles.container}>
      
      <Tabs variant="outline">
        <Tabs.Tab label="Neo4j response">
          {<Prism language="tsx">{data}</Prism>}
        </Tabs.Tab>
        <Tabs.Tab label="Second">Second tab content</Tabs.Tab>
        <Tabs.Tab label="Third">Third tab content</Tabs.Tab>
      </Tabs>
    </div>
  )
}

export default DataWindow