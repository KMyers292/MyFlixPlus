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
        default:
            return state
    }
};

export default directoryReducer;