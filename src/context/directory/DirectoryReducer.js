const directoryReducer = (state, action) => {
    switch (action.type) {
        case 'GET_DIRECTORIES':
            return {
                ...state,
                directories: action.payload,
                loading: false
            }
        case 'GET_DIRECTORY':
            return {
                ...state,
                directory: action.payload,
                loading: false
            }
        case 'GET_SEARCHED_ITEM':
            return {
                ...state,
                searchedItem: action.payload,
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