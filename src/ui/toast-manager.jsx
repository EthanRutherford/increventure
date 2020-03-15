import React from "react";
import {useToasts} from "../logic/use-toasts";
import Close from "../images/svgs/close.svg";
import styles from "../styles/toast.css";

function Toast(toast) {
	return (
		<div className={styles.toast}>
			<div className={styles.title}>{toast.title}</div>
			{toast.desc && <div className={styles.desc}>{toast.desc}</div>}
			<button
				className={styles.closeButton}
				onClick={toast.killMe}
			>
				<Close className={styles.closeIcon} />
			</button>
		</div>
	);
}

export function ToastManager() {
	const toastList = useToasts();

	if (toastList.length === 0) {
		return null;
	}

	return (
		<div className={styles.manager}>
			{toastList.map((toast) => <Toast key={toast.id} {...toast} />)}
		</div>
	);
}
