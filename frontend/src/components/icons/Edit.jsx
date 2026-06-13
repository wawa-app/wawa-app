import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Edit({
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
            <G clipPath="url(#clip0_734_5168)">
                <Mask
                    id="mask0_734_5168"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_734_5168)">
                    <Mask
                        id="path-2-inside-1_734_5168"
                        maskUnits="userSpaceOnUse"
                        x="5"
                        y="7.01758"
                        width="12"
                        height="12"
                    >
                        <Rect x="5" y="7.01758" width="12" height="12" rx="1" fill="white" />
                    </Mask>

                    <Rect
                        x="5"
                        y="7.01758"
                        width="12"
                        height="12"
                        rx="1"
                        stroke={iconColor}
                        strokeWidth={3}
                        mask="url(#path-2-inside-1_734_5168)"
                    />

                    <Path
                        d="M16.4756 5.17285C16.7675 4.88203 17.2403 4.88203 17.5332 5.17188L18.8447 6.46973C19.1404 6.76231 19.142 7.24025 18.8477 7.53418L12.499 13.873C12.2459 14.1258 11.9026 14.2676 11.5449 14.2676H10.0996C9.90651 14.2673 9.75 14.1111 9.75 13.918V12.4336C9.74999 12.0746 9.89313 11.7299 10.1475 11.4766L16.4756 5.17285Z"
                        fill={iconColor}
                        stroke="#FFFBF0"
                        strokeWidth={0.5}
                        strokeLinecap="round"
                    />

                    <Path
                        d="M15.363 6.65039L17.3275 8.61523"
                        stroke="#FFFBF0"
                        strokeWidth={0.5}
                        strokeLinecap="square"
                    />

                    <Path
                        d="M10.4912 11.6055L12.3195 13.4336"
                        stroke="#FFFBF0"
                        strokeWidth={0.5}
                        strokeLinecap="square"
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_734_5168">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}