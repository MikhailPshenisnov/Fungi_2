export const SearchSection: React.FC = () => (
    <div className="search-section" style={{ padding: '75px', textAlign: 'center', width: '1652px', height: '313px' }}>
      <h2 style={{ fontSize: '55px', fontWeight: 'bold', fontFamily: 'Raleway', marginBottom: '76px' }}>
        Найди гриб мечты – от сыроежки до трюфеля.
      </h2>

      {/* Текст "Удобный поиск" */}

        <h2 style={{ fontSize: '50px', fontWeight: 'bold', fontFamily: 'Raleway', marginLeft: '10px', 
                    textAlign: 'left', marginTop: '125px'}}>
          Удобный поиск
        </h2>


      <div
        style={{
        position: 'relative',
        width: '1096px',
        height: '69px',
        display: 'flex',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderRadius: '40px',
        marginLeft: 'auto' ,
        marginTop: '-99px'
      }}
    >
        
        {/* Кнопка поиска */}
        <button
            style={{
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            marginLeft: '15px',
            }}
        >
            <img
            src="/images/search-icon.png"
            alt="Search"
            style={{ width: '50px', height: '42px' }}
            />
        </button>
        {/* Поле ввода */}
        <input
            type="text"
            placeholder="Поиск"
            style={{
            flex: '1',
            padding: '0.75rem',
            marginLeft: '10px',
            fontSize: '20px',
            border: 'none',
            outline: 'none',
            fontFamily: 'Raleway',
            }}
        />
        {/* Кнопка сортировки */}
        <button
            style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '15px',
            }}
        >
            <img
            src="/images/filter-search.png"
            alt="Sort"
            />
        </button>
        </div> 
        {/* Текстовые элементы */}
        <div
        style={{
            marginTop: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            maxWidth: '950px',
            marginLeft: 'auto',
            marginRight: '70px',
            textAlign: 'center',
            fontSize: '32px',
            fontFamily: 'Raleway',
        }}
        >
        <p style={{marginRight:'30px',}}>В нашем каталоге собраны тысячи видов грибов.</p>
        <p>Введите название или описание – и начните исследование!</p>
        </div>        
    </div>
  );
  