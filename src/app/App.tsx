import { queryClient } from '@Front/app/config/queryClientConfig';
import { Providers } from '@Front/app/providers/Providers/Providers';
import { Router } from '@Front/app/routing/Router';

import '@Front/app/assets/css';

type AppProps = {
  basename?: string;
};

export const App = ({ basename }: AppProps) => {
  return (
    <Providers queryClient={queryClient}>
      <Router basename={basename} />
    </Providers>
  );
};
