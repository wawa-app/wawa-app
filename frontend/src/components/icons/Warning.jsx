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

export default function Warning({
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
            <G clipPath="url(#clip0_734_5182)">
                <Mask
                    id="mask0_734_5182"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_734_5182)">
                    <Path
                        d="M10.4844 6.125C11.158 4.95833 12.842 4.95834 13.5156 6.125L18.7119 15.125C19.3854 16.2916 18.5433 17.7499 17.1963 17.75H6.80371C5.45667 17.7499 4.61463 16.2916 5.28809 15.125L10.4844 6.125Z"
                        stroke={iconColor}
                        strokeWidth={1.5}
                    />
                    <Path
                        d="M11.2828 8.35247L11.9007 13.4916C11.9148 13.6091 12.0852 13.6091 12.0993 13.4916L12.7172 8.35247C12.7383 8.17679 12.6942 7.99946 12.5933 7.85413C12.3059 7.44044 11.6941 7.44044 11.4067 7.85413C11.3058 7.99946 11.2617 8.17679 11.2828 8.35247Z"
                        fill={iconColor}
                    />
                    <Circle
                        cx="12"
                        cy="15.2705"
                        r="1"
                        fill={iconColor}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_734_5182">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}