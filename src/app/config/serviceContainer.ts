import { serviceCollection } from '@Collection/serviceCollection';
import { Container } from 'inversify';

export const serviceContainer = new Container();

serviceContainer.loadSync(serviceCollection);
