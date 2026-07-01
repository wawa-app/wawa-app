import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  Pressable,
  View,
} from 'react-native';
import {
  AlarmIcon,
  Back,
  Calendar,
  Check,
  Close,
  Delete,
  Edit,
  InvisibleEye,
  Label,
  Logout,
  Menu,
  ObjectLists,
  Photo,
  Plus,
  Profile,
  Scan,
  Share,
  Streak,
  Timer,
  Tracking,
  Trophy,
  Unstreak,
  Update,
  VisableEye,
  Warning,
} from '../../../../components/icons';
import { cn, formTw as tw } from './formNativewind';

const fieldIcons = {
  AlarmIcon,
  Back,
  Calendar,
  Check,
  Close,
  Delete,
  Edit,
  InvisibleEye,
  Label,
  Logout,
  Menu,
  ObjectLists,
  Photo,
  Plus,
  Profile,
  Scan,
  Share,
  Streak,
  Timer,
  Tracking,
  Trophy,
  Unstreak,
  Update,
  VisableEye,
  Warning,
} as const;

const iconAliases = {
  alarm: 'AlarmIcon',
  back: 'Back',
  calendar: 'Calendar',
  check: 'Check',
  close: 'Close',
  'close-circle': 'Close',
  delete: 'Delete',
  edit: 'Edit',
  eye: 'VisableEye',
  hiddenEye: 'InvisibleEye',
  invisibleEye: 'InvisibleEye',
  label: 'Label',
  pricetag: 'Label',
  logout: 'Logout',
  menu: 'Menu',
  objectLists: 'ObjectLists',
  photo: 'Photo',
  plus: 'Plus',
  profile: 'Profile',
  scan: 'Scan',
  share: 'Share',
  streak: 'Streak',
  timer: 'Timer',
  tracking: 'Tracking',
  trophy: 'Trophy',
  unstreak: 'Unstreak',
  update: 'Update',
  visibleEye: 'VisableEye',
  warning: 'Warning',
  'alert-circle': 'Warning',
} as const;

type FieldIconName = keyof typeof fieldIcons;
type FieldIconAlias = keyof typeof iconAliases;
export type AppTextFieldIconName = FieldIconName | FieldIconAlias;
type TextFieldState = 'default' | 'focused' | 'error' | 'disabled';

export interface AppTextFieldProps
  extends Omit<TextInputProps, 'editable' | 'onChangeText' | 'value'> {
  value: string;
  onChangeText: (value: string) => void;
  label?: string;
  required?: boolean;
  helperText?: string;
  errorText?: string;
  state?: Exclude<TextFieldState, 'focused'>;
  disabled?: boolean;
  leftIcon?: AppTextFieldIconName;
  rightIcon?: AppTextFieldIconName;
  onRightIconPress?: () => void;
  showClearButton?: boolean;
  showErrorIcon?: boolean;
  containerClassName?: string;
}

export default function AppTextField({
  value,
  onChangeText,
  label,
  required = false,
  helperText,
  errorText,
  state = 'default',
  disabled = false,
  leftIcon,
  rightIcon,
  onRightIconPress,
  showClearButton = false,
  showErrorIcon = false,
  containerClassName,
  placeholder = 'Name',
  onFocus,
  onBlur,
  ...inputProps
}: AppTextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const visualState: TextFieldState = disabled
    ? 'disabled'
    : errorText || state === 'error'
      ? 'error'
      : isFocused
        ? 'focused'
        : 'default';

  const rowClass = cn(
    tw.inputRow,
    visualState === 'default' && tw.defaultRow,
    visualState === 'focused' && tw.focusedRow,
    visualState === 'error' && tw.errorRow,
    visualState === 'disabled' && tw.disabledRow
  );
  const iconColor = visualState === 'disabled' ? tw.iconDisabled : tw.iconDefault;
  const helper = errorText || helperText;

  const trailingIcon = getTrailingIcon({
    rightIcon,
    showClearButton,
    showErrorIcon,
    value,
    visualState,
  });

  const handleTrailingPress = () => {
    if (disabled) return;
    if (onRightIconPress) {
      onRightIconPress();
      return;
    }
    if (trailingIcon === 'close-circle') {
      onChangeText('');
    }
  };

  return (
    <View className={cn(tw.fieldWrap, containerClassName)}>
      {label ? (
        <Text className={disabled ? tw.labelDisabled : tw.label}>
          {label}
          {required ? '*' : ''}
        </Text>
      ) : null}

      <View className={rowClass}>
        {leftIcon ? (
          <View className={tw.leftIconWrap}>
            <FieldIcon name={leftIcon} size={22} color={iconColor} />
          </View>
        ) : null}

        <TextInput
          {...inputProps}
          className={disabled ? tw.inputDisabled : tw.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={disabled ? '#52525b' : '#525252'}
          editable={!disabled}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
        />

        {trailingIcon ? (
          onRightIconPress || trailingIcon === 'Close' ? (
            <Pressable
              className={tw.rightIconButton}
              onPress={handleTrailingPress}
              disabled={disabled}
            >
              <FieldIcon name={trailingIcon} size={24} color={iconColor} />
            </Pressable>
          ) : (
            <View className={tw.rightIconStatic}>
              <FieldIcon name={trailingIcon} size={24} color={tw.iconError} />
            </View>
          )
        ) : null}
      </View>

      {helper ? (
        <Text className={errorText ? tw.helperError : tw.helper}>{helper}</Text>
      ) : null}
    </View>
  );
}

function getTrailingIcon({
  rightIcon,
  showClearButton,
  showErrorIcon,
  value,
  visualState,
}: {
  rightIcon?: AppTextFieldIconName;
  showClearButton: boolean;
  showErrorIcon: boolean;
  value: string;
  visualState: TextFieldState;
}) {
  if (rightIcon) return rightIcon;
  if (showErrorIcon || visualState === 'error') return 'Warning';
  if (showClearButton && value.length > 0) return 'Close';
  return undefined;
}

function FieldIcon({
  name,
  size,
  color,
}: {
  name: AppTextFieldIconName;
  size: number;
  color: string;
}) {
  const iconName = name in iconAliases ? iconAliases[name as FieldIconAlias] : name;
  const Icon = fieldIcons[iconName as FieldIconName];

  return <Icon size={size} color={color} style={undefined} />;
}
