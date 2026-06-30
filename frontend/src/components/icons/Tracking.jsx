import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Tracking({
    size = 24,
    color,
    currentColor = "#1A0F07",
    style,
}) {
    const iconColor = color || currentColor;

    return (
        <Svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            style={style}
        >
            <G clipPath="url(#clip0_734_5152)">
                <Mask
                    id="mask0_734_5152"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_734_5152)">
                    <Path
                        d="M5 18.0005V19.0005H7V18.0005H6H5ZM7 15.8198C7 15.2675 6.55228 14.8198 6 14.8198C5.44772 14.8198 5 15.2675 5 15.8198H6H7ZM9.19831 18.0005V19.0005H11.1983V18.0005H10.1983H9.19831ZM11.1983 13.9134C11.1983 13.3611 10.7506 12.9134 10.1983 12.9134C9.64602 12.9134 9.19831 13.3611 9.19831 13.9134H10.1983H11.1983ZM13.3764 18.0005V19.0005H15.3764V18.0005H14.3764H13.3764ZM15.3764 12.1849C15.3764 11.6326 14.9286 11.1849 14.3764 11.1849C13.8241 11.1849 13.3764 11.6326 13.3764 12.1849H14.3764H15.3764ZM18.1628 18.0005V19.0005H20.1628V18.0005H19.1628H18.1628ZM20.1628 10.0155C20.1628 9.46317 19.7151 9.01546 19.1628 9.01546C18.6106 9.01546 18.1628 9.46317 18.1628 10.0155H19.1628H20.1628ZM6 18.0005H7V15.8198H6H5V18.0005H6ZM10.1983 18.0005H11.1983V13.9134H10.1983H9.19831V18.0005H10.1983ZM14.3764 18.0005H15.3764V12.1849H14.3764H13.3764V18.0005H14.3764ZM19.1628 18.0005H20.1628V10.0155H19.1628H18.1628V18.0005H19.1628Z"
                        fill={iconColor}
                    />
                    <Path
                        d="M5.60913 13.2803L18.6091 5.08887"
                        stroke={iconColor}
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                    <Path
                        d="M20.1803 3.99194C20.3007 4.0107 20.3765 4.13181 20.3407 4.24827L19.3721 7.4028C19.3218 7.56661 19.1022 7.59544 19.0114 7.45019L16.7194 3.78759C16.6285 3.64233 16.7505 3.4575 16.9198 3.48388L20.1803 3.99194Z"
                        fill={iconColor}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_734_5152">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}