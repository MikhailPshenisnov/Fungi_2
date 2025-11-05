import React, { useState } from 'react';
import './ImageUploader.css';

interface ImageUploaderProps {
    onImageUpload: (file: File | null, imageUrl?: string) => void;
    onClassify?: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    onImageUpload,
    onClassify,
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
            onImageUpload(file);
        }
    };

    const handlePaste = async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const item of clipboardItems) {
                const imageType = item.types.find((t) =>
                    t.startsWith('image/')
                );
                if (imageType) {
                    const blob = await item.getType(imageType);
                    const file = new File([blob], 'pasted.png', {
                        type: imageType,
                    });
                    const imageUrl = URL.createObjectURL(blob);
                    setPreviewUrl(imageUrl);
                    onImageUpload(file);
                    break;
                }
            }
        } catch {
            alert('Не удалось вставить изображение из буфера обмена');
        }
    };

    const handleUrl = () => {
        const url = prompt('Введите URL изображения:');
        if (url) {
            setPreviewUrl(url);
            onImageUpload(null, url);
        }
    };

    const triggerFileInput = () => {
        document.getElementById('file-input')?.click();
    };

    const clearImage = () => {
        if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        onImageUpload(null);
    };

    return (
        <div className="photo-input">
            <div className="photo-input__content">
                <div className="photo-input__header">
                    <div className="photo-input__icon"></div>
                    <h3>ФОТО</h3>
                </div>

                <div className="photo-input__area">
                    {previewUrl ? (
                        <div className="photo-input__preview">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="photo-input__image"
                            />
                        </div>
                    ) : (
                        <div className="photo-input__empty">
                            <img src="/images/svg/camera.svg" alt="Camera" />
                            <div>Загрузите изображение гриба</div>
                        </div>
                    )}

                    <input
                        id="file-input"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />

                    <div className="photo-input__buttons">
                        <button
                            className="photo-input__btn"
                            onClick={triggerFileInput}
                        >
                            <img
                                src="/images/svg/attaching_file.svg"
                                alt="File"
                            />
                            <div>ФАЙЛ</div>
                        </button>
                        <button
                            className="photo-input__btn"
                            onClick={handlePaste}
                        >
                            <img src="/images/svg/buffer.svg" alt="Buffer" />
                            <div>БУФФЕР</div>
                        </button>
                        <button
                            className="photo-input__btn"
                            onClick={handleUrl}
                        >
                            <img src="/images/svg/link.svg" alt="Link" />
                            <div>URL</div>
                        </button>
                    </div>
                </div>

                {previewUrl && (
                    <button className="classify-btn" onClick={onClassify}>
                        <h3>Классифицировать</h3>
                    </button>
                )}
            </div>
        </div>
    );
};
