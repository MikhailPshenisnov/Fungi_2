export const TeamSection: React.FC = () => (
    <div className="team-section" style={{height: '779px', padding: '100px'}}>
        <h2 style={{ fontSize: '64px', fontWeight: 'bold', fontFamily: 'Raleway', paddingTop: '72px'}}>
        МЫ КОМАНДА
        </h2>

        <h2 style={{ fontSize: '96px', fontWeight: 'bold', fontFamily: 'Raleway', }}>
        Fungi
        </h2>  

        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '1800px' }}>
            <img style={{marginTop: '-232px', }}
            src="/images/png/mainpage-mushroom.png"
            />
        </div>

        <h2 style={{ fontSize: '64px', fontWeight: 'bold', fontFamily: 'Raleway', maxWidth: '643px', paddingLeft: '273px',
            marginTop: '-454px'
        }}>
        - твой лучший друг в изучении грибов
        </h2>
        
        <button style={{background: 'none', border: 'none', cursor: 'pointer'}}>
            <img style={{height: 'auto', paddingTop: '73px'}}
            src="/images/png/more-about-us.png"
            />
        </button>
    </div>
);