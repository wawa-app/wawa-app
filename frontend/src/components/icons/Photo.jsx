import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Photo({
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
            <G clipPath="url(#clip0_804_11824)">
                <Mask
                    id="mask0_804_11824"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_804_11824)">
                    <Path
                        d="M17.5 4.5C19.1569 4.5 20.5 5.84315 20.5 7.5V16.5C20.5 18.1569 19.1569 19.5 17.5 19.5H6.5C4.84315 19.5 3.5 18.1569 3.5 16.5V7.5C3.5 5.84315 4.84315 4.5 6.5 4.5H17.5ZM11.917 14.9766C11.5189 15.5734 10.7009 15.7136 10.127 15.2832L7.19336 13.082L5.0498 16.4062C5.03447 16.43 5.01746 16.4522 5 16.4736V16.5C5 17.3284 5.67157 18 6.5 18H17.5L17.6533 17.9922C18.4097 17.9154 19 17.2767 19 16.5V15.2568C18.9088 15.2086 18.8252 15.1424 18.7578 15.0557L15.0469 10.2812L11.917 14.9766ZM6.5 6C5.67157 6 5 6.67157 5 7.5V13.7178L6.0791 12.0449L6.15723 11.9355C6.57399 11.4188 7.33509 11.3141 7.87891 11.7217L10.8154 13.9238L13.9912 9.16113L14.0859 9.03613C14.5574 8.48846 15.4041 8.45778 15.9141 8.96973L16.0176 9.08789L19 12.9229V7.5C19 6.72334 18.4097 6.08461 17.6533 6.00781L17.5 6H6.5Z"
                        fill={iconColor}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_804_11824">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}