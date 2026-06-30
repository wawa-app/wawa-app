import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Logout({
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
            <G clipPath="url(#clip0_968_20062)">
                <Mask
                    id="mask0_968_20062"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_968_20062)">
                    <Path
                        d="M13.262 8.90986V6.58008C13.262 6.02779 12.8143 5.58008 12.262 5.58008H4.76001C4.20773 5.58008 3.76001 6.02779 3.76001 6.58008V17.4167C3.76001 17.969 4.20772 18.4167 4.76001 18.4167H12.262C12.8143 18.4167 13.262 17.969 13.262 17.4167V14.904"
                        stroke={iconColor}
                        strokeWidth={1.5}
                        strokeLinecap="round"
                    />
                    <Path
                        d="M15.5549 8.29094C15.9455 7.90042 16.5785 7.90042 16.969 8.29094L19.9338 11.2558C20.3436 11.6658 20.3436 12.3302 19.9338 12.7402L16.969 15.705C16.5785 16.0955 15.9455 16.0955 15.5549 15.705C15.1644 15.3145 15.1644 14.6815 15.5549 14.2909L16.967 12.8788H9.36255C8.81026 12.8788 8.36255 12.4311 8.36255 11.8788C8.36255 11.3265 8.81026 10.8788 9.36255 10.8788H16.7288L15.5549 9.705C15.1644 9.31448 15.1644 8.68146 15.5549 8.29094Z"
                        fill={iconColor}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_968_20062">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}