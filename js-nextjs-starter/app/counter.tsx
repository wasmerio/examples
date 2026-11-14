"use client";

import { useState } from "react";
import { Action } from "./ui";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <Action type="button" onClick={() => setCount((value) => value + 1)}>
      Clicked {count} {count === 1 ? "time" : "times"}
    </Action>
  );
}
