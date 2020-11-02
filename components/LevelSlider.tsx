import { FunctionComponent, useState } from "react";
import styles from "../styles/LevelSlider.module.css";

interface Props {
    initialLevel: number;
    onLevelChange: (level: number) => void;
}

const MAX_LEVEL = 13;
const MAX_BONUS_LEVEL = 25;

const LevelSlider: FunctionComponent<Props> = ({ initialLevel, onLevelChange }) => {
    const [level, setLevel] = useState(initialLevel);

    const updateLevel = (newLevel?: number) => {
        const clampedLevel = Math.min(Math.max(newLevel, 1), MAX_LEVEL + MAX_BONUS_LEVEL);
        setLevel(clampedLevel)
        if (!isNaN(clampedLevel)) {
            onLevelChange(clampedLevel);
        }
    }

    const mainInputProps = {
        min: 1,
        max: MAX_LEVEL,
        value: Math.min(level, MAX_LEVEL),
        onChange: e => updateLevel(e.target.valueAsNumber)
    };

    const bonusInputProps = {
        min: 0,
        max: MAX_BONUS_LEVEL,
        value: level - MAX_LEVEL,
        onChange: e => updateLevel(e.target.valueAsNumber + MAX_LEVEL)
    }

    return (
        <>
            Select your weekly vault level:
            <div className={styles["inputs-container"]}>
                <input className={styles["range-input"]} type="range" {...mainInputProps} />
                <input className={styles["number-input"]} type="number" {...mainInputProps} />
            </div>
            {level >= MAX_LEVEL && <div className={styles["inputs-container"]}>
                <input className={styles["range-input"]} type="range" {...bonusInputProps} />
                <input className={styles["number-input"]} type="number" {...bonusInputProps} />
            </div>}
        </>
    );
}

export default LevelSlider;