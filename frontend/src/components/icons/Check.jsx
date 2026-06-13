import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Check({
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
            <G clipPath="url(#clip0_734_5145)">
                <Mask
                    id="mask0_734_5145"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_734_5145)">
                    <Path
                        d="M6 13L9.17249 16.1725C9.60699 16.607 10.3269 16.5505 10.6883 16.0535L18 6"
                        stroke={iconColor}
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_734_5145">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}