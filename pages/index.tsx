import type { NextPage } from 'next'
import { useState } from 'react'
import DataDisplayWindow from "./components/DataDisplayWindow"
import DataEntryWindow from "./components/DataEntryWindow"
import styles from '../styles/Home.module.scss'

const Home: NextPage = () => {
  const [passports, setPassports] = useState<string[]>([])
  
  const addPassport = (newPassport: string) => {
    setPassports([...passports, newPassport])
  }

  const [persons, setPersons] = useState<string[]>([])
  
  const addNaturalPerson = (newPerson: string) => {
    setPersons([...persons, newPerson])
  }

  return (
    <div className={styles.container}>
      <DataEntryWindow 
        addPassport={addPassport} 
        addNaturalPerson={addNaturalPerson}
      />
      <DataDisplayWindow 
        // passports={passports}
        // persons={persons}
        data={[...passports, ...persons]}
      />
    </div>
  )
}

export default Home
