import { CardRarity, CapsuleRarity, WeeklyReward, getCapsuleContent, CardProbability } from "./probability"

const CARD_RARITY_VALUE_IN_SHARDS: Record<CardRarity, number> = {
    [CardRarity.common]: 100,
    [CardRarity.rare]: 300,
    [CardRarity.epic]: 1200,
    [CardRarity.champion]: 3000
}

// champion costs 3000 shards or 300 coins
const SHARD_VALUE_IN_COINS = 0.1;

// 1000 coins can be bought for $10
const COIN_VALUE_IN_DOLLARS = 0.01;

function getShardValueOfCardProbability(card: CardProbability): number {
    let result = 0;

    for (let rarity of Object.values(CardRarity)) {
        result += card[rarity] * CARD_RARITY_VALUE_IN_SHARDS[rarity]
    }

    return result;
}

function getShardValueOfExpectedRewards(card: Record<CardRarity, number>): number {
    return getShardValueOfCardProbability(card);
}

export function getShardValueOfWeeklyReward(reward: WeeklyReward): number {
    let result = getShardValueOfExpectedRewards(reward.expected_rewards);

    result += reward.shards;

    if (reward.champion_card || reward.champion_wildcard) {
        result += CARD_RARITY_VALUE_IN_SHARDS[CardRarity.champion];
    }

    if (reward.expedition_token) {
        const expedition_reward = getCapsuleContent(CapsuleRarity.epic);

        for (let card of expedition_reward) {
            result += getShardValueOfCardProbability(card);
        }
    }

    return result;
}

export function getDollarValueOfWeeklyReward(reward: WeeklyReward): number {
    return getShardValueOfWeeklyReward(reward) * SHARD_VALUE_IN_COINS * COIN_VALUE_IN_DOLLARS;
}