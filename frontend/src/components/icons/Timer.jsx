import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Circle,
    Path,
    Line,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Timer({
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
            <G clipPath="url(#clip0_776_23060)">
                <Mask
                    id="mask0_776_23060"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_776_23060)">
                    <Circle
                        cx="12"
                        cy="12.4238"
                        r="5.75"
                        stroke={iconColor}
                        strokeWidth={1.5}
                    />
                    <Path
                        d="M12 13.3286V8.65137"
                        stroke={iconColor}
                        strokeLinecap="round"
                    />
                    <Line
                        x1="10.625"
                        y1="4.45508"
                        x2="13.375"
                        y2="4.45508"
                        stroke={iconColor}
                        strokeWidth={1.25}
                        strokeLinecap="round"
                    />
                    <Line
                        x1="15.7544"
                        y1="7.72369"
                        x2="16.7555"
                        y2="6.6865"
                        stroke={iconColor}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_776_23060">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}