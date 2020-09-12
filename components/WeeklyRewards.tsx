import { WeeklyReward as WeeklyRewardType } from "../lib/probability";
import { FunctionComponent } from "react";

interface Props {
    rewards: WeeklyRewardType;
}

const WeeklyRewards: FunctionComponent<Props> = ({ rewards }) => {
    return (
        <>
            <p>champion: {rewards.champion_card ? "yes" : "no"}</p>
            <p>wildcard: {rewards.champion_wildcard ? "yes" : "no"}</p>
            <p>token: {rewards.expedition_token ? "yes" : "no"}</p>
            <p>common: {rewards.expected_rewards.common}</p>
            <p>rare: {rewards.expected_rewards.rare}</p>
            <p>epic: {rewards.expected_rewards.epic}</p>
            <p>champion: {rewards.expected_rewards.champion}</p>
            <p>shards: {rewards.shards}</p>
        </>
    );
}

export default WeeklyRewards;