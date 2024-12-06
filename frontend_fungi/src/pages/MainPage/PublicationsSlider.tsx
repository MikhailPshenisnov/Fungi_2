export const PublicationsSlider: React.FC = () => (
    <div className="publications-slider" style={{textAlign: 'center', height: '618px', width: 'auto'}}>
        <h2 style={{ fontSize: '55px', fontWeight: 'bold', fontFamily: 'Raleway', paddingTop: '72px'}}>
        Рекомендуем прочитать!
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', marginTop: '50px'}}>

            {/* Блок со статьями */}
            <div style={{ display: 'flex', gap: '43px'}}>

                {/* Каждая статья */}
                {Array(3)
                .fill(0)
                .map((_, index) => (
                    <div
                        key={index}
                        style={{ width: '415px', height: '404px',overflow: 'hidden',
                                display: 'flex',flexDirection: 'column', borderRadius: '50px', backgroundColor: '#FFE8C5'}}
                    >

                    {/* Фото статьи */}
                    <img style={{ width: '100%', height: '202px', objectFit: 'cover'}}
                        src="/images/png/article-image.png"                        
                    />

                    {/* Название и описание */}
                    <div style={{ padding: '10px', textAlign: 'left', paddingLeft: '36px' }}>
                        <h3 style={{ fontFamily: 'Raleway', fontSize: '24px', marginBottom: '37px' }}>
                            Грибной мир Подмосковья </h3>

                        <p style={{ fontFamily: 'Raleway', fontSize: '16px'}}>
                        читать продолжение в источнике...
                        </p>
                    </div>
                    </div>
                ))}
            </div>

            {/* Кнопка "Больше статей" */}
            <div style={{ marginLeft: '44px'}}
            >
                <button style={{background: 'none', border: 'none', cursor: 'pointer'}}>
            <img style={{height: 'auto', paddingTop: '73px'}}
            src="/images/png/more-article.png"
            />
        </button>
            </div>
        </div>
    </div>
);