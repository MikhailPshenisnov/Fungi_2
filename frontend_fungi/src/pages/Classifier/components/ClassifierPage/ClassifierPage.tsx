import { ImageUploader } from '../ImageUploader/ImageUploader';
import { useState } from 'react';
import './ClassifierPage.css';
import { FungiResults } from '../FungiResults/FungiResults';
import { FungiInfo } from '../FungiInfo/FungiInfo';

export const ClassifierPage: React.FC = () => {
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [showResults, setShowResults] = useState(false);

    const handleImageUpload = (file: File | null, imageUrl?: string) => {
        if (file) {
            console.log('Uploaded file:', file);
            const url = URL.createObjectURL(file);
            setCurrentImage(url);
            setShowResults(false);
        } else if (imageUrl) {
            console.log('Uploaded from URL:', imageUrl);
            setCurrentImage(imageUrl);
            setShowResults(false);
        } else {
            setCurrentImage(null);
            setShowResults(false);
        }
    };

    const handleClassify = () => {
        setShowResults(true);
    };

    const handleClearResults = () => {
        setShowResults(false);
        setCurrentImage(null);
    };

    return (
        <div className="classifier">
            <div className="classifier_content">
                <div className="classifier_title">Классификатор грибов</div>

                <div className="classifier_blocks">
                    <ImageUploader
                        onImageUpload={handleImageUpload}
                        onClassify={handleClassify}
                    />

                    <FungiResults showResults={showResults} />

                    <FungiInfo hasData={showResults} />
                </div>
            </div>

            <div className="classifier_warning">
                <div className="warning_content">
                    ВАЖНОЕ ПРЕДУПРЕЖДЕНИЕ: Эта модель создана в учебных целях и
                    НЕ должна использоваться для определения съедобности грибов
                    в реальной жизни! Неправильное определение грибов может
                    привести к тяжелому отравлению или смерти. Всегда
                    консультируйтесь с опытными микологами!
                </div>
            </div>
        </div>
    );
};
