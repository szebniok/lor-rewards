import { WeeklyReward as WeeklyRewardType } from "../lib/probability";
import { FunctionComponent } from "react";
import styles from "../styles/WeeklyRewards.module.css";

interface ChestRarityProps {
    name: string;
    quantity: number;
    precision?: number
}

const ChestRarity: FunctionComponent<ChestRarityProps> = ({ name, quantity, precision = 3 }) => {
    return (
        <div className={styles["chest-rarity"]}>
            <p>{name}</p>
            <img src={`/${name}.svg`} alt={name} title={name} />
            <p>{quantity.toFixed(precision)}</p>
        </div>
    )
}

interface Props {
    rewards: WeeklyRewardType;
}

const WeeklyRewards: FunctionComponent<Props> = ({ rewards }) => {
    return (
        <>
            <div className={styles["chest-rewards"]}>
                Expected rewards from chests:

                <div className={styles["chest-rarities-container"]}>
                    <ChestRarity name="common" quantity={rewards.expected_rewards.common} />
                    <ChestRarity name="rare" quantity={rewards.expected_rewards.rare} />
                    <ChestRarity name="epic" quantity={rewards.expected_rewards.epic} />
                    <ChestRarity name="champion" quantity={rewards.expected_rewards.champion} />
                    <ChestRarity name="shards" quantity={rewards.shards} precision={0} />
                </div>
            </div>
            <p>champion: {rewards.champion_card ? "yes" : "no"}</p>
            <p>wildcard: {rewards.champion_wildcard ? "yes" : "no"}</p>
            <p>token: {rewards.expedition_token ? "yes" : "no"}</p>
        </>
    );
}

export default WeeklyRewards;