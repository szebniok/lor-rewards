import { FunctionComponent } from "react";

interface Props {
    level: number;
    onLevelChange?: (level: number) => void;
}

const LevelSlider: FunctionComponent<Props> = ({ level, onLevelChange }) => {
    const updateLevel = onLevelChange ?? (() => { });
    return (
        <>
            <input type="range" min="1" max="13" value={level} onChange={e => updateLevel(e.target.valueAsNumber)} />
            <input type="number" min="1" max="13" value={level} onChange={e => updateLevel(e.target.valueAsNumber)} />
        </>
    );
}

export default LevelSlider;