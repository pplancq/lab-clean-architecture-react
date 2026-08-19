import { Badge } from "@Shared/ui/components/Badge/Badge";
import xboxIcon from "./xbox.svg";

import defaultClasses from "./XboxBadge.module.css";

export const XboxBadge = () => (
  <Badge icon={xboxIcon} className={defaultClasses.xboxBadge}>
    Xbox
  </Badge>
);
