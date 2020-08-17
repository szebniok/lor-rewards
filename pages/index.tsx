import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { getWeeklyReward, WeeklyReward } from "../lib/propability"
import { GetStaticProps } from "next";
import { FunctionComponent } from "react";

interface Props {
  levelRewards: WeeklyReward[];
}

const Home: FunctionComponent<Props> = ({ levelRewards }) => {
  console.log(levelRewards)

  return (
    <div>
      Rewards
    </div>
  )
}

export default Home;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const levels = Array(13).fill(0).map((_, i) => i + 1);
  return {
    props: {
      levelRewards: levels.map(getWeeklyReward)
    }
  }
}