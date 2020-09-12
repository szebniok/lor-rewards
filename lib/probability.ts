const CARD_UPGRADE_PROBABILITY = 0.1;
const CAPSULE_UPGRADE_PROBABILITY = 0.1;
const CHEST_UPGRADE_PROBABILITY = 0.2;

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


enum CardRarity {
    common = "common",
    rare = "rare",
    epic = "epic",
    champion = "champion"
}

enum CapsuleRarity {
    rare = "rare",
    epic = "epic",
    champion = "champion"
}

enum ChestRarity {
    bronze = "bronze",
    silver = "silver",
    gold = "gold",
    platinum = "platinum",
    diamond = "diamond"
}

type CardProbability = Record<CardRarity, number>;
type CapsuleProbability = Record<CapsuleRarity, number>;
type ChestProbability = Record<ChestRarity, number>;

type Capsule = [CardProbability, CardProbability, CardProbability, CardProbability, CardProbability];

interface Chest {
    capsules?: CapsuleProbability[];
    cards?: CardProbability[];
    shards: number;
}

interface ChestExpectedValue {
    cards: CardProbability;
    shards: number;
}

export interface WeeklyReward {
    champion_card: boolean
    champion_wildcard: boolean,
    expedition_token: boolean;
    expected_rewards: CardProbability;
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

function getChestContent(rarity: ChestRarity): Chest {
    switch (rarity) {
        case ChestRarity.bronze:
            return {
                cards: ["common", "common"].map(getCard),
                shards: 80
            }

        case ChestRarity.silver:
            return {
                cards: ["common", "common", "rare"].map(getCard),
                shards: 200
            }

        case ChestRarity.gold:
            return {
                capsules: ["rare"].map(getCapsule),
                shards: 360
            }

        case ChestRarity.platinum:
            return {
                capsules: ["rare", "rare"].map(getCapsule),
                shards: 560
            }

        case ChestRarity.diamond:
            return {
                capsules: ["rare", "rare", "rare"].map(getCapsule),
                shards: 800
            }
    }
}

function getCapsule(rarity: CapsuleRarity): CapsuleProbability {
    const capsule = { rare: 0, epic: 0, champion: 0 };
    capsule[rarity] = 1;

    capsule.epic += capsule.rare * CAPSULE_UPGRADE_PROBABILITY;
    capsule.rare *= (1 - CAPSULE_UPGRADE_PROBABILITY);

    capsule.champion += capsule.epic * CAPSULE_UPGRADE_PROBABILITY;
    capsule.epic *= (1 - CAPSULE_UPGRADE_PROBABILITY);

    return capsule;
}

function getCapsuleCards(rarity: CapsuleRarity): Capsule {
    let cards: CardProbability[];

    switch (rarity) {
        case CapsuleRarity.rare:
            cards = ["common", "common", "common", "common", "rare"]
                .map(r => getCard(CardRarity[r]));
            break;

        case CapsuleRarity.epic:
            cards = ["common", "common", "rare", "rare", "epic"]
                .map(r => getCard(CardRarity[r]));
            break;

        case CapsuleRarity.champion:
            cards = ["rare", "rare", "rare", "epic", "champion"]
                .map(r => getCard(CardRarity[r]));
            break;
    }

    return cards as Capsule;
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

                for (let card of getCapsuleCards(CapsuleRarity[capsuleRarity])) {
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
    const expedition_token = level >= 5;

    let common = 0;
    let rare = 0;
    let epic = 0;
    let champion = 0;
    let shards = 0;

    const chestsEv = CHEST_RARITIES[level - 1].map(getChest).map(getExpectedValue);

    for (let ev of chestsEv) {
        common += ev.cards.common;
        rare += ev.cards.rare;
        epic += ev.cards.epic;
        champion += ev.cards.champion;
        shards += ev.shards
    }

    return {
        champion_card,
        champion_wildcard,
        expedition_token,
        expected_rewards: { common, rare, epic, champion },
        shards
    }
}