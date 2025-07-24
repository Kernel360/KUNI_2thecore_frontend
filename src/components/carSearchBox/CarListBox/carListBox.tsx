import Status from "../status";
import styles from "./carListBox.module.css";

interface CarListBoxProps {
    num: string;
    brand: string;
    model: string;
    location: string;
    status: string;
}

const CarListBox: React.FC<CarListBoxProps> = ({ num, model, brand, location, status }) => {
    return (
        <div className={styles.container}>
            <div className={styles.info}>
                <div className={styles.num}>{num}</div>
                <div className={styles.texts}>{brand} {model} {location}</div>
            </div>
            <Status status={status as "운행중" | "대기중" | "수리중"} />
        </div>
    )
}

export default CarListBox;
