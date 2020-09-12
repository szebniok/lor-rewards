import { getWeeklyReward, WeeklyReward } from "../lib/probability"
import { GetStaticProps } from "next";
import { FunctionComponent, useState } from "react";
import LevelSlider from "../components/LevelSlider";
import Link from "next/link";
import WeeklyRewards from "../components/WeeklyRewards";

interface Props {
    levelRewards: WeeklyReward[];
}

const Home: FunctionComponent<Props> = ({ levelRewards }) => {
    const [level, setLevel] = useState(1);
    const rewards = levelRewards[level - 1];

    return (
        <>
            <nav>
                <h1>
                    <Link href="/">
                        <a>
                            Legends of Runeterra weekly rewards
                        </a>
                    </Link>
                </h1>
            </nav>
            <main>
                <LevelSlider level={level} onLevelChange={setLevel} />
                <WeeklyRewards rewards={rewards} />
            </main>
        </>
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