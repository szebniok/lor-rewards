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
        <div className={styles["reward"]}>
            <p>{name}</p>
            <img src={`/${name}.svg`} alt={name} title={name} />
            <p>{quantity.toFixed(precision)}</p>
        </div>
    )
}

const AdditionalReward: FunctionComponent<{ type: "card" | "wildcard" | "token" }> = ({ type }) => {
    const iconSrc = type == "token" ? "/token.svg" : "champion.svg";
    const rewardName = type == "card" ? "Random champion card"
        : type == "wildcard" ? "Champion wildcard"
            : "Expedition token"

    return (
        <div className={styles["reward"]}>
            <img src={iconSrc} alt={rewardName} title={rewardName} />
            <p>{rewardName}</p>
        </div>
    );
}

interface Props {
    rewards: WeeklyRewardType;
}

const WeeklyRewards: FunctionComponent<Props> = ({ rewards }) => {
    const anyAdditionalRewards = rewards.champion_card || rewards.champion_wildcard || rewards.expedition_token;

    return (
        <>
            <div className={styles["rewards-group"]}>
                <p>Expected rewards from chests:</p>

                <div className={styles["rewards-list-container"]}>
                    <ChestRarity name="common" quantity={rewards.expected_rewards.common} />
                    <ChestRarity name="rare" quantity={rewards.expected_rewards.rare} />
                    <ChestRarity name="epic" quantity={rewards.expected_rewards.epic} />
                    <ChestRarity name="champion" quantity={rewards.expected_rewards.champion} />
                    <ChestRarity name="shards" quantity={rewards.shards} precision={0} />
                </div>
            </div>
            {anyAdditionalRewards &&
                <div className={styles["rewards-group"]}>
                    <p>You will also recieve:</p>

                    <div className={styles["rewards-list-container"]}>
                        {rewards.champion_card && <AdditionalReward type="card" />}
                        {rewards.champion_wildcard && <AdditionalReward type="wildcard" />}
                        {rewards.expedition_token && <AdditionalReward type="token" />}
                    </div>
                </div>
            }
        </>
    );
}

export default WeeklyRewards;