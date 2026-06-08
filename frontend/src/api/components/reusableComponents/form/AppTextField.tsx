import React, { useState } from 'react';
import {
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn, formTw as tw } from './formNativewind';

type IconName = React.ComponentProps<typeof Ionicons>['name'];
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
  leftIcon?: IconName;
  rightIcon?: IconName;
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
            <Ionicons name={leftIcon} size={22} color={iconColor} />
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
          onRightIconPress || trailingIcon === 'close-circle' ? (
            <TouchableOpacity
              className={tw.rightIconButton}
              onPress={handleTrailingPress}
              disabled={disabled}
              activeOpacity={0.75}
            >
              <Ionicons name={trailingIcon} size={24} color={iconColor} />
            </TouchableOpacity>
          ) : (
            <View className={tw.rightIconStatic}>
              <Ionicons name={trailingIcon} size={24} color={tw.iconError} />
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
  rightIcon?: IconName;
  showClearButton: boolean;
  showErrorIcon: boolean;
  value: string;
  visualState: TextFieldState;
}) {
  if (rightIcon) return rightIcon;
  if (showErrorIcon || visualState === 'error') return 'alert-circle';
  if (showClearButton && value.length > 0) return 'close-circle';
  return undefined;
}
