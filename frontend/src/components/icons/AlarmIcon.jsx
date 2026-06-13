import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Circle,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function AlarmIcon({
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
            <G clipPath="url(#clip0_734_5179)">
                <Mask
                    id="mask0_734_5179"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_734_5179)">
                    <Circle
                        cx="12"
                        cy="12.7363"
                        r="5.75"
                        stroke={iconColor}
                        strokeWidth={1.5}
                    />

                    <Path
                        d="M12 9.18164V12.9991C12 13.2752 12.2239 13.4991 12.5 13.4991H14.1667"
                        stroke={iconColor}
                        strokeLinecap="round"
                    />

                    <Path
                        d="M16.6582 4C17.8547 4.00004 18.8251 4.95708 18.8252 6.1377C18.8252 7.0177 18.2855 7.77264 17.5156 8.10059C16.733 7.15793 15.6893 6.44066 14.4951 6.05859C14.5375 4.91464 15.4885 4 16.6582 4Z"
                        fill={iconColor}
                    />

                    <Path
                        d="M7.1665 4C5.97013 4.00017 5.00063 4.95716 5.00049 6.1377C5.00049 7.01781 5.54006 7.77173 6.31006 8.09961C7.09275 7.15724 8.13652 6.44046 9.33057 6.05859C9.28823 4.91463 8.33617 4 7.1665 4Z"
                        fill={iconColor}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_734_5179">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}
