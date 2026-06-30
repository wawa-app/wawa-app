import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Trophy({
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
            <G clipPath="url(#clip0_776_23043)">
                <Mask
                    id="mask0_776_23043"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_776_23043)">
                    <Path
                        d="M19.2 5.6H16.8V4.8C16.8 4.36 16.44 4 16 4H8C7.56 4 7.2 4.36 7.2 4.8V5.6H4.8C4.36 5.6 4 5.96 4 6.4V8.8C4 12.232 5.432 14.304 7.848 14.392C8.20047 15.004 8.68364 15.5307 9.26305 15.9344C9.84246 16.3382 10.5038 16.6092 11.2 16.728V18.4H8.8V20H15.2V18.4H12.8V16.728C13.4965 16.6103 14.1584 16.3397 14.7379 15.9358C15.3175 15.5319 15.8004 15.0047 16.152 14.392C18.56 14.304 20 12.232 20 8.8V6.4C20 5.96 19.64 5.6 19.2 5.6ZM5.6 8.8V7.2H7.2V12C7.2 12.224 7.224 12.448 7.248 12.664C5.776 12.096 5.6 9.848 5.6 8.8ZM15.2 12C15.2 13.768 13.768 15.2 12 15.2C10.232 15.2 8.8 13.768 8.8 12V5.6H15.2V12ZM18.4 8.8C18.4 9.848 18.224 12.096 16.752 12.664C16.784 12.448 16.8 12.224 16.8 12V7.2H18.4V8.8Z"
                        fill={iconColor}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_776_23043">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}