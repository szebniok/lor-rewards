export { }

const CARD_UPGRADE_PROPABILITY = 0.1;
const CAPSULE_UPGRADE_PROPABILITY = 0.1;
const CHEST_UPGRADE_PROPABILITY = 0.2;

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
    capsules: CapsulePropability[];
}

export function getCard(rarity: CardRarity): CardPropability {
    const card = { common: 0, rare: 0, epic: 0, legendary: 0 };
    card[rarity] = 1;

    return getUpgradedCard(card);
}

function getUpgradedCard(cardPropability: CardPropability): CardPropability {
    const card = { ...cardPropability };

    card.rare += card.common * CARD_UPGRADE_PROPABILITY;
    card.common *= (1 - CARD_UPGRADE_PROPABILITY);

    card.epic += card.rare * CARD_UPGRADE_PROPABILITY;
    card.rare *= (1 - CARD_UPGRADE_PROPABILITY);

    card.legendary += card.epic * CARD_UPGRADE_PROPABILITY;
    card.epic *= (1 - CARD_UPGRADE_PROPABILITY);

    return card;
}

export function getChest(rarity: ChestRarity): ChestPropability {
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

export function getChestCapsules(rarity: ChestRarity): Chest {
    switch (rarity) {
        default:
        case ChestRarity.platinum:
            return {
                capsules: ["rare", "rare"].map(getCapsule)
            }


        case ChestRarity.diamond:
            return {
                capsules: ["rare", "rare", "rare"].map(getCapsule)
            }
    }
}

export function getCapsule(rarity: CapsuleRarity): CapsulePropability {
    const capsule = { rare: 0, epic: 0, legendary: 0 };
    capsule[rarity] = 1;

    capsule.epic += capsule.rare * CAPSULE_UPGRADE_PROPABILITY;
    capsule.rare *= (1 - CAPSULE_UPGRADE_PROPABILITY);

    capsule.legendary += capsule.epic * CAPSULE_UPGRADE_PROPABILITY;
    capsule.epic *= (1 - CAPSULE_UPGRADE_PROPABILITY);

    return capsule;
}

export function getCapsuleCards(rarity: CapsuleRarity): Capsule {
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

export function getExpectedValue(chest: ChestPropability): CardPropability {
    let common = 0;
    let rare = 0;
    let epic = 0;
    let legendary = 0;

    for (let [chestRarity, chestRarityPropability] of Object.entries(chest)) {
        console.log(chestRarity, chestRarityPropability);

        if (chestRarityPropability == 0) continue;

        const { capsules } = getChestCapsules(ChestRarity[chestRarity]);

        for (let capsule of capsules) {

            console.log(capsule);

            for (let [capsuleRarity, capsuleRarityPropability] of Object.entries(capsule)) {
                const commonFactor = chestRarityPropability * capsuleRarityPropability;

                for (let card of getCapsuleCards(CapsuleRarity[capsuleRarity])) {
                    common += commonFactor * card.common;
                    rare += commonFactor * card.rare;
                    epic += commonFactor * card.epic;
                    legendary += commonFactor * card.legendary;
                }
            }
        }
    }

    return {
        common, rare, epic, legendary
    }
}