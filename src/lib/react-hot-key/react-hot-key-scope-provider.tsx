"use client"
import { HotkeysProvider } from "react-hotkeys-hook";

interface ReactHotKeyScopeProviderProps {
  scope: string;
  children?: React.ReactNode;
}

/**
 * Wraps children with react-hotkeys-hook's HotkeysProvider and activates the given scope.
 *
 * Reminder: when registering hotkeys in descendant components, include this scope name in the
 * `scopes` option of the `useHotkeys` hook so the handler is active for this provider.
 *
 * Example:
 *   useHotkeys('ctrl+k', () => setCount(prevCount => prevCount + 1), { scopes: ['settings'] })
 *
 * @param {ReactHotKeyScopeProviderProps} props - Component props
 * @param {string} props.scope - The name of the hotkey scope to activate
 * @param {React.ReactNode} [props.children]
 */
export function ReactHotKeyScopeProvider({ scope, children }: ReactHotKeyScopeProviderProps) {
  return (
    <HotkeysProvider initiallyActiveScopes={[scope]}>
      {children}
    </HotkeysProvider>
  );
}
