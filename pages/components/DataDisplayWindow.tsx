import React, { useEffect, useState } from "react";
import styles from "../../styles/DataDisplayWindow.module.scss";
import { Prism } from "@mantine/prism";
import { Tabs } from "@mantine/core";
import PassportsData from './data/PassportsData'

interface DataDisplayWindowProps {
  passports: string[];
  persons: string[];
}
const DataDisplayWindow = ({ passports, persons }: DataDisplayWindowProps) => {

  const [activeTab, setActiveTab] = useState(1);

  const onChange = (active: number, tabKey: string) => {
    setActiveTab(active);
  };


  const tabs = passports.map((passport, i) => {
    return (
      <Tabs.Tab key={i} label="Tab" tabKey={`tab-${i}`}>
        {<Prism language="tsx">{passport}</Prism>}
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
      </Tabs>
    </div>
  );
};

export default DataDisplayWindow;
