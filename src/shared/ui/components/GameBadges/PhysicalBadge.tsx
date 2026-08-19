import compactDiscIcon from "@pplancq/shelter-ui-icon/icon/compact-disc.svg";
import { Badge } from "@Shared/ui/components/Badge/Badge";

import defaultClasses from "./PhysicalBadge.module.css";

export const PhysicalBadge = () => (
  <Badge icon={compactDiscIcon} className={defaultClasses.physicalBadge}>
    Physical
  </Badge>
);
