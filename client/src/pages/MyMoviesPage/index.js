import "./mymoviestyles.css";
import NavBar from "../../components/NavBar";

const MyMoviesPage = () => {
    const movies = new Array(14).fill(""); // Simulating 14 movie slots

    return (
        <div>
            <NavBar />
            <div className="container">
                <div className="pageHeader">
                    <h1>My Movies</h1>
                </div>
                <div className="moviesGrid">
                    {movies.map((_, index) => (
                        <div key={index} className="movieContainer">
                            <div className="movie"></div>
                            <div className="btnContainer">
                                <button>Download</button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="extendedFooter">
                    <p>Engineered by Yellow Jacket Spirit</p>
                </div>
            </div>
        </div>
    );
};

export default MyMoviesPage