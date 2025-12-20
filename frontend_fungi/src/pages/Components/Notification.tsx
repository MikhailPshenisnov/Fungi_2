import { FC } from 'react';

interface NotificationProps {
    message: string;
    onClose: () => void;
}

export const Notification: FC<NotificationProps> = ({ message, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.3)', // затемнение фона
            zIndex: 1000,
        }}>
            <div style={{
                background: '#ffe8c8',
                padding: '20px 40px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                textAlign: 'center',
            }}>
                <span>{message}</span>
                <button
                    onClick={onClose}
                    style={{
                        marginLeft: '12px',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
};
