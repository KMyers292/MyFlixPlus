const directoryReducer = (state, action) => {
    switch (action.type) {
        case 'GET_DIRECTORIES':
            return {
                ...state,
                directories: action.payload,
                loading: false
            }
        case 'GET_WATCHLIST':
            return {
                ...state,
                watchlist: action.payload,
                loading: false
            }
        case 'SET_LOADING':
            return {
                ...state,
                loading: true
            }
        case 'SET_LOADING_FALSE':
            return {
                ...state,
                loading: false
            }
        default:
            return state
    }
};

export default directoryReducer;