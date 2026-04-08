import { Icon, Typography } from '@pplancq/shelter-ui-react';
import { type ComponentProps, type ReactNode, useId } from 'react';

import defaultClasses from './Badge.module.css';

export type BadgeColor = 'primary' | 'secondary' | 'tertiary' | 'info' | 'success' | 'critical' | 'warning';

export type BadgeProps = Omit<ComponentProps<'span'>, 'children'> & {
  icon?: string;
  color?: BadgeColor;
  children: ReactNode;
};

export const Badge = ({ id, icon, color = 'primary', className, children, ...props }: BadgeProps) => {
  const generatedId = useId();
  const badgeId = id || generatedId;
  const badgeClasses = ['badge', defaultClasses[color], className].filter(Boolean).join(' ');

  return (
    <span className={badgeClasses} aria-describedby={badgeId} {...props}>
      {icon ? <Icon icon={icon} size="small" role="presentation" /> : null}
      <Typography as="span" id={badgeId} variant="text" size="small" className={defaultClasses.label}>
        {children}
      </Typography>
    </span>
  );
};
