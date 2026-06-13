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

export default function Calendar({
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
            <G clipPath="url(#clip0_776_22925)">
                <Mask
                    id="mask0_776_22925"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_776_22925)">
                    <Path
                        d="M8.25 4.75391C8.66421 4.75391 9 5.08969 9 5.50391V6.75H15V5.5C15 5.08579 15.3358 4.75 15.75 4.75C16.1642 4.75 16.5 5.08579 16.5 5.5V6.75H18.5C19.0523 6.75 19.5 7.19772 19.5 7.75V18.25C19.5 18.8023 19.0523 19.25 18.5 19.25H5.5L5.39746 19.2451C4.89333 19.1938 4.5 18.7677 4.5 18.25V7.75C4.5 7.19772 4.94772 6.75 5.5 6.75H7.5V5.50391C7.5 5.08969 7.83579 4.75391 8.25 4.75391ZM6 17.75H18V11.25H6V17.75ZM6 9.75H18V8.25H6V9.75Z"
                        fill={iconColor}
                    />
                    <Circle cx="9" cy="13.25" r="0.75" fill={iconColor} />
                    <Circle cx="9" cy="16.25" r="0.75" fill={iconColor} />
                    <Circle cx="12" cy="13.25" r="0.75" fill={iconColor} />
                    <Circle cx="12" cy="16.25" r="0.75" fill={iconColor} />
                    <Circle cx="15" cy="13.25" r="0.75" fill={iconColor} />
                    <Circle cx="15" cy="16.25" r="0.75" fill={iconColor} />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_776_22925">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}