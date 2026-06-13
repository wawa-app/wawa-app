import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Circle,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function ObjectLists({
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
            <G clipPath="url(#clip0_734_5143)">
                <Mask
                    id="mask0_734_5143"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_734_5143)">
                    <Path
                        d="M6 17H18"
                        stroke={iconColor}
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                    <Path
                        d="M6 12H18"
                        stroke={iconColor}
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                    <Path
                        d="M9 7L18 7"
                        stroke={iconColor}
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                    <Circle
                        cx="6"
                        cy="7"
                        r="1"
                        fill={iconColor}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_734_5143">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}