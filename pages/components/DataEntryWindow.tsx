import React, { useEffect, useState } from "react";
import styles from "../../styles/DataEntryWindow.module.scss";
import { Prism } from "@mantine/prism";
import { Tabs } from "@mantine/core";
import PassportForm from "./forms/PassportForm"
import NaturalPersonForm from "./forms/NaturalPersonForm"

interface DataEntryWindowProps {
  addPassport: (data: string) => void;
  addNaturalPerson: (data: string) => void;
}
const DataEntryWindow = ({ addPassport, addNaturalPerson }: DataEntryWindowProps) => {

  const [activeTab, setActiveTab] = useState(1);

  const onChange = (active: number, tabKey: string) => {
    setActiveTab(active);
  };


  return (
    <div className={styles.container}>
      <Tabs
        variant="outline"
        styles={{
          tabsList: { flexWrap: "nowrap", overflow: "scroll" },
        }}
      >
        <Tabs.Tab label="Person">
          <NaturalPersonForm addPerson={addNaturalPerson} />
        </Tabs.Tab>
        <Tabs.Tab label="Passport">
         <PassportForm addPassport={addPassport} />
        </Tabs.Tab>
      </Tabs>
    </div>
  );
};

export default DataEntryWindow;
