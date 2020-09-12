import { FunctionComponent } from "react";
import styles from "../styles/LevelSlider.module.css";

interface Props {
    level: number;
    onLevelChange?: (level: number) => void;
}

const LevelSlider: FunctionComponent<Props> = ({ level, onLevelChange }) => {
    const updateLevel = onLevelChange ?? (() => { });
    return (
        <>
            Select your weekly vault level:
            <div className={styles["inputs-container"]}>
                <input className={styles["range-input"]} type="range" min="1" max="13" value={level} onChange={e => updateLevel(e.target.valueAsNumber)} />
                <input className={styles["number-input"]} type="number" min="1" max="13" value={level} onChange={e => updateLevel(e.target.valueAsNumber)} />
            </div>
        </>
    );
}

export default LevelSlider;