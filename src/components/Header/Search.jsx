import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import axios from 'axios';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [recentSearches, setRecentSearches] = useState(JSON.parse(localStorage.getItem('recentSearches')) || []);
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const inputRef = useRef(null);
    const searchResultRef = useRef(null);
    const searchRecentRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target) && searchResultRef.current && !searchResultRef.current.contains(event.target) && searchRecentRef.current && !searchRecentRef.current.contains(event.target)) {
                setIsActive(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (query.length >= 2) {
            axios.get(`/api/search/autocomplete?q=${query}`)
                .then(response => {
                    setResults(response.data);
                })
                .catch(error => {
                    console.error("There was an error with the search:", error);
                });
        } else {
            setResults([]);
        }
    }, [query]);

    useEffect(() => {
        setIsActive(false);
    }, [location]);

    const goToSearchResult = (searchQuery) => {
        const newRecentSearches = [...recentSearches, searchQuery];
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
        setRecentSearches(newRecentSearches);
        navigate(`/search-result?query=${searchQuery}`);
    };

    const removeSearchHistoryItem = (searchQuery, index) => {
        const newRecentSearches = recentSearches.filter((_, i) => i !== index);
        localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
        setRecentSearches(newRecentSearches);
    };

    const clearSearchHistory = (event) => {
        event.preventDefault();
        localStorage.removeItem('recentSearches');
        setRecentSearches([]);
    };

    return (<div className="header__btn" ref={inputRef}>
        <input
            placeholder="Найти на miko"
            value={query}

            onChange={e => setQuery(e.target.value)}
            onClick={() => setIsActive(true)}
        />
        {isActive && (<div ref={searchResultRef} className="search__result">
            {query && (<div className="search__result-item" onClick={() => goToSearchResult(query)}>
                {query}
            </div>)}
            {results.map((result, index) => (
                <div key={index} className="search__result-item" onClick={() => goToSearchResult(result)}>
                    {result}
                </div>))}
        </div>)}
        {!query && recentSearches.length > 0 && isActive && (<div ref={searchRecentRef} className="search__recent">
            <div className="df">
                <div className='h3'>Вы недавно искали:</div>
                <div onClick={clearSearchHistory} className='delete'>Очистить историю</div>
            </div>
            {recentSearches.map((search, index) => (<div key={index} className="search__recent-item">
              <div onClick={() => goToSearchResult(search)}>
                {search}
              </div>
                <div>
                    <div className='delete' onClick={() => removeSearchHistoryItem(search, index)}>✖</div>

                </div>
            </div>))}
        </div>)}
        <div className={`overlay ${isActive ? 'active' : ''}`} onClick={() => setIsActive(false)}></div>

    </div>);
};

export default Search;
