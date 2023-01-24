import React, {createContext, useReducer} from 'react';
import directoryReducer from './DirectoryReducer';

const DirectoryContext = createContext();

export const DirectoryProvider = ({children}) => {

    const directoriesFromStorage = sessionStorage.getItem('directories') ? JSON.parse(sessionStorage.getItem('directories')) : [];

    const initialState = {
        directories: directoriesFromStorage,
        directory: {},
        searchedItem: {},
        loading: false
    }

    const [state, dispatch] = useReducer(directoryReducer, initialState);

    return (
        <DirectoryContext.Provider value={{...state, dispatch}}>
            {children}
        </DirectoryContext.Provider>
    )
};

export default DirectoryContext;