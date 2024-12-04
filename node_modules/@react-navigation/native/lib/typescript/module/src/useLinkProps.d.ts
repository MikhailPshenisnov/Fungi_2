import { type NavigationAction } from '@react-navigation/core';
import * as React from 'react';
import { type GestureResponderEvent } from 'react-native';
export type LinkProps<ParamList extends ReactNavigation.RootParamList, RouteName extends keyof ParamList = keyof ParamList> = ({
    href?: string;
    action?: NavigationAction;
} & {
    [Screen in keyof ParamList]: undefined extends ParamList[Screen] ? {
        screen: Screen;
        params?: ParamList[Screen];
    } : {
        screen: Screen;
        params: ParamList[Screen];
    };
}[RouteName]) | {
    href?: string;
    action: NavigationAction;
    screen?: undefined;
    params?: undefined;
};
/**
 * Hook to get props for an anchor tag so it can work with in page navigation.
 *
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 */
export declare function useLinkProps<ParamList extends ReactNavigation.RootParamList>({ screen, params, href, action, }: LinkProps<ParamList>): {
    href: string | undefined;
    accessibilityRole: "link";
    onPress: (e?: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent) => void;
};
//# sourceMappingURL=useLinkProps.d.ts.map