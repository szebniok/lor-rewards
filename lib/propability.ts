const CARD_UPGRADE_PROPABILITY = 0.1;
const CAPSULE_UPGRADE_PROPABILITY = 0.1;
const CHEST_UPGRADE_PROPABILITY = 0.2;

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
    legendary = "legendary"
}

enum CapsuleRarity {
    rare = "rare",
    epic = "epic",
    legendary = "legendary"
}

enum ChestRarity {
    bronze = "bronze",
    silver = "silver",
    gold = "gold",
    platinum = "platinum",
    diamond = "diamond"
}

type CardPropability = Record<CardRarity, number>;
type CapsulePropability = Record<CapsuleRarity, number>;
type ChestPropability = Record<ChestRarity, number>;

type Capsule = [CardPropability, CardPropability, CardPropability, CardPropability, CardPropability];

interface Chest {
    capsules?: CapsulePropability[];
    cards?: CardPropability[];
    shards: number;
}

interface ChestExpectedValue {
    cards: CardPropability;
    shards: number;
}

export interface WeeklyReward {
    champion: boolean
    champion_wildcard: boolean,
    expedition_token: boolean;
    expected_rewards: CardPropability;
    shards: number;
}

export function getCard(rarity: CardRarity): CardPropability {
    const card = { common: 0, rare: 0, epic: 0, legendary: 0 };
    card[rarity] = 1;

    card.rare += card.common * CARD_UPGRADE_PROPABILITY;
    card.common *= (1 - CARD_UPGRADE_PROPABILITY);

    card.epic += card.rare * CARD_UPGRADE_PROPABILITY;
    card.rare *= (1 - CARD_UPGRADE_PROPABILITY);

    card.legendary += card.epic * CARD_UPGRADE_PROPABILITY;
    card.epic *= (1 - CARD_UPGRADE_PROPABILITY);

    return card;
}

function getChest(rarity: ChestRarity): ChestPropability {
    const chest = { bronze: 0, silver: 0, gold: 0, platinum: 0, diamond: 0 };
    chest[rarity] = 1;

    chest.silver += chest.bronze * CHEST_UPGRADE_PROPABILITY;
    chest.bronze *= (1 - CHEST_UPGRADE_PROPABILITY);

    chest.gold += chest.silver * CHEST_UPGRADE_PROPABILITY;
    chest.silver *= (1 - CHEST_UPGRADE_PROPABILITY);

    chest.platinum += chest.gold * CHEST_UPGRADE_PROPABILITY;
    chest.gold *= (1 - CHEST_UPGRADE_PROPABILITY);

    chest.diamond += chest.platinum * CHEST_UPGRADE_PROPABILITY;
    chest.platinum *= (1 - CHEST_UPGRADE_PROPABILITY);

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

function getCapsule(rarity: CapsuleRarity): CapsulePropability {
    const capsule = { rare: 0, epic: 0, legendary: 0 };
    capsule[rarity] = 1;

    capsule.epic += capsule.rare * CAPSULE_UPGRADE_PROPABILITY;
    capsule.rare *= (1 - CAPSULE_UPGRADE_PROPABILITY);

    capsule.legendary += capsule.epic * CAPSULE_UPGRADE_PROPABILITY;
    capsule.epic *= (1 - CAPSULE_UPGRADE_PROPABILITY);

    return capsule;
}

function getCapsuleCards(rarity: CapsuleRarity): Capsule {
    let cards: CardPropability[];

    switch (rarity) {
        case CapsuleRarity.rare:
            cards = ["common", "common", "common", "common", "rare"]
                .map(r => getCard(CardRarity[r]));
            break;

        case CapsuleRarity.epic:
            cards = ["common", "common", "rare", "rare", "epic"]
                .map(r => getCard(CardRarity[r]));
            break;

        case CapsuleRarity.legendary:
            cards = ["rare", "rare", "rare", "epic", "legendary"]
                .map(r => getCard(CardRarity[r]));
            break;
    }

    return cards as Capsule;
}

function getExpectedValue(chest: ChestPropability): ChestExpectedValue {
    let common = 0;
    let rare = 0;
    let epic = 0;
    let legendary = 0;
    let expectedShards = 0;

    for (let [chestRarity, chestRarityPropability] of Object.entries(chest)) {

        const { capsules, cards, shards } = getChestContent(ChestRarity[chestRarity]);

        for (let capsule of capsules || []) {
            for (let [capsuleRarity, capsuleRarityPropability] of Object.entries(capsule)) {
                const factor = chestRarityPropability * capsuleRarityPropability;

                for (let card of getCapsuleCards(CapsuleRarity[capsuleRarity])) {
                    common += factor * card.common;
                    rare += factor * card.rare;
                    epic += factor * card.epic;
                    legendary += factor * card.legendary;
                }
            }
        }

        for (let card of cards || []) {
            common += chestRarityPropability * card.common;
            rare += chestRarityPropability * card.rare;
            epic += chestRarityPropability * card.epic;
            legendary += chestRarityPropability * card.legendary;
        }

        expectedShards += chestRarityPropability * shards
    }

    return {
        cards: {
            common, rare, epic, legendary
        },
        shards: expectedShards
    }
}

export function getWeeklyReward(level: number): WeeklyReward {
    const champion_wildcard = level >= 10;
    const champion = !champion_wildcard && level >= 5;
    const expedition_token = level >= 5;

    let common = 0;
    let rare = 0;
    let epic = 0;
    let legendary = 0;
    let shards = 0;

    const chestsEv = CHEST_RARITIES[level - 1].map(getChest).map(getExpectedValue);

    for (let ev of chestsEv) {
        common += ev.cards.common;
        rare += ev.cards.rare;
        epic += ev.cards.epic;
        legendary += ev.cards.legendary;
        shards += ev.shards
    }

    return {
        champion,
        champion_wildcard,
        expedition_token,
        expected_rewards: { common, rare, epic, legendary },
        shards
    }
}