import type { NextPage } from 'next'
// import Passport from "./components/Passport"
import Passport from "./components/Passport2"
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Passport />
    </div>
  )
}

export default Home
