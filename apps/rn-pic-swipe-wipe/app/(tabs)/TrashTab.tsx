import React from "react";
import TrashScreen from "../screens/trash-screen/TrashScreen";
import FocusUnmount from "./FocusUnmount.wrapper";

/**
 * Route wrapper for the "Trash" tab.
 *
 * Delegates rendering to {@link TrashScreen} and wraps it with {@link FocusUnmount}
 * so the deck is unmounted when the tab loses focus.
 *
 * @returns {@link TrashScreen} inside a {@link FocusUnmount} wrapper.
 */
export default function TrashTab() {
  return (
    <FocusUnmount>
      <TrashScreen />
    </FocusUnmount>
  );
}
