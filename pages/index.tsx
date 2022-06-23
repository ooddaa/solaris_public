import type { NextPage } from 'next'
import { useState } from 'react'
import Passport from "./components/forms/PassportForm"
import DataDisplayWindow from "./components/DataDisplayWindow"
import DataEntryWindow from "./components/DataEntryWindow"
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  const [data, setDisplayedData] = useState<string[]>([])
  
  const addPassport = (newData: string) => {
    setDisplayedData([...data, newData])
  }

  return (
    <div className={styles.container}>
      <DataEntryWindow addPassport={addPassport}/>
      <DataDisplayWindow data={data}/>
    </div>
  )
}

export default Home
