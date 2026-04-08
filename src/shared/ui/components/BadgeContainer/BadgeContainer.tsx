import type { PropsWithChildren } from 'react';

import defaultClasses from './BadgeContainer.module.css';

export type BadgeContainerProps = PropsWithChildren;

export const BadgeContainer = (props: BadgeContainerProps) => {
  return <div className={defaultClasses.container} {...props} />;
};
