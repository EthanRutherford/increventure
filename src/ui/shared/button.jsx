import styles from "./button.css";

const cssVar = (name, suffix = "") => name && `var(--${name}${suffix})`;

export function Button({
	className,
	baseColor,
	borderColor,
	textColor,
	margin,
	padding,
	width,
	height,
	children,
	fontSize,
	...rest
}) {
	return (
		<button
			className={`${styles.button} ${className || ""}`}
			style={{
				borderColor: cssVar(borderColor),
				"--base-color": cssVar(baseColor),
				"--light-color": cssVar(baseColor, "-light"),
				"--dark-color": cssVar(baseColor, "-dark"),
				color: cssVar(textColor),
				margin, padding,
				width, height,
				fontSize: cssVar(fontSize),
			}}
			{...rest}
		>
			{children}
		</button>
	);
}
