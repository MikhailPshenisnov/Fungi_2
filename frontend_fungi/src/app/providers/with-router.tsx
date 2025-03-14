import { BrowserRouter } from 'react-router-dom';
import { IWithProviderProps } from './types';

export const WithRouter: React.FC<IWithProviderProps> = ({ children }) => {
    return (
        <BrowserRouter
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
            {children}
        </BrowserRouter>
    );
};
