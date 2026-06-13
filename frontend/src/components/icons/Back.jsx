import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Back({
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
            <G clipPath="url(#clip0_804_10256)">
                <Mask
                    id="mask0_804_10256"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_804_10256)">
                    <Path
                        d="M15.2359 5.87988L7.94592 11.8177C7.70028 12.0178 7.70028 12.393 7.94592 12.593L15.2359 18.5309"
                        stroke={iconColor}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_804_10256">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}