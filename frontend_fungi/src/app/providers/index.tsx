import { IWithProviderProps } from './types';
import { WithRouter } from './with-router';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '../../redux/Store.tsx';

export const Providers: React.FC<IWithProviderProps> = ({ children }) => {
    return (
        <ReduxProvider store={store}>
            <WithRouter>{children}</WithRouter>
        </ReduxProvider>
    );
};
