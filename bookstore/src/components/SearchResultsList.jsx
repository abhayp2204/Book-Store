import "../css/SearchResultsList.css"
import { SearchResult } from "./SearchResult"

function SearchResultsList({ results }) {
    return (
        <div className="results-list">
            {results.map((result, id) => {
                return <SearchResult result={result.title} key={id} />
            })}
        </div>
    )
}

export default SearchResultsList;