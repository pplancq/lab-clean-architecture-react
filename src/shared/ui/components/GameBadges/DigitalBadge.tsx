import cloudIcon from '@pplancq/shelter-ui-icon/icon/cloud.svg';
import { Badge } from '@Shared/ui/components/Badge/Badge';

import defaultClasses from './DigitalBadge.module.css';

export const DigitalBadge = () => {
  return (
    <Badge icon={cloudIcon} className={defaultClasses.digitalBadge}>
      Digital
    </Badge>
  );
};
