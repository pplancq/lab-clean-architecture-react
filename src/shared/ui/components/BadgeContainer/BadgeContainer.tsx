import type { ComponentProps } from 'react';

import defaultClasses from './BadgeContainer.module.css';

export type BadgeContainerProps = ComponentProps<'div'>;

export const BadgeContainer = ({ className, ...props }: BadgeContainerProps) => {
  const containerClassName = [defaultClasses.container, className].filter(Boolean).join(' ');

  return <div className={containerClassName} {...props} />;
};
