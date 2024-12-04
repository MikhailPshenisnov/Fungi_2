"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLinking = useLinking;
var _core = require("@react-navigation/core");
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _extractPathFromURL = require("./extractPathFromURL.js");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const linkingHandlers = [];
function useLinking(ref, {
  enabled = true,
  prefixes,
  filter,
  config,
  getInitialURL = () => Promise.race([_reactNative.Linking.getInitialURL(), new Promise(resolve => {
    // Timeout in 150ms if `getInitialState` doesn't resolve
    // Workaround for https://github.com/facebook/react-native/issues/25675
    setTimeout(resolve, 150);
  })]),
  subscribe = listener => {
    const callback = ({
      url
    }) => listener(url);
    const subscription = _reactNative.Linking.addEventListener('url', callback);

    // Storing this in a local variable stops Jest from complaining about import after teardown
    // @ts-expect-error: removeEventListener is not present in newer RN versions
    const removeEventListener = _reactNative.Linking.removeEventListener?.bind(_reactNative.Linking);
    return () => {
      // https://github.com/facebook/react-native/commit/6d1aca806cee86ad76de771ed3a1cc62982ebcd7
      if (subscription?.remove) {
        subscription.remove();
      } else {
        removeEventListener?.('url', callback);
      }
    };
  },
  getStateFromPath = _core.getStateFromPath,
  getActionFromState = _core.getActionFromState
}, onUnhandledLinking) {
  const independent = (0, _core.useNavigationIndependentTree)();
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      return undefined;
    }
    if (independent) {
      return undefined;
    }
    if (enabled !== false && linkingHandlers.length) {
      console.error(['Looks like you have configured linking in multiple places. This is likely an error since deep links should only be handled in one place to avoid conflicts. Make sure that:', "- You don't have multiple NavigationContainers in the app each with 'linking' enabled", '- Only a single instance of the root component is rendered', _reactNative.Platform.OS === 'android' ? "- You have set 'android:launchMode=singleTask' in the '<activity />' section of the 'AndroidManifest.xml' file to avoid launching multiple instances" : ''].join('\n').trim());
    }
    const handler = Symbol();
    if (enabled !== false) {
      linkingHandlers.push(handler);
    }
    return () => {
      const index = linkingHandlers.indexOf(handler);
      if (index > -1) {
        linkingHandlers.splice(index, 1);
      }
    };
  }, [enabled, independent]);

  // We store these options in ref to avoid re-creating getInitialState and re-subscribing listeners
  // This lets user avoid wrapping the items in `React.useCallback` or `React.useMemo`
  // Not re-creating `getInitialState` is important coz it makes it easier for the user to use in an effect
  const enabledRef = React.useRef(enabled);
  const prefixesRef = React.useRef(prefixes);
  const filterRef = React.useRef(filter);
  const configRef = React.useRef(config);
  const getInitialURLRef = React.useRef(getInitialURL);
  const getStateFromPathRef = React.useRef(getStateFromPath);
  const getActionFromStateRef = React.useRef(getActionFromState);
  React.useEffect(() => {
    enabledRef.current = enabled;
    prefixesRef.current = prefixes;
    filterRef.current = filter;
    configRef.current = config;
    getInitialURLRef.current = getInitialURL;
    getStateFromPathRef.current = getStateFromPath;
    getActionFromStateRef.current = getActionFromState;
  });
  const getStateFromURL = React.useCallback(url => {
    if (!url || filterRef.current && !filterRef.current(url)) {
      return undefined;
    }
    const path = (0, _extractPathFromURL.extractPathFromURL)(prefixesRef.current, url);
    return path !== undefined ? getStateFromPathRef.current(path, configRef.current) : undefined;
  }, []);
  const getInitialState = React.useCallback(() => {
    let state;
    if (enabledRef.current) {
      const url = getInitialURLRef.current();
      if (url != null) {
        if (typeof url !== 'string') {
          return url.then(url => {
            const state = getStateFromURL(url);
            if (typeof url === 'string') {
              // If the link were handled, it gets cleared in NavigationContainer
              onUnhandledLinking((0, _extractPathFromURL.extractPathFromURL)(prefixes, url));
            }
            return state;
          });
        } else {
          onUnhandledLinking((0, _extractPathFromURL.extractPathFromURL)(prefixes, url));
        }
      }
      state = getStateFromURL(url);
    }
    const thenable = {
      then(onfulfilled) {
        return Promise.resolve(onfulfilled ? onfulfilled(state) : state);
      },
      catch() {
        return thenable;
      }
    };
    return thenable;
  }, [getStateFromURL, onUnhandledLinking, prefixes]);
  React.useEffect(() => {
    const listener = url => {
      if (!enabled) {
        return;
      }
      const navigation = ref.current;
      const state = navigation ? getStateFromURL(url) : undefined;
      if (navigation && state) {
        // If the link were handled, it gets cleared in NavigationContainer
        onUnhandledLinking((0, _extractPathFromURL.extractPathFromURL)(prefixes, url));
        const rootState = navigation.getRootState();
        if (state.routes.some(r => !rootState?.routeNames.includes(r.name))) {
          return;
        }
        const action = getActionFromStateRef.current(state, configRef.current);
        if (action !== undefined) {
          try {
            navigation.dispatch(action);
          } catch (e) {
            // Ignore any errors from deep linking.
            // This could happen in case of malformed links, navigation object not being initialized etc.
            console.warn(`An error occurred when trying to handle the link '${url}': ${typeof e === 'object' && e != null && 'message' in e ? e.message : e}`);
          }
        } else {
          navigation.resetRoot(state);
        }
      }
    };
    return subscribe(listener);
  }, [enabled, getStateFromURL, onUnhandledLinking, prefixes, ref, subscribe]);
  return {
    getInitialState
  };
}
//# sourceMappingURL=useLinking.native.js.map