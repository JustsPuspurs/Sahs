import '../../css/Styles/Home.css';

export default function Home(){
    return(
<div className="app">
      <nav className="navbar">
        <a href="#" className="nav-link">Poga</a>
        <a href="#" className="nav-link">Poga</a>
      </nav>

      <div className="content">
        <div className="grid-container">
          <div className="grid-labels">
            {/* Column labels (A-H) */}
            <div className="column-labels">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((label, index) => (
                <div key={index} className="label-column">{label}</div>
              ))}
            </div>

            <div className="row-wrapper">
              {/* Row labels (1-8) */}
              <div className="row-labels">
                {[8, 7, 6, 5, 4, 3, 2, 1].map((number, index) => (
                  <div key={index} className="label-row">{number}</div>
                ))}
              </div>

              {/* The main grid */}
              <div className="grid-box">
                {/* Grid content can go here */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
}