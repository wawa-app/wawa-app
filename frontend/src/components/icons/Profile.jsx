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

export default function Profile({
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
            <G clipPath="url(#clip0_734_5161)">
                <Mask
                    id="mask0_734_5161"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_734_5161)">
                    <Path
                        d="M4 18C4 14.8821 6.83275 12.5311 9.89723 13.1057L11.4225 13.3917C11.8042 13.4633 12.1958 13.4633 12.5775 13.3917L14.1028 13.1057C17.1673 12.5311 20 14.8821 20 18H4Z"
                        fill={iconColor}
                    />
                    <Circle
                        cx="12"
                        cy="9"
                        r="3"
                        fill={iconColor}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_734_5161">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}