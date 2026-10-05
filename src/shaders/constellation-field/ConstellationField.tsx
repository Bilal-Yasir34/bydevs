"use client";

import React from "react";
import {
  BatchEffectByVariant,
  type NeuformBatchEffectProps,
} from "../neuform-isolated/NeuformBatchEffects";

export type ConstellationFieldVariant =
  | "constellation-field"
  | "particle-drift"
  | "particle-network"
  | "gateway-flow"
  | "connectivity-graph"
  | "interface-lines"
  | "defense-lines"
  | "topo-field";

export type ConstellationFieldProps = NeuformBatchEffectProps & {
  variant?: ConstellationFieldVariant | string;
};

export function ConstellationField({
  variant = "particle-drift",
  className,
  style,
  ...props
}: ConstellationFieldProps) {
  return (
    <div
      className={`threeui-background ${className ?? ""}`}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...style,
      }}
    >
      <BatchEffectByVariant variant={variant} {...props} />
    </div>
  );
}

export default ConstellationField;
