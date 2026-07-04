import React, { useState } from 'react'; import { View, Text, Pressable } from 'react-native';
import { Menu } from 'react-native-paper';
import MenuIcon from '../icons/Menu';
import { Edit, Delete } from '../icons';
import Toggle from '../common/Toggle'

const DAY_ORDER = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function AlarmCard({ alarm, onToggle, onMenu, onEdit, onDelete }) {
    const { label, hour, minute, meridiem, days, enabled } = alarm
    const [menuVisible, setMenuVisible] = useState(false)

    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    const sortedDays = [...days].sort(
        (a, b) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b)
    )

    return (
        <View className={`w-full rounded-Radius-radius-sm gap-Space-spacing-xs ${enabled ? 'bg-Base-Surface' : 'bg-Neutral-Gray-300'}`}
            style={{ height: 136, paddingTop: 20, paddingBottom: 12, paddingHorizontal: 16 }}>
            {/* Label */}
            <View className="flex-row justify-between items-center w-full">
                <Text className="text-label-large font-geologica-medium text-Base-OnSurface">
                    {label}
                </Text>

                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={
                        <Pressable onPress={openMenu} hitSlop={8} className="w-Size-size-icon-md h-Size-size-icon-md items-center justify-center">
                            <MenuIcon width={24} height={24} />
                        </Pressable>
                    }
                    anchorPosition="bottom"
                    contentStyle={{
                        backgroundColor: '#FFF8E1',
                        borderRadius: 16,
                        paddingVertical: 10,
                        width: 127,
                        marginRight: 0
                    }}
                >
                    <Menu.Item
                        onPress={() => { closeMenu(); onEdit(); }}
                        title="Edit"
                        leadingIcon={() => <Edit width={20} height={20} color="#1A0F07" />}
                        titleStyle={{ fontFamily: 'Geologica-Medium', fontSize: 14, lineHeight: 20, color: '#1A0F07' }}
                        style={{ height: 44 }}     // Figma: wrapper height
                        dense
                    />
                    <Menu.Item
                        onPress={() => { closeMenu(); onDelete(); }}
                        title="Delete"
                        leadingIcon={() => <Delete width={20} height={20} color="#1A0F07" />}
                        titleStyle={{ fontFamily: 'Geologica-Medium', fontSize: 14, lineHeight: 20, color: '#1A0F07' }}
                        style={{ height: 44 }}
                        dense
                    />
                </Menu>
            </View>

            {/* Time */}
            <View className="flex-row items-end">
                <Text className="text-display-small font-geologica-bold text-Base-OnSurface">
                    {hour}:{String(minute).padStart(2, '0')}
                </Text>
                <Text className="text-display-small font-geologica-bold text-Base-OnSurface ml-1">
                    {meridiem}
                </Text>
            </View>

            {/* Week, toggle */}
            <View className="flex-row justify-between items-center w-full">
                <Text className="text-label-large font-geologica-medium text-Base-OnSurface">
                    {sortedDays.length === 7 ? 'Everyday' : sortedDays.join(', ')}
                </Text>
                <Toggle value={enabled} onValueChange={onToggle} />
            </View>
        </View>
    )
}