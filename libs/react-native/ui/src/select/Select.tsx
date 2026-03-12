/**
 * @module Select
 * Modal-based dropdown select component supporting single and multi-select.
 *
 * ```tsx
 * import Select, { SelectOption } from '@mas/rn/ui/select/Select';
 *
 * const options: SelectOption[] = [
 *   { label: 'All', value: 'all', startIcon: { type: 'vector', name: 'list' } },
 *   { label: 'Photos', value: 'photo' },
 * ];
 *
 * <Select options={options} value={active} onSelect={setActive} />
 * ```
 *
 * @see {@link SelectProps} — prop reference
 * @see {@link SelectOption} — option shape
 * @see {@link makeSelectStyles} — style factory in select.style.ts
 */
import useResultedStyle from '../useResultedStyle';
import { useTheme } from '../ThemeContext';
import type { IconProps } from '../icon/Icon';
import Icon from '../icon/Icon';
import React, { useMemo, useRef, useState } from 'react';
import type { ViewStyle } from 'react-native';
import { FlatList, Modal, Pressable, Text, TouchableWithoutFeedback, View } from 'react-native';
import type { SelectStyles } from './select.style';
import makeSelectStyles from './select.style';

/**
 * A single option entry in a {@link Select} dropdown.
 */
export interface SelectOption {
  /** Display text for the option. */
  label: string;
  /** Value submitted to `onSelect` when the option is chosen. */
  value: string | number;
  /** Icon rendered before the option label. */
  startIcon?: IconProps;
  /** Icon rendered after the option label (overrides default checkmark when selected). */
  endIcon?: IconProps;
}

/**
 * Props for the {@link Select} component.
 */
export interface SelectProps {
  /** Array of selectable options. */
  options: SelectOption[];
  /** Currently selected value (single) or array of values (multi-select). */
  value: any;
  /**
   * Placeholder text shown when nothing is selected.
   * @defaultValue `"Select..."`
   */
  placeholder?: string;
  /** Called when the user selects or deselects an option. */
  onSelect: (value: any) => void;
  /**
   * Enables multi-select mode — `value` becomes an array.
   * @defaultValue `false`
   */
  multiple?: boolean;
  /**
   * Where the dropdown menu appears relative to the trigger.
   * @defaultValue `"bottom"`
   */
  menuPosition?: 'top' | 'bottom';
  /**
   * Pixel gap between the trigger bottom and the menu top.
   * @defaultValue `4`
   */
  offset?: number;
  /**
   * Icon displayed inside the trigger button.
   * @defaultValue `{ type: "vector", name: "chevron-down" }`
   */
  triggerIcon?: IconProps;
  /** `testID` forwarded to the trigger `Pressable` for testing. */
  testID?: string;
  /** Partial style overrides merged on top of base select styles. */
  stylesOverride?: Partial<SelectStyles>;
  /**
   * When `true`, option labels are hidden and only `startIcon` is shown.
   * @defaultValue `false`
   */
  iconsOnly?: boolean;
}

/**
 * Dropdown select with Modal-based menu, icon support, and multi-select capability.
 *
 * Uses `View.measure` to position the menu relative to the trigger.
 * In `iconsOnly` mode, only `startIcon` is rendered for each option.
 *
 * @param props - See {@link SelectProps}.
 */
export default function Select({
  options,
  value,
  placeholder = 'Select...',
  onSelect,
  multiple = false,
  menuPosition = 'bottom',
  offset = 4,
  triggerIcon = { type: 'vector', name: 'chevron-down' },
  testID,
  stylesOverride,
  iconsOnly = false,
}: SelectProps) {
  const { theme } = useTheme();
  // ✅ On mémoïse les styles avec le thème en dépendance
  const styles = useResultedStyle<SelectStyles>(theme, makeSelectStyles, stylesOverride);
  const [isOpen, setIsOpen] = useState(false);
  const [layout, setLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const triggerRef = useRef<View>(null);

  const openMenu = () => {
    triggerRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setLayout({ x: pageX, y: pageY, width, height });
      setIsOpen(true);
    });
  };

  const displayText = useMemo(() => {
    if (multiple && Array.isArray(value)) {
      if (value.length === 0) return placeholder;
      return options
        .filter((o) => value.includes(o.value))
        .map((o) => o.label)
        .join(', ');
    }
    return options.find((o) => o.value === value)?.label || placeholder;
  }, [value, options, multiple, placeholder]);

  const menuDynamicStyle = useMemo(
    (): ViewStyle => ({
      top: menuPosition === 'bottom' ? layout.y + layout.height + offset : layout.y - 200,
      left: layout.x,
      width: layout.width,
      maxHeight: 300,
    }),
    [layout, menuPosition, offset],
  );

  const baseColor = theme.colors.onSurface ?? theme.colors.text;

  return (
    <View style={styles.container} ref={triggerRef} collapsable={false}>
      <Pressable
        onPress={openMenu}
        style={[styles.trigger, isOpen && styles.triggerActive]}
        testID={testID}
      >
        <Text style={styles.triggerLabel} numberOfLines={1}>
          {displayText}
        </Text>
        <Icon {...triggerIcon} size={20} color={theme.colors.onSurface ?? theme.colors.text} />
      </Pressable>

      <Modal visible={isOpen} transparent animationType="fade" testID="select-modal">
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View style={styles.overlay} testID="select-overlay">
            <View style={[styles.menu, menuDynamicStyle]} testID="select-menu">
              <FlatList
                data={options}
                keyExtractor={(item) => item.value.toString()}
                renderItem={({ item }) => {
                  const isSelected = multiple ? value?.includes(item.value) : value === item.value;
                  return (
                    <Pressable
                      onPress={() => {
                        if (multiple) {
                          const newValue = Array.isArray(value) ? [...value] : [];
                          const idx = newValue.indexOf(item.value);
                          if (idx > -1) newValue.splice(idx, 1);
                          else newValue.push(item.value);
                          onSelect(newValue);
                        } else {
                          onSelect(item.value);
                          setIsOpen(false);
                        }
                      }}
                      style={[styles.optionItem, isSelected && styles.optionSelected]}
                    >
                      {/* START ICON */}
                      {item.startIcon && (
                        <Icon
                          {...item.startIcon}
                          size={18}
                          color={isSelected ? theme.colors.primary : baseColor}
                        />
                      )}

                      {!iconsOnly && (
                        <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                          {item.label}
                        </Text>
                      )}
                      {/* END ICON (Default to checkmark if selected) */}
                      {!iconsOnly && item.endIcon && (
                        <Icon
                          {...item.endIcon}
                          size={16}
                          color={isSelected ? theme.colors.primary : baseColor}
                        />
                      )}
                    </Pressable>
                  );
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
