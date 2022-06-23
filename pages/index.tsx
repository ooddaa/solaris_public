import type { NextPage } from 'next'
import { useState } from 'react'
import Passport from "./components/forms/PassportForm"
import DataWindow from "./components/DataWindow"
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  const [data, setDisplayedData] = useState<string[]>([])
  
  const displayData = (newData: string) => {
    setDisplayedData([...data, newData])
  }
  return (
    <div className={styles.container}>
      <Passport onData={displayData}/>
      <DataWindow data={data}/>
    </div>
  )
}

export default Home
