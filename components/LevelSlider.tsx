import { FunctionComponent } from "react";
import styles from "../styles/LevelSlider.module.css";

interface Props {
    level: number;
    onLevelChange?: (level: number) => void;
}

const BONUS_THRESHOLD = 13;

const LevelSlider: FunctionComponent<Props> = ({ level, onLevelChange }) => {
    const updateLevel = onLevelChange ?? (() => { });

    const mainInputProps = {
        min: 1,
        max: BONUS_THRESHOLD,
        value: Math.min(level, BONUS_THRESHOLD),
        onChange: e => updateLevel(e.target.valueAsNumber)
    };

    const bonusInputProps = {
        min: 0,
        max: 25,
        value: level - BONUS_THRESHOLD,
        onChange: e => updateLevel(e.target.valueAsNumber + BONUS_THRESHOLD)
    }

    return (
        <>
            Select your weekly vault level:
            <div className={styles["inputs-container"]}>
                <input className={styles["range-input"]} type="range" {...mainInputProps} />
                <input className={styles["number-input"]} type="number" {...mainInputProps} />
            </div>
            {level >= BONUS_THRESHOLD && <div className={styles["inputs-container"]}>
                <input className={styles["range-input"]} type="range" {...bonusInputProps} />
                <input className={styles["number-input"]} type="number" {...bonusInputProps} />
            </div>}
        </>
    );
}

export default LevelSlider;