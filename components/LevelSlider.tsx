import { FunctionComponent, useState } from "react";
import styles from "../styles/LevelSlider.module.css";
import { Range } from "react-range";

const MAX_LEVEL = 13;
const MAX_BONUS_LEVEL = 25;

interface Props {
    initialLevel: number;
    onLevelChange: (level: number) => void;
}

const LevelSlider: FunctionComponent<Props> = ({ initialLevel, onLevelChange }) => {
    const [level, setLevel] = useState(initialLevel);
    const [mainLevelNumberInput, setMainLevelNumberInput] = useState<string>(initialLevel.toString());
    const [bonusLevelNumberInput, setBonusLevelNumberInput] = useState<string>(initialLevel.toString());

    const updateLevel = (newLevel: number) => {
        setLevel(newLevel)
        setMainLevelNumberInput(Math.min(newLevel, MAX_LEVEL).toString());
        setBonusLevelNumberInput((newLevel - MAX_LEVEL).toString());
        onLevelChange(newLevel);
    }

    const updateBonusLevel = (newLevel: number) => updateLevel(newLevel + MAX_LEVEL);

    const updateMainLevelNumberInput = (newValue: string) => {
        setMainLevelNumberInput(newValue);
        const parsedLevel = parseInt(newValue);
        if (!isNaN(parsedLevel) && parsedLevel <= MAX_LEVEL) {
            updateLevel(parsedLevel);
        }
    }

    const updateBonusLevelNumberInput = (newValue: string) => {
        setBonusLevelNumberInput(newValue);
        const parsedLevel = parseInt(newValue);
        if (!isNaN(parsedLevel) && parsedLevel <= MAX_BONUS_LEVEL) {
            updateBonusLevel(parsedLevel);
        }
    }

    const mainInputProps = {
        min: 1,
        max: MAX_LEVEL,
    };

    const bonusInputProps = {
        min: 0,
        max: MAX_BONUS_LEVEL,
    }

    return (
        <>
            Select your weekly vault level:
            <div className={styles["inputs-container"]}>
                <Slider {...mainInputProps} value={Math.min(level, MAX_LEVEL)} onChange={updateLevel} />
                <input
                    {...mainInputProps}
                    value={mainLevelNumberInput}
                    className={styles["number-input"]}
                    type="number"
                    onChange={e => updateMainLevelNumberInput(e.target.value)}
                />
            </div>
            {level >= MAX_LEVEL && <div className={styles["inputs-container"]}>
                <Slider {...bonusInputProps} value={level - MAX_LEVEL} onChange={updateBonusLevel} />
                <input
                    {...bonusInputProps}
                    value={bonusLevelNumberInput}
                    className={styles["number-input"]}
                    type="number"
                    onChange={e => updateBonusLevelNumberInput(e.target.value)}
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
            values={[value]}
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