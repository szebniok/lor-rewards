import { FunctionComponent, useState } from "react";
import styles from "../styles/LevelSlider.module.css";
import { Range } from "react-range";

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

    const updateBonusLevel = (newLevel: number) => updateLevel(newLevel + MAX_LEVEL);

    const mainInputProps = {
        min: 1,
        max: MAX_LEVEL,
        value: Math.min(level, MAX_LEVEL),
    };

    const bonusInputProps = {
        min: 0,
        max: MAX_BONUS_LEVEL,
        value: level - MAX_LEVEL,
    }

    return (
        <>
            Select your weekly vault level:
            <div className={styles["inputs-container"]}>
                <Slider {...mainInputProps} onChange={updateLevel} />
                <input
                    {...mainInputProps}
                    className={styles["number-input"]}
                    type="number"
                    onChange={e => updateLevel(e.target.valueAsNumber)}
                />
            </div>
            {level >= MAX_LEVEL && <div className={styles["inputs-container"]}>
                <Slider {...bonusInputProps} onChange={updateBonusLevel} />
                <input
                    {...bonusInputProps}
                    className={styles["number-input"]}
                    type="number"
                    onChange={e => updateBonusLevel(e.target.valueAsNumber)}
                />
            </div>}
        </>
    );
}

export default LevelSlider;

interface SliderProps {
    min: number;
    max: number;
    value: number;
    onChange: (newValue: number) => void;
}

const Slider: FunctionComponent<SliderProps> = ({ min, max, value, onChange }) => {
    return (
        <Range
            min={min}
            max={max}
            step={1}
            values={[isNaN(value) ? min : value]}
            onChange={newState => onChange(newState[0])}
            renderTrack={({ props, children }) => (
                <div className={styles["range-input"]}>
                    <div {...props} className={styles["range-input-track"]}>
                        {children}
                    </div>
                </div>
            )}
            renderThumb={({ props, isDragged }) => (
                <div
                    {...props}
                    className={`${styles["range-input-thumb"]} ${isDragged ? styles["clicked"] : ""}`}
                />
            )}
        />
    )
} 