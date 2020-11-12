const CARD_UPGRADE_PROBABILITY = 0.1;
const CAPSULE_UPGRADE_PROBABILITY = 0.1;
const CHEST_UPGRADE_PROBABILITY = 0.2;

const BONUS_THRESHOLD = 13;

const CHEST_RARITIES = [
    ["bronze", "bronze", "bronze"],
    ["bronze", "bronze", "silver"],
    ["bronze", "silver", "silver"],
    ["bronze", "silver", "gold"],
    ["silver", "silver", "gold"],
    ["silver", "gold", "gold"],
    ["gold", "gold", "gold"],
    ["gold", "gold", "platinum"],
    ["gold", "platinum", "platinum"],
    ["platinum", "platinum", "platinum"],
    ["platinum", "platinum", "diamond"],
    ["platinum", "diamond", "diamond"],
    ["diamond", "diamond", "diamond"],
    ["platinum", "platinum", "platinum"]
] as ChestRarity[][];


export enum CardRarity {
    common = "common",
    rare = "rare",
    epic = "epic",
    champion = "champion"
}

export enum CapsuleRarity {
    rare = "rare",
    epic = "epic",
    champion = "champion",
    bonus = "bonus"
}

enum ChestRarity {
    bronze = "bronze",
    silver = "silver",
    gold = "gold",
    platinum = "platinum",
    diamond = "diamond"
}

export type CardProbability = Record<CardRarity, number>;
type CapsuleProbability = Record<CapsuleRarity, number>;
type ChestProbability = Record<ChestRarity, number>;

type Capsule = [CardProbability, CardProbability, CardProbability, CardProbability, CardProbability];

interface Chest {
    capsules?: CapsuleProbability[];
    cards?: CardProbability[];
    shards: number;
}

interface ChestExpectedValue {
    cards: Record<CardRarity, number>;
    shards: number;
}

export interface WeeklyReward {
    champion_card: boolean
    champion_wildcard: boolean,
    expedition_token: boolean;
    expected_rewards: Record<CardRarity, number>;
    shards: number;
}

export function getCard(rarity: CardRarity): CardProbability {
    const card = { common: 0, rare: 0, epic: 0, champion: 0 };
    card[rarity] = 1;

    card.rare += card.common * CARD_UPGRADE_PROBABILITY;
    card.common *= (1 - CARD_UPGRADE_PROBABILITY);

    card.epic += card.rare * CARD_UPGRADE_PROBABILITY;
    card.rare *= (1 - CARD_UPGRADE_PROBABILITY);

    card.champion += card.epic * CARD_UPGRADE_PROBABILITY;
    card.epic *= (1 - CARD_UPGRADE_PROBABILITY);

    return card;
}

function getChest(rarity: ChestRarity): ChestProbability {
    const chest = { bronze: 0, silver: 0, gold: 0, platinum: 0, diamond: 0 };
    chest[rarity] = 1;

    chest.silver += chest.bronze * CHEST_UPGRADE_PROBABILITY;
    chest.bronze *= (1 - CHEST_UPGRADE_PROBABILITY);

    chest.gold += chest.silver * CHEST_UPGRADE_PROBABILITY;
    chest.silver *= (1 - CHEST_UPGRADE_PROBABILITY);

    chest.platinum += chest.gold * CHEST_UPGRADE_PROBABILITY;
    chest.gold *= (1 - CHEST_UPGRADE_PROBABILITY);

    chest.diamond += chest.platinum * CHEST_UPGRADE_PROBABILITY;
    chest.platinum *= (1 - CHEST_UPGRADE_PROBABILITY);

    return chest;
}

function getCapsule(rarity: CapsuleRarity): CapsuleProbability {
    const capsule = { rare: 0, epic: 0, champion: 0, bonus: 0 };
    capsule[rarity] = 1;

    capsule.epic += capsule.rare * CAPSULE_UPGRADE_PROBABILITY;
    capsule.rare *= (1 - CAPSULE_UPGRADE_PROBABILITY);

    capsule.champion += capsule.epic * CAPSULE_UPGRADE_PROBABILITY;
    capsule.epic *= (1 - CAPSULE_UPGRADE_PROBABILITY);

    return capsule;
}

export function getCapsuleContent(rarity: CapsuleRarity): Capsule {
    const CAPSULE_RARITY_TO_CARDS_RARITY: Record<CapsuleRarity, CardRarity[]> = {
        rare: [CardRarity.common, CardRarity.common, CardRarity.common, CardRarity.common, CardRarity.rare],
        epic: [CardRarity.common, CardRarity.common, CardRarity.rare, CardRarity.rare, CardRarity.epic],
        champion: [CardRarity.rare, CardRarity.rare, CardRarity.rare, CardRarity.epic, CardRarity.champion],
        bonus: [CardRarity.common, CardRarity.common, CardRarity.rare, CardRarity.rare, CardRarity.rare],
    };

    return CAPSULE_RARITY_TO_CARDS_RARITY[rarity].map(getCard) as Capsule;
}

function getChestContent(rarity: ChestRarity): Chest {
    switch (rarity) {
        case ChestRarity.bronze:
            return {
                cards: ["common", "common"].map(getCard),
                shards: 60
            }

        case ChestRarity.silver:
            return {
                cards: ["common", "common", "rare"].map(getCard),
                shards: 140
            }

        case ChestRarity.gold:
            return {
                capsules: ["rare"].map(getCapsule),
                shards: 240
            }

        case ChestRarity.platinum:
            return {
                capsules: ["rare", "rare"].map(getCapsule),
                shards: 360
            }

        case ChestRarity.diamond:
            return {
                capsules: ["rare", "rare", "rare"].map(getCapsule),
                shards: 500
            }
    }
}

function getExpectedValue(chest: ChestProbability): ChestExpectedValue {
    let common = 0;
    let rare = 0;
    let epic = 0;
    let champion = 0;
    let expectedShards = 0;

    for (let [chestRarity, chestRarityProbability] of Object.entries(chest)) {

        const { capsules, cards, shards } = getChestContent(ChestRarity[chestRarity]);

        for (let capsule of capsules || []) {
            for (let [capsuleRarity, capsuleRarityProbability] of Object.entries(capsule)) {
                const factor = chestRarityProbability * capsuleRarityProbability;

                for (let card of getCapsuleContent(CapsuleRarity[capsuleRarity])) {
                    common += factor * card.common;
                    rare += factor * card.rare;
                    epic += factor * card.epic;
                    champion += factor * card.champion;
                }
            }
        }

        for (let card of cards || []) {
            common += chestRarityProbability * card.common;
            rare += chestRarityProbability * card.rare;
            epic += chestRarityProbability * card.epic;
            champion += chestRarityProbability * card.champion;
        }

        expectedShards += chestRarityProbability * shards
    }

    return {
        cards: {
            common, rare, epic, champion
        },
        shards: expectedShards
    }
}

export function getWeeklyReward(level: number): WeeklyReward {
    const champion_wildcard = level >= 10;
    const champion_card = !champion_wildcard && level >= 5;
    const expedition_token = level >= 2;

    let common = 0;
    let rare = 0;
    let epic = 0;
    let champion = 0;
    let shards = 0;

    const baseLevel = Math.min(level, BONUS_THRESHOLD);
    const bonusLevel = level - baseLevel;

    const chestsEv = CHEST_RARITIES[baseLevel - 1].map(getChest).map(getExpectedValue);

    for (let ev of chestsEv) {
        common += ev.cards.common;
        rare += ev.cards.rare;
        epic += ev.cards.epic;
        champion += ev.cards.champion;
        shards += ev.shards
    }

    if (bonusLevel > 0) {
        const bonusCapsuleEv = getCapsuleContent(CapsuleRarity.bonus);
        for (let ev of bonusCapsuleEv) {
            common += bonusLevel * ev.common;
            rare += bonusLevel * ev.rare;
            epic += bonusLevel * ev.epic;
            champion += bonusLevel * ev.champion;
        }
    }

    return {
        champion_card,
        champion_wildcard,
        expedition_token,
        expected_rewards: { common, rare, epic, champion },
        shards
    }
}