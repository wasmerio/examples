import type { CSSProperties, SVGProps } from "preact/compat";

type IconProps = SVGProps<SVGSVGElement> & {
	size?: number;
};

function baseStyle(size: number | undefined): CSSProperties {
	return {
		display: "block",
		width: size ?? 18,
		height: size ?? 18,
	};
}

export function GithubIcon({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
			aria-hidden="true"
			style={baseStyle(size)}
			{...props}
		>
			<path d="M15 22v-4a3.5 3.5 0 0 0-1-2.6c3.3-.4 6.8-1.6 6.8-7.1A5.6 5.6 0 0 0 19.2 4a5.2 5.2 0 0 0-.1-3.9S17.8-.3 15 1.6a13.4 13.4 0 0 0-6 0C6.2-.3 4.9.1 4.9.1A5.2 5.2 0 0 0 4.8 4a5.6 5.6 0 0 0-1.6 4.3c0 5.5 3.5 6.7 6.8 7.1a3.5 3.5 0 0 0-1 2.6v4" />
			<path d="M9 18c-4 1.3-4-2.2-5.7-2.5" />
		</svg>
	);
}

export function MusiMarkIcon({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 512 512"
			fill="none"
			aria-hidden="true"
			style={baseStyle(size)}
			{...props}
		>
			<path
				d="M256 136v136h256S383.667 108 320 108c-32.042 0-52.031 15.922-64 28Z"
				fill="#ad6d62"
			/>
			<path
				d="M256 272v176s75.942 9.815 168-72c71.902-63.902 88-104 88-104H256Z"
				fill="#c98273"
			/>
			<path
				d="M256 272v176s-75.942 9.815-168-72C16.098 312.098 0 272 0 272h256Z"
				fill="#d38f7b"
			/>
			<path
				d="M256 136v136H0S128.333 108 192 108c32.042 0 52.031 15.922 64 28Z"
				fill="#9e6663"
			/>
		</svg>
	);
}

export function SunIcon({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
			aria-hidden="true"
			style={baseStyle(size)}
			{...props}
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 2v2.2" />
			<path d="M12 19.8V22" />
			<path d="M4.9 4.9l1.6 1.6" />
			<path d="M17.5 17.5l1.6 1.6" />
			<path d="M2 12h2.2" />
			<path d="M19.8 12H22" />
			<path d="M4.9 19.1l1.6-1.6" />
			<path d="M17.5 6.5l1.6-1.6" />
		</svg>
	);
}

export function MoonIcon({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
			aria-hidden="true"
			style={baseStyle(size)}
			{...props}
		>
			<path d="M21 12.8A9 9 0 1 1 11.2 3a7.1 7.1 0 0 0 9.8 9.8Z" />
		</svg>
	);
}

export function DesktopIcon({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
			aria-hidden="true"
			style={baseStyle(size)}
			{...props}
		>
			<rect x="3" y="4" width="18" height="12" rx="2" />
			<path d="M8 20h8" />
			<path d="M12 16v4" />
		</svg>
	);
}

export function GlobeIcon({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
			aria-hidden="true"
			style={baseStyle(size)}
			{...props}
		>
			<circle cx="12" cy="12" r="9" />
			<path d="M3 12h18" />
			<path d="M12 3a14.5 14.5 0 0 1 0 18" />
			<path d="M12 3a14.5 14.5 0 0 0 0 18" />
		</svg>
	);
}

export function MenuIcon({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
			aria-hidden="true"
			style={baseStyle(size)}
			{...props}
		>
			<path d="M4 7h16" />
			<path d="M4 12h16" />
			<path d="M4 17h16" />
		</svg>
	);
}

export function ChevronDownIcon({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeLinecap="round"
			strokeLinejoin="round"
			strokeWidth="1.8"
			aria-hidden="true"
			style={baseStyle(size)}
			{...props}
		>
			<path d="m6 9 6 6 6-6" />
		</svg>
	);
}

export function UnitedStatesFlagIcon({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			style={baseStyle(size)}
			{...props}
		>
			<clipPath id="us-flag-clip">
				<rect x="2" y="4" width="20" height="16" rx="2" />
			</clipPath>
			<g clipPath="url(#us-flag-clip)">
				<rect x="2" y="4" width="20" height="16" fill="#fff" />
				<rect x="2" y="4" width="20" height="2" fill="#b22234" />
				<rect x="2" y="8" width="20" height="2" fill="#b22234" />
				<rect x="2" y="12" width="20" height="2" fill="#b22234" />
				<rect x="2" y="16" width="20" height="2" fill="#b22234" />
				<rect x="2" y="20" width="20" height="2" fill="#b22234" />
				<rect x="2" y="4" width="9" height="8" fill="#3c3b6e" />
				<circle cx="4.2" cy="5.8" r="0.45" fill="#fff" />
				<circle cx="6.2" cy="5.8" r="0.45" fill="#fff" />
				<circle cx="8.2" cy="5.8" r="0.45" fill="#fff" />
				<circle cx="5.2" cy="7.7" r="0.45" fill="#fff" />
				<circle cx="7.2" cy="7.7" r="0.45" fill="#fff" />
				<circle cx="9.2" cy="7.7" r="0.45" fill="#fff" />
				<circle cx="4.2" cy="9.6" r="0.45" fill="#fff" />
				<circle cx="6.2" cy="9.6" r="0.45" fill="#fff" />
				<circle cx="8.2" cy="9.6" r="0.45" fill="#fff" />
			</g>
			<rect
				x="2"
				y="4"
				width="20"
				height="16"
				rx="2"
				stroke="currentColor"
				strokeOpacity="0.16"
			/>
		</svg>
	);
}

export function JapanFlagIcon({ size, ...props }: IconProps) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			style={baseStyle(size)}
			{...props}
		>
			<rect x="2" y="4" width="20" height="16" rx="2" fill="#fff" />
			<circle cx="12" cy="12" r="4.2" fill="#bc002d" />
			<rect
				x="2"
				y="4"
				width="20"
				height="16"
				rx="2"
				stroke="currentColor"
				strokeOpacity="0.16"
			/>
		</svg>
	);
}
