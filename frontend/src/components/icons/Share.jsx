import React from "react";
import Svg, {
    G,
    Mask,
    Rect,
    Path,
    Defs,
    ClipPath,
} from "react-native-svg";

export default function Share({
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
            <G clipPath="url(#clip0_734_5147)">
                <Mask
                    id="mask0_734_5147"
                    maskUnits="userSpaceOnUse"
                    x="0"
                    y="0"
                    width="24"
                    height="24"
                >
                    <Rect width="24" height="24" fill="#D9D9D9" />
                </Mask>

                <G mask="url(#mask0_734_5147)">
                    <Path
                        d="M16.5334 4.7002C17.9142 4.7002 19.0334 5.81948 19.0334 7.2002C19.0334 8.58091 17.9142 9.7002 16.5334 9.7002C15.8157 9.70019 15.171 9.39552 14.7151 8.91113L9.9231 11.5801C9.95314 11.735 9.96997 11.8949 9.96997 12.0586C9.96997 12.241 9.94849 12.4185 9.91138 12.5898L14.4788 15.1348C14.9302 14.4846 15.682 14.0586 16.5334 14.0586C17.9141 14.0587 19.0334 15.178 19.0334 16.5586C19.0334 17.9392 17.9141 19.0585 16.5334 19.0586C15.1681 19.0586 14.0599 17.964 14.0354 16.6045L9.16431 13.8916C8.71856 14.3038 8.12499 14.5586 7.46997 14.5586C6.08927 14.5586 4.96997 13.4393 4.96997 12.0586C4.96997 10.6779 6.08927 9.55861 7.46997 9.55859C8.14516 9.55859 8.75646 9.82769 9.2063 10.2627L14.0618 7.55859C14.0449 7.44142 14.0334 7.32202 14.0334 7.2002C14.0334 5.81949 15.1527 4.70021 16.5334 4.7002Z"
                        fill={iconColor}
                    />
                </G>
            </G>

            <Defs>
                <ClipPath id="clip0_734_5147">
                    <Rect width="24" height="24" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    );
}