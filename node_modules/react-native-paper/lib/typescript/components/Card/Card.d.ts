import * as React from 'react';
import { Animated, GestureResponderEvent, StyleProp, View, ViewStyle } from 'react-native';
import CardActions from './CardActions';
import CardContent from './CardContent';
import CardCover from './CardCover';
import CardTitle from './CardTitle';
import type { $Omit, ThemeProp } from '../../types';
import Surface from '../Surface';
declare type OutlinedCardProps = {
    mode: 'outlined';
    elevation?: never;
};
declare type ElevatedCardProps = {
    mode?: 'elevated';
    elevation?: number;
};
declare type ContainedCardProps = {
    mode?: 'contained';
    elevation?: never;
};
declare type Mode = 'elevated' | 'outlined' | 'contained';
export declare type Props = $Omit<React.ComponentProps<typeof Surface>, 'mode'> & {
    /**
     * Mode of the Card.
     * - `elevated` - Card with elevation.
     * - `contained` - Card without outline and elevation @supported Available in v5.x with theme version 3
     * - `outlined` - Card with an outline.
     */
    mode?: Mode;
    /**
     * Content of the `Card`.
     */
    children: React.ReactNode;
    /**
     * Function to execute on long press.
     */
    onLongPress?: () => void;
    /**
     * Function to execute on press.
     */
    onPress?: (e: GestureResponderEvent) => void;
    /**
     * Function to execute as soon as the touchable element is pressed and invoked even before onPress.
     */
    onPressIn?: (e: GestureResponderEvent) => void;
    /**
     * Function to execute as soon as the touch is released even before onPress.
     */
    onPressOut?: (e: GestureResponderEvent) => void;
    /**
     * The number of milliseconds a user must touch the element before executing `onLongPress`.
     */
    delayLongPress?: number;
    /**
     * If true, disable all interactions for this component.
     */
    disabled?: boolean;
    /**
     * Changes Card shadow and background on iOS and Android.
     */
    elevation?: 0 | 1 | 2 | 3 | 4 | 5 | Animated.Value;
    /**
     * Style of card's inner content.
     */
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    /**
     * @optional
     */
    theme?: ThemeProp;
    /**
     * Pass down testID from card props to touchable
     */
    testID?: string;
    /**
     * Pass down accessible from card props to touchable
     */
    accessible?: boolean;
};
declare const Card: import("../../utils/forwardRef").ForwardRefComponent<View, (OutlinedCardProps | ElevatedCardProps | ContainedCardProps) & $Omit<Omit<import("../Surface").Props, "ref"> & React.RefAttributes<View>, "mode"> & {
    /**
     * Mode of the Card.
     * - `elevated` - Card with elevation.
     * - `contained` - Card without outline and elevation @supported Available in v5.x with theme version 3
     * - `outlined` - Card with an outline.
     */
    mode?: Mode | undefined;
    /**
     * Content of the `Card`.
     */
    children: React.ReactNode;
    /**
     * Function to execute on long press.
     */
    onLongPress?: (() => void) | undefined;
    /**
     * Function to execute on press.
     */
    onPress?: ((e: GestureResponderEvent) => void) | undefined;
    /**
     * Function to execute as soon as the touchable element is pressed and invoked even before onPress.
     */
    onPressIn?: ((e: GestureResponderEvent) => void) | undefined;
    /**
     * Function to execute as soon as the touch is released even before onPress.
     */
    onPressOut?: ((e: GestureResponderEvent) => void) | undefined;
    /**
     * The number of milliseconds a user must touch the element before executing `onLongPress`.
     */
    delayLongPress?: number | undefined;
    /**
     * If true, disable all interactions for this component.
     */
    disabled?: boolean | undefined;
    /**
     * Changes Card shadow and background on iOS and Android.
     */
    elevation?: 0 | 3 | 2 | 1 | 4 | 5 | Animated.Value | undefined;
    /**
     * Style of card's inner content.
     */
    contentStyle?: StyleProp<ViewStyle>;
    style?: StyleProp<ViewStyle>;
    /**
     * @optional
     */
    theme?: ThemeProp | undefined;
    /**
     * Pass down testID from card props to touchable
     */
    testID?: string | undefined;
    /**
     * Pass down accessible from card props to touchable
     */
    accessible?: boolean | undefined;
}> & {
    Content: typeof CardContent;
    Actions: typeof CardActions;
    Cover: typeof CardCover;
    Title: typeof CardTitle;
};
export default Card;
//# sourceMappingURL=Card.d.ts.map