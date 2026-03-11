/**
 * @module Button
 * Pressable button atom supporting icons, variants, and sizes.
 *
 * ```tsx
 * import Button from '@mas/rn/ui/button/Button';
 *
 * <Button label="Save" onPress={save} variant="primary" size="md" />
 * <Button onPress={del} icon={{ type: 'vector', name: 'trash' }} variant="danger" />
 * ```
 *
 * @see {@link ButtonProps} — prop reference
 * @see {@link makeButtonStyles} — style factory in button.style.ts
 */
import useResultedStyle from '../useResultedStyle';
import { useTheme } from '../ThemeContext';
import Icon from '../icon/Icon';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import type { ButtonIconPosition, ButtonSize, ButtonStyles, ButtonVariant } from './button.style';
import makeButtonStyles, {
  getButtonIconColor,
  getButtonIconSize,
  getButtonTextStyleKey,
  getFlexDirection,
} from './button.style';

/**
 * Props for the {@link Button} component.
 */
export interface ButtonProps {
  /** Optional text label rendered inside the button. */
  label?: string;
  /** Partial style overrides merged on top of the base theme styles. */
  stylesOverride?: Partial<ButtonStyles>;
  /** Called when the button is pressed. */
  onPress: () => void;
  /**
   * Visual variant controlling background and text colour.
   * @defaultValue `"primary"`
   */
  variant?: ButtonVariant;
  /**
   * Size controlling padding and icon dimensions.
   * @defaultValue `"md"`
   */
  size?: ButtonSize;
  /**
   * Disables interaction and reduces opacity.
   * @defaultValue `false`
   */
  disabled?: boolean;
  /** Shorthand for `startIcon`. Ignored when `startIcon` is also provided. */
  icon?: any;
  /** Icon rendered before the label. Accepts any {@link IconProps} shape. */
  startIcon?: any;
  /** Icon rendered after the label. Accepts any {@link IconProps} shape. */
  endIcon?: any;
  /**
   * Position of the icon relative to the label.
   * @defaultValue `"left"`
   */
  iconPosition?: ButtonIconPosition;
  /**
   * Gap (px) between icon and label.
   * @defaultValue `8`
   */
  gap?: number;
  /** `testID` forwarded to the root `Pressable` for testing. */
  testID?: string;
}

/**
 * Pressable button with icon support, multiple variants, and composable styles.
 *
 * Uses {@link useResultedStyle} to merge base theme styles with {@link ButtonProps.stylesOverride}.
 * Accepts a `startIcon` / `icon` shorthand and an optional `endIcon`.
 *
 * @param props - See {@link ButtonProps}.
 */
export default function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  startIcon,
  endIcon,
  iconPosition = 'left',
  gap = 8,
  stylesOverride,
  testID,
}: ButtonProps) {
  const { theme } = useTheme();

  // ✅ Utilisation du hook pour fusionner Thème + Overrides
  const styles = useResultedStyle<ButtonStyles>(theme, makeButtonStyles, stylesOverride);

  const textKey = getButtonTextStyleKey(variant);
  const iconColor = getButtonIconColor(theme, variant);
  const iconSize = getButtonIconSize(size);

  const finalStartIcon = startIcon ?? icon;
  const finalEndIcon = endIcon;

  const hasText = Boolean(label);
  const hasAnyIcon = Boolean(finalStartIcon || finalEndIcon);

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={onPress}
      // On combine les styles de base, de taille et de variante
      style={({ pressed }) => [
        styles[size],
        styles[variant],
        styles.base,
        disabled && styles.disabled,
        pressed && !disabled ? { opacity: 0.8 } : null,
      ]}
    >
      <View
        style={[
          styles.content, // ✅ Remplace "local"
          {
            flexDirection: getFlexDirection(iconPosition),
            gap: hasText && hasAnyIcon ? gap : 0,
          },
        ]}
      >
        {finalStartIcon && (
          <Icon
            {...finalStartIcon}
            size={finalStartIcon.size ?? iconSize}
            color={finalStartIcon.color ?? iconColor}
            stylesOverride={styles.icon} // ✅ On passe l'override à l'atome Icon
          />
        )}

        {hasText && <Text style={[styles.textBase, styles[textKey]]}>{label}</Text>}

        {finalEndIcon && (
          <Icon
            {...finalEndIcon}
            size={finalEndIcon.size ?? iconSize}
            color={finalEndIcon.color ?? iconColor}
            stylesOverride={styles.icon}
          />
        )}
      </View>
    </Pressable>
  );
}
