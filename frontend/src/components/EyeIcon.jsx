import React from 'react';
import VisableEye from './icons/VisableEye';
import InvisibleEye from './icons/InvisibleEye';

export default function EyeIcon({ visible, color = '#1A0F07', size = 24 }) {
    return visible
        ? <VisableEye size={size} color={color} />
        : <InvisibleEye size={size} color={color} />;
}