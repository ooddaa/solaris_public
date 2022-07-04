import React, { useEffect, useState } from "react";
import styles from "../../styles/DataDisplayWindow.module.scss";
import { Prism } from "@mantine/prism";
import { Tabs } from "@mantine/core";
import PassportsData from './data/PassportsData'
import NaturalPersonsData from './data/NaturalPersonsData'
import VerificationRequestsData from './data/VerificationRequestsData'
import type { Relationship } from '../types'

interface DataDisplayWindowProps {
  data: string[];
  onVerificationRequest: (data: Relationship[]) => void;
}
const DataDisplayWindow = ({ data, onVerificationRequest }: DataDisplayWindowProps) => {

  const [activeTab, setActiveTab] = useState(1);

  const onChange = (active: number, tabKey: string) => {
    setActiveTab(active);
  };


  const tabs = data.map((datum, i) => {
    return (
      <Tabs.Tab key={i} label="Tab" tabKey={`tab-${i}`}>
        {<Prism language="tsx">{datum}</Prism>}
      </Tabs.Tab>
    );
  });

  return (
    <div className={styles.container}>
      <Tabs
        variant="outline"
        styles={{
          tabsList: { flexWrap: "nowrap", overflow: "scroll" },
        }}
      >
        <Tabs.Tab label="Neo4j">
          <Tabs
            color="red"
            active={activeTab} onTabChange={onChange}
            styles={{
              tabsList: { flexWrap: "nowrap", overflow: "scroll" },
            }}
          >
            {tabs.length ? (
              tabs
            ) : (
              <Tabs.Tab label="">No data fetched yet</Tabs.Tab>
            )}
          </Tabs>
        </Tabs.Tab>
        <Tabs.Tab label="Passports">
          <PassportsData />
        </Tabs.Tab>
        <Tabs.Tab label="Persons">
          <NaturalPersonsData onVerificationRequest={onVerificationRequest}/>
        </Tabs.Tab>
        <Tabs.Tab label="VerificationRequests">
          <VerificationRequestsData/>
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default DataDisplayWindow;
