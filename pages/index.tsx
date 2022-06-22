import type { NextPage } from 'next'
import { useState } from 'react'
import Passport from "./components/Passport"
import DataWindow from "./components/DataWindow"
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  const [data, setDisplayedData] = useState('no data')
  
  const displayData = (data: string) => {
    setDisplayedData(data)
  }
  return (
    <div className={styles.container}>
      <Passport onData={displayData}/>
      <DataWindow data={data}/>
    </div>
  )
}

export default Home
