import * as React from 'react';
import { Animated, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';
type HoverEffectProps = {
    color?: string;
    hoverOpacity?: number;
    activeOpacity?: number;
};
export type Props = Omit<PressableProps, 'style'> & {
    pressColor?: string;
    pressOpacity?: number;
    hoverEffect?: HoverEffectProps;
    style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
    href?: string;
    children: React.ReactNode;
};
/**
 * PlatformPressable provides an abstraction on top of Pressable to handle platform differences.
 */
export declare function PlatformPressable({ disabled, onPress, onPressIn, onPressOut, android_ripple, pressColor, pressOpacity, hoverEffect, style, children, ...rest }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PlatformPressable.d.ts.map