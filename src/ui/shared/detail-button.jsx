import {parseCoinsShort} from "../../util/money";
import {Button} from "./button.jsx";
import coinStyles from "../../styles/coins";
import styles from "./detail-button.css";

export function DetailButton({title, count, cost, desc, ...rest}) {
	const coin = parseCoinsShort(cost);

	return (
		<Button className={styles.button} {...rest}>
			<div className={styles.buttonRow}>
				<h2 className={styles.title}>{title}</h2>
				{count != null && <h2 className={styles.count}>{count}</h2>}
			</div>
			<div className={styles.buttonRow}>
				{cost != null && (
					<div className={styles.cost}>
						<div className={`${coinStyles[coin.kind]} ${coinStyles.coin}`} />
						{coin.value}
					</div>
				)}
				{desc != null && <div className={styles.desc}>{desc}</div>}
			</div>
		</Button>
	);
}
