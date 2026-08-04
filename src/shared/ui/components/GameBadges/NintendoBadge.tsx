import { Badge } from "@Shared/ui/components/Badge/Badge";
import nintendoIcon from "./nintendo-switch.svg";

import defaultClasses from "./NintendoBadge.module.css";

export const NintendoBadge = () => {
  return (
    <Badge icon={nintendoIcon} className={defaultClasses.nintendoBadge}>
      Nintendo
    </Badge>
  );
};
