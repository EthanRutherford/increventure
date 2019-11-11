import j from "react-jenny";
import {useToasts} from "../logic/use-toasts";
import Close from "../images/svgs/close.svg";
import styles from "../styles/toast.css";

function Toast(toast) {
	return j({div: styles.toast}, [
		j({div: styles.title}, toast.title),
		toast.desc && j({div: styles.desc}, toast.desc),
		j({button: {
			className: styles.closeButton,
			onClick: toast.killMe,
		}}, [
			j([Close, styles.closeIcon]),
		]),
	]);
}

export function ToastManager() {
	const toastList = useToasts();

	if (toastList.length === 0) {
		return null;
	}

	return j({div: styles.manager}, toastList.map((toast) =>
		j([Toast, toast]),
	));
}
