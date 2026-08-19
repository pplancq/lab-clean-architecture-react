import { Badge } from "@Shared/ui/components/Badge/Badge";
import playstationIcon from "./playstation.svg";

import defaultClasses from "./PlayStationBadge.module.css";

export const PlayStationBadge = () => (
  <Badge icon={playstationIcon} className={defaultClasses.playStationBadge}>
    PlayStation
  </Badge>
);
