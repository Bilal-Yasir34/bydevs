import { CSSProperties, ReactNode } from "react";
import {
  PlasmaButton,
  IgnitionButton,
  InductionButton,
  TactileButton,
  ThinkingButton,
  StarPortal,
  DotBorderButton,
  type NeuformIsolatedEffectProps,
} from "../neuform-isolated/NeuformIsolatedEffects";

export type ShaderButtonsVariant =
  | "plasma-button"
  | "plasma"
  | "ignition-button"
  | "ignition"
  | "induction-button"
  | "induction"
  | "tactile-button"
  | "tactile"
  | "thinking-button"
  | "thinking"
  | "star-portal"
  | "dot-border-button"
  | string;

export type ShaderButtonsProps = NeuformIsolatedEffectProps & {
  variant?: ShaderButtonsVariant;
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
};

export function ShaderButtons({
  variant = "plasma-button",
  mode = "dark",
  hue = 0,
  saturation = 1,
  brightness = 1,
  className,
  style,
  children,
  ...props
}: ShaderButtonsProps) {
  switch (variant) {
    case "plasma-button":
    case "plasma":
      return (
        <PlasmaButton
          mode={mode}
          hue={hue}
          saturation={saturation}
          brightness={brightness}
          className={className}
          style={style}
          {...props}
        />
      );
    case "ignition-button":
    case "ignition":
      return (
        <IgnitionButton
          mode={mode}
          hue={hue}
          saturation={saturation}
          brightness={brightness}
          className={className}
          style={style}
          {...props}
        />
      );
    case "induction-button":
    case "induction":
      return (
        <InductionButton
          mode={mode}
          hue={hue}
          saturation={saturation}
          brightness={brightness}
          className={className}
          style={style}
          {...props}
        />
      );
    case "tactile-button":
    case "tactile":
      return (
        <TactileButton
          mode={mode}
          hue={hue}
          saturation={saturation}
          brightness={brightness}
          className={className}
          style={style}
          {...props}
        />
      );
    case "thinking-button":
    case "thinking":
      return (
        <ThinkingButton
          mode={mode}
          hue={hue}
          saturation={saturation}
          brightness={brightness}
          className={className}
          style={style}
          {...props}
        />
      );
    case "star-portal":
      return (
        <StarPortal
          mode={mode}
          hue={hue}
          saturation={saturation}
          brightness={brightness}
          className={className}
          style={style}
          {...props}
        />
      );
    case "dot-border-button":
      return (
        <DotBorderButton
          mode={mode}
          hue={hue}
          saturation={saturation}
          brightness={brightness}
          className={className}
          style={style}
          {...props}
        />
      );
    default:
      return (
        <PlasmaButton
          mode={mode}
          hue={hue}
          saturation={saturation}
          brightness={brightness}
          className={className}
          style={style}
          {...props}
        />
      );
  }
}

export default ShaderButtons;
