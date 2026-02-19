import { HEADERS, MIME_TYPES } from '@Shared/infrastructure/fetchApi/constant';
import { delay, http, HttpResponse } from 'msw';

export const getSvg200 = http.get('*.svg', async () => {
  await delay();

  const svg = '<svg width="100" height="100"><circle cx="50" cy="50" r="40"/></svg>';

  return HttpResponse.text(svg, { headers: [[HEADERS.contentType, MIME_TYPES.svg]] });
});
