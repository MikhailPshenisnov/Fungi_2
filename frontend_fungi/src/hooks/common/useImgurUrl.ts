import { useMemo } from 'react';

export const useImgurUrl = (imgurUrl: string) => {
    return useMemo(() => {
        if (!imgurUrl) return '';
        const imgurId = imgurUrl.split('/').pop();
        return `https://i.imgur.com/${imgurId}.jpg`;
    }, [imgurUrl]);
};
