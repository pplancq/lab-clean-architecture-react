import { serviceCollection } from '@Collection/serviceCollection';
import { sharedServiceCollection } from '@Shared/serviceCollection';
import { serviceToast } from '@Toast/serviceCollection';
import { Container } from 'inversify';

export const serviceContainer = new Container();

serviceContainer.loadSync(serviceToast);
serviceContainer.loadSync(sharedServiceCollection);
serviceContainer.loadSync(serviceCollection);
