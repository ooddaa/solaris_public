import type { NextPage } from 'next'
import { useState } from 'react'
import DataDisplayWindow from "./components/DataDisplayWindow"
import DataEntryWindow from "./components/DataEntryWindow"
import styles from '../styles/Home.module.scss'
import { Relationship } from './types'

const Home: NextPage = () => {
  const [passports, setPassports] = useState<string[]>([])
  
  const addPassport = (newPassport: string) => {
    setPassports([...passports, newPassport])
  }

  const [persons, setPersons] = useState<string[]>([])
  
  const addNaturalPerson = (newPerson: string) => {
    setPersons([...persons, newPerson])
  }

  const [verificationRequests, setVerificationRequests] = useState<Relationship[]>([])

  const onVerificationRequest = (requests: Relationship[]) => {
    setVerificationRequests(requests)
  }

  return (
    <div className={styles.container}>
      <DataEntryWindow 
        /* actions */
        addPassport={addPassport} 
        addNaturalPerson={addNaturalPerson}
        /* data */
        verificationRequests={verificationRequests}
      />
      <DataDisplayWindow 
        /* actions */
        onVerificationRequest={onVerificationRequest}
        /* data */
        data={[...passports, ...persons]}
      />
    </div>
  )
}

export default Home
