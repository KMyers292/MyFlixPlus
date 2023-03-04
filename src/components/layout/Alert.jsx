import React, {useContext} from 'react';
import AlertContext from '../../context/alert/AlertContext';

const Alert = () => {

    const { alert } = useContext(AlertContext);

    return alert !== null && (
        <div fluid className='alert-container'>
            {alert.type === 'error' && (
                <p className='alert-error'>{alert.msg}</p>
            )}
            {alert.type === 'success' && (
                <p className='alert-success'>{alert.msg}</p>
            )}
        </div>
    )
};

export default Alert;