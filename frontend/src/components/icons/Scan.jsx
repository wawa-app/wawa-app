import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Scan({
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
            <G clipPath="url(#clip0_804_10243)">
                <Mask
                    id="mask0_804_10243"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_804_10243)">
                    <Path
                        d="M3.80786 8.76709V5.25977C3.80786 4.98362 4.03172 4.75977 4.30786 4.75977H7.80786"
                        stroke={iconColor}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                    <Path
                        d="M20.2424 8.76709V5.25977C20.2424 4.98362 20.0186 4.75977 19.7424 4.75977H16.2424"
                        stroke={iconColor}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                    <Path
                        d="M20.2424 15.5698V19.0771C20.2424 19.3533 20.0186 19.5771 19.7424 19.5771H16.2424"
                        stroke={iconColor}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                    <Path
                        d="M3.80786 15.5698V19.0771C3.80786 19.3533 4.03172 19.5771 4.30786 19.5771H7.80786"
                        stroke={iconColor}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                    <Path
                        d="M3 12H21"
                        stroke={iconColor}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_804_10243">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}