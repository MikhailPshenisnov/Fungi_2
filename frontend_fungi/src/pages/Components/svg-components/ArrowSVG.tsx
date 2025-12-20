interface IArrowSvg {
    arrowDirection: 'right' | 'left';
}

export const ArrowSvg: React.FC<IArrowSvg> = ({ arrowDirection }) => {
    return arrowDirection === 'right' ? (
        <svg
            width="55"
            height="77"
            viewBox="0 0 75 97"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_878_405)">
                <path
                    d="M31.1455 68.325L43.8538 48.5L31.1455 28.675"
                    stroke="#653D00"
                    strokeWidth={5}
                    strokeLinecap="square"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_878_405">
                    <rect
                        width="95.16"
                        height="61"
                        fill="white"
                        transform="matrix(0 1 1 0 7 0.920021)"
                    />
                </clipPath>
            </defs>
        </svg>
    ) : (
        <svg
            width="55"
            height="77"
            viewBox="0 0 75 97"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g clipPath="url(#clip0_878_407)">
                <path
                    d="M43.8545 28.675L31.1462 48.5L43.8545 68.325"
                    stroke="#653D00"
                    strokeWidth={5}
                    strokeLinecap="square"
                    strokeLinejoin="round"
                />
            </g>
            <defs>
                <clipPath id="clip0_878_407">
                    <rect
                        width="95.16"
                        height="61"
                        fill="white"
                        transform="matrix(0 -1 -1 0 68 96.08)"
                    />
                </clipPath>
            </defs>
        </svg>
    );
};
