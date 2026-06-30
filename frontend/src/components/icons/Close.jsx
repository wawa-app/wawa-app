import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Close({
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
            <G clipPath="url(#clip0_734_5180)">
                <Mask
                    id="mask0_734_5180"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_734_5180)">
                    <Path
                        d="M6.65685 6.65662L17.9706 17.9703M6.65685 17.9703L17.9706 6.65662"
                        stroke={iconColor}
                        strokeWidth={2}
                        strokeLinecap="round"
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_734_5180">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}