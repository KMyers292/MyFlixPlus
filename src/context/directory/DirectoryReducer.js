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
        case 'SET_LOADING':
            return {
                ...state,
                loading: true
            }
        default:
            return state
    }
};

export default directoryReducer;