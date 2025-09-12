export default function Search({searchTerm, setSearchTerm}) {
    return (
        <div className="search">
            <div>
                <img src="./search.svg" alt="search icon" />
                <input
                    type="text"
                    placeholder="Cerca un film"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    />
            </div>
        </div>
    );
}
