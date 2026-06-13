import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Label({
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
            <G clipPath="url(#clip0_804_10264)">
                <Mask
                    id="mask0_804_10264"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_804_10264)">
                    <Path
                        d="M14.2578 7.25C14.795 7.25 15.303 7.49648 15.6348 7.91895L18.0869 11.043C18.5993 11.6958 18.5825 12.619 18.0469 13.2529L15.6172 16.1289C15.2847 16.5225 14.7955 16.75 14.2803 16.75H7C6.0335 16.75 5.25 15.9665 5.25 15V9C5.25 8.0335 6.0335 7.25 7 7.25H14.2578Z"
                        stroke={iconColor}
                        strokeWidth={1.5}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_804_10264">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}