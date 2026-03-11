import HomeScreen from "../screens/home-screen/HomeScreen";
import FocusUnmount from "./FocusUnmount.wrapper";

/**
 * Route wrapper for the "Home" tab.
 *
 * Delegates rendering to {@link HomeScreen} and wraps it with {@link FocusUnmount}
 * so the swipe deck is unmounted when the tab loses focus.
 *
 * @returns {@link HomeScreen} inside a {@link FocusUnmount} wrapper.
 */
export default function HomeTab() {
  return (
    <FocusUnmount>
      <HomeScreen />
    </FocusUnmount>
  );
}
