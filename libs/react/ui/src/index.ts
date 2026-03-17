/**
 * @packageDocumentation
 *
 * `@mas/react/ui` — themed React component library.
 *
 * Provides design-system primitives (atoms), composed molecules, and a
 * {@link ThemeProvider} / {@link useTheme} pair for light/dark mode.
 *
 * @example
 * ```tsx
 * import { ThemeProvider, Button, useTheme } from '@mas/react/ui';
 *
 * function App() {
 *   return (
 *     <ThemeProvider initialMode="dark">
 *       <Button variant="primary">Click me</Button>
 *     </ThemeProvider>
 *   );
 * }
 * ```
 */

// Theme
export { default as ThemeProvider, useTheme } from './ThemeContext';
export type { ThemeContextValue, ThemeProviderProps } from './ThemeContext';
export { lightTheme } from './light';
export { darkTheme } from './dark';

// Font system (web-only)
export { APP_FONTS, applyFont, removeFont } from './fonts';
export type { AppFont, FontKey } from './fonts';

// Utilities
export { default as useStyles } from './useStyles';
export type { ClassOverride, StyleOverride, UseStylesResult } from './useStyles';

// Components
export { default as Icon } from './icon/Icon';
export type { IconProps } from './icon/Icon';

export { default as Button } from './button/Button';
export type { ButtonProps, ButtonVariant, ButtonSize } from './button/Button';

export { default as Card } from './card/Card';
export type { CardProps } from './card/Card';

export { default as Logo } from './logo/Logo';
export type { LogoProps, LogoAnimation } from './logo/Logo';

export { default as ProgressBar } from './progress-bar/ProgressBar';
export type { ProgressBarProps, ProgressBarVariant } from './progress-bar/ProgressBar';

export { default as Select } from './select/Select';
export type { SelectProps, SelectOption } from './select/Select';

export { default as NavBar } from './nav-bar/NavBar';
export type { NavBarProps, NavIconPosition } from './nav-bar/NavBar';
export type { NavItem } from './nav-bar/nav.types';

export { default as SideBar } from './side-bar/SideBar';
export type { SideBarProps, SideBarSection } from './side-bar/SideBar';

export { default as FloatingMenuButton } from './floating-menu-button/FloatingMenuButton';
export type {
  FloatingMenuButtonProps,
  FloatingMenuItem,
} from './floating-menu-button/FloatingMenuButton';

// Phase 2 — Atoms
export { default as Typography } from './typography/Typography';
export type { TypographyProps } from './typography/Typography';

export { default as Input } from './input/Input';
export type { InputProps } from './input/Input';

export { default as Checkbox } from './checkbox/Checkbox';
export type { CheckboxProps } from './checkbox/Checkbox';

export { default as Radio } from './radio/Radio';
export type { RadioProps } from './radio/Radio';

export { default as Switch } from './switch/Switch';
export type { SwitchProps } from './switch/Switch';

export { default as Avatar } from './avatar/Avatar';
export type { AvatarProps } from './avatar/Avatar';

export { default as Badge } from './badge/Badge';
export type { BadgeProps } from './badge/Badge';

export { default as Tag } from './tag/Tag';
export type { TagProps } from './tag/Tag';

export { default as Divider } from './divider/Divider';
export type { DividerProps } from './divider/Divider';

export { default as Spinner } from './spinner/Spinner';
export type { SpinnerProps } from './spinner/Spinner';

export { default as Tooltip } from './tooltip/Tooltip';
export type { TooltipProps } from './tooltip/Tooltip';

export { default as Link } from './link/Link';
export type { LinkProps } from './link/Link';

export { default as Skeleton } from './skeleton/Skeleton';
export type { SkeletonProps } from './skeleton/Skeleton';

// Skeleton HOC + named skeletons
export { withSkeleton } from './skeletons/withSkeleton';
export { default as AccordionSkeleton } from './skeletons/AccordionSkeleton';
export { default as AvatarSkeleton } from './skeletons/AvatarSkeleton';
export { default as BadgeSkeleton } from './skeletons/BadgeSkeleton';
export { default as BreadcrumbSkeleton } from './skeletons/BreadcrumbSkeleton';
export { default as ButtonSkeleton } from './skeletons/ButtonSkeleton';
export { default as CardSkeleton } from './skeletons/CardSkeleton';
export { default as ContainerSkeleton } from './skeletons/ContainerSkeleton';
export { default as FormSkeleton } from './skeletons/FormSkeleton';
export { default as GridSkeleton } from './skeletons/GridSkeleton';
export { default as HeaderSkeleton } from './skeletons/HeaderSkeleton';
export { default as InputFieldSkeleton } from './skeletons/InputFieldSkeleton';
export { default as ModalSkeleton } from './skeletons/ModalSkeleton';
export { default as NavBarSkeleton } from './skeletons/NavBarSkeleton';
export { default as SideBarSkeleton } from './skeletons/SideBarSkeleton';
export { default as TableSkeleton } from './skeletons/TableSkeleton';
export { default as TabsSkeleton } from './skeletons/TabsSkeleton';
export { default as TagSkeleton } from './skeletons/TagSkeleton';
export { default as TypographySkeleton } from './skeletons/TypographySkeleton';

// Phase 2 — Molecules
export { default as InputField } from './input-field/InputField';
export type { InputFieldProps } from './input-field/InputField';

export { default as SearchBar } from './search-bar/SearchBar';
export type { SearchBarProps } from './search-bar/SearchBar';

export { default as Tabs } from './tabs/Tabs';
export type { TabsProps, TabItem } from './tabs/Tabs';

export { default as Accordion } from './accordion/Accordion';
export type { AccordionProps, AccordionItem } from './accordion/Accordion';

export { default as Alert } from './alert/Alert';
export type { AlertProps } from './alert/Alert';

export { ToastContainer, useToast } from './toast/Toast';
export type { ToastContainerProps, ToastMessage, ToastVariant } from './toast/Toast';

export { default as Modal } from './modal/Modal';
export type { ModalProps } from './modal/Modal';

export { default as DropdownMenu } from './dropdown-menu/DropdownMenu';
export type { DropdownMenuProps, DropdownMenuItem } from './dropdown-menu/DropdownMenu';

export { default as Breadcrumb } from './breadcrumb/Breadcrumb';
export type { BreadcrumbProps, BreadcrumbItem } from './breadcrumb/Breadcrumb';

export { default as Pagination } from './pagination/Pagination';
export type { PaginationProps } from './pagination/Pagination';

export { default as RadioGroup } from './radio-group/RadioGroup';
export type { RadioGroupProps, RadioGroupOption } from './radio-group/RadioGroup';

export { default as CheckboxGroup } from './checkbox-group/CheckboxGroup';
export type { CheckboxGroupProps, CheckboxGroupOption } from './checkbox-group/CheckboxGroup';

// Phase 2 — Organisms
export { default as Form } from './form/Form';
export type { FormProps } from './form/Form';

export { default as Table } from './table/Table';
export type { TableProps, TableColumn } from './table/Table';

// Phase 2 — Layout
export { default as Header } from './header/Header';
export type { HeaderProps } from './header/Header';

export { default as Container } from './container/Container';
export type { ContainerProps } from './container/Container';

export { default as Stack } from './stack/Stack';
export type { StackProps } from './stack/Stack';

export { default as Grid } from './grid/Grid';
export type { GridProps } from './grid/Grid';
