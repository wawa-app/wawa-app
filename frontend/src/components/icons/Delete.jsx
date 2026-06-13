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

export default function Delete({
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
            <G clipPath="url(#clip0_734_5174)">
                <Mask
                    id="mask0_734_5174"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_734_5174)">
                    <Path
                        d="M7.85474 8.15137V18.28C7.85474 18.8323 8.30245 19.28 8.85474 19.28H16.1286C16.6809 19.28 17.1286 18.8323 17.1286 18.28V8.15137"
                        stroke={iconColor}
                        strokeWidth={1.5}
                    />
                    <Path
                        d="M6 8.04199H18.9834"
                        stroke={iconColor}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                    <Path
                        d="M11.1006 10.9336V16.4979M13.8827 10.9336V16.4979"
                        stroke={iconColor}
                        strokeLinecap="round"
                    />
                    <Circle
                        cx="12.4917"
                        cy="6.85477"
                        r="1.85477"
                        fill={iconColor}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_734_5174">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}