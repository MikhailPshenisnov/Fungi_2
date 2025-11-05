import React from 'react';
import './FungiResults.css';

interface FungiResultsProps {
    className?: string;
    showResults: boolean;
}

export const FungiResults: React.FC<FungiResultsProps> = ({
    className = '',
    showResults,
}) => {
    return (
        <div className={`results_block ${className}`}>
            <div className="block_content">
                <div className="block_header">
                    <div className="header_icon"></div>
                    <h3>РЕЗУЛЬТАТЫ</h3>
                </div>

                {showResults ? (
                    <div className="results_area">
                        <div className="fungi-results">
                            <div className="fungi-card">
                                <div className="results-content">
                                    <div className="probability_title">
                                        Лисичка обыкновенная
                                    </div>
                                    <div className="probabilit_subtitle">
                                        лат. Cantharēllus cibārius
                                    </div>

                                    <div className="probability-bars">
                                        <div className="probability-item">
                                            <div className="probability-label">
                                                Лисичка обыкновенная
                                            </div>
                                            <div className="probability-bar">
                                                <div className="bar-background">
                                                    <div
                                                        className="bar-fill edible"
                                                        style={{ width: '59%' }}
                                                    ></div>
                                                    <div className="probability-value">
                                                        59%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="probability-item">
                                            <div className="probability-label">
                                                Бледная поганка
                                            </div>
                                            <div className="probability-bar">
                                                <div className="bar-background">
                                                    <div
                                                        className="bar-fill poisonous"
                                                        style={{ width: '34%' }}
                                                    ></div>

                                                    <div className="probability-value">
                                                        34%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="probability-item">
                                            <div className="probability-label">
                                                Белый гриб
                                            </div>
                                            <div className="probability-bar">
                                                <div className="bar-background">
                                                    <div
                                                        className="bar-fill confidence"
                                                        style={{ width: '17%' }}
                                                    ></div>
                                                    <div className="probability-value">
                                                        17%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="probability-item">
                                            <div className="probability-label">
                                                Кабачок
                                            </div>
                                            <div className="probability-bar">
                                                <div className="bar-background">
                                                    <div
                                                        className="bar-fill accuracy"
                                                        style={{ width: '9%' }}
                                                    ></div>
                                                    <div className="probability-value">
                                                        9%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="results_area-empty">
                        <div className="input_empty">
                            <div>
                                Выполните классификацию
                                <br />
                                для отображения результатов
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
