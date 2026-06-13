import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Circle,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Menu({
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
            <G clipPath="url(#clip0_734_5175)">
                <Mask
                    id="mask0_734_5175"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_734_5175)">
                    <Circle
                        cx="12"
                        cy="18"
                        r="2"
                        fill={iconColor}
                    />
                    <Circle
                        cx="12"
                        cy="12"
                        r="2"
                        fill={iconColor}
                    />
                    <Circle
                        cx="12"
                        cy="6"
                        r="2"
                        fill={iconColor}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_734_5175">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}