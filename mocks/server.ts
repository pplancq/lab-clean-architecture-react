import { getSvg200 } from '@Mocks/handlers/svgHandlers';
import { setupServer } from 'msw/node';

export const server = setupServer(getSvg200);
