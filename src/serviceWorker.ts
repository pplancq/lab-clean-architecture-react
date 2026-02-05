import { serviceContainer } from '@Pwa/config/serviceContainer';
import { ServiceWorkerController } from '@Pwa/ServiceWorkerController';

ServiceWorkerController.initialize(serviceContainer);
