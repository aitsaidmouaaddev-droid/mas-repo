import React from "react";
import ApprovedScreen from "../screens/approved-screen/ApprovedScreen";
import FocusUnmount from "./FocusUnmount.wrapper";

/**
 * Route wrapper for the "Approved" tab.
 *
 * Delegates rendering to {@link ApprovedScreen} and wraps it with {@link FocusUnmount}
 * so the deck is unmounted when the tab loses focus. Keeps routing concerns separate
 * from screen logic.
 *
 * @returns {@link ApprovedScreen} inside a {@link FocusUnmount} wrapper.
 */
export default function ApprovedTab() {
  return (
    <FocusUnmount>
      <ApprovedScreen />
    </FocusUnmount>
  );
}
