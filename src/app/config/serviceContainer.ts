import { serviceCollection } from '@Front/collection/serviceCollection';
import { Container } from 'inversify';

export const serviceContainer = new Container();

serviceContainer.loadSync(serviceCollection);
