import { serviceCollection } from "@Collection/serviceCollection";
import { serviceShared } from "@Shared/serviceShared";
import { serviceToast } from "@Toast/serviceCollection";
import { Container } from "inversify";

export const serviceContainer = new Container();

serviceContainer.load(serviceToast);
serviceContainer.load(serviceShared);
serviceContainer.load(serviceCollection);
