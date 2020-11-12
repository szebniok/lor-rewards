import styles from "../styles/Home.module.css";
import { getWeeklyReward, WeeklyReward } from "../lib/probability"
import { GetStaticProps } from "next";
import { FunctionComponent, useState } from "react";
import LevelSlider from "../components/LevelSlider";
import Link from "next/link";
import WeeklyRewards from "../components/WeeklyRewards";
import Head from "next/head";

interface Props {
    levelRewards: WeeklyReward[];
}

const Home: FunctionComponent<Props> = ({ levelRewards }) => {
    const [level, setLevel] = useState(1);
    const rewards = levelRewards[level - 1];

    return (
        <>
            <Head>
                <script async defer data-domain="szebniok.github.io/lor-rewards" src="https://stats.000077.xyz/js/plausible.js"></script>
                <title>Legends of Runeterra weekly vault rewards</title>
                <meta name="description" content="Legends of Runeterra weekly vault rewards calculator" />
                <meta name="google-site-verification" content="rHkzTSzopbIP6bvmIacnGk84jS6naax4Q099rPJb5BE" />
            </Head>
            <nav className={styles["navbar"]}>
                <h1>
                    <Link href="/">
                        <a>
                            Legends of Runeterra weekly vault rewards
                        </a>
                    </Link>
                </h1>
            </nav>
            <main className={styles.main}>
                <LevelSlider initialLevel={1} onLevelChange={setLevel} />
                <WeeklyRewards rewards={rewards} />
            </main>
            <footer className={`extend ${styles.footer}`}>
                <div>
                    <p>
                        You can browse the source code <a href="https://github.com/szebniok/lor-rewards">on GitHub</a>.
                        Last updated: <time dateTime="2020-10-20">2020-10-20 (patch 1.12)</time>
                    </p>
                    <p>This site is unofficial, the numbers shown here may be incorrect.</p>
                    <p>
                        <Link href="/"><a>lor-rewards</a></Link> isn't endorsed by Riot Games and
                        doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing
                        Riot Games properties. Riot Games, and all associated properties are trademarks or registered trademarks
                        of Riot Games, Inc.
                    </p>
                </div>
            </footer>
        </>
    )
}

export default Home;

export const getStaticProps: GetStaticProps<Props> = async () => {
    const levels = Array(13 + 25).fill(0).map((_, i) => i + 1);
    return {
        props: {
            levelRewards: levels.map(getWeeklyReward)
        }
    }
}