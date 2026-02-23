import { serviceCollection } from '@Collection/serviceCollection';
import { sharedServiceCollection } from '@Shared/serviceCollection';
import { Container } from 'inversify';

export const serviceContainer = new Container();

serviceContainer.loadSync(sharedServiceCollection);
serviceContainer.loadSync(serviceCollection);
