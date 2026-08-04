import { Icon, Typography } from "@pplancq/shelter-ui-react";
import { type ComponentProps, type ReactNode, useId } from "react";

import defaultClasses from "./Badge.module.css";

export type BadgeColor = "primary" | "secondary" | "tertiary" | "info" | "success" | "critical" | "warning";

export type BadgeProps = Omit<ComponentProps<"span">, "children"> & {
  icon?: string;
  color?: BadgeColor;
  children: ReactNode;
};

export const Badge = ({ id, icon, color = "primary", className, children, ...props }: BadgeProps) => {
  const generatedId = useId();
  const labelId = id ? `${id}-label` : generatedId;
  const badgeClasses = ["badge", defaultClasses[color], className].filter(Boolean).join(" ");

  return (
    <span id={id} className={badgeClasses} {...props} aria-describedby={labelId}>
      {icon ? <Icon icon={icon} size="small" role="presentation" /> : null}
      <Typography as="span" id={labelId} variant="text" size="small">
        {children}
      </Typography>
    </span>
  );
};
