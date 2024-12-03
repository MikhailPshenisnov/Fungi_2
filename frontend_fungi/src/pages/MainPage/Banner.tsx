interface BannerProps {
    image: string; // URL изображения
    title: string; // Текст заголовка
  }
  
  export const Banner: React.FC<BannerProps> = ({ image, title }) => (
    <div
      className="banner"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '643px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textShadow: '0 2px 5px rgba(0, 0, 0, 0.7)',
        fontFamily: "Raleway"
      }}
    >
      <h1 style={{ fontSize: '74px', fontWeight: "normal" }}>{title}</h1>
    </div>
  );
  

  
  