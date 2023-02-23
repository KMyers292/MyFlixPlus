import React, {useContext} from 'react';
import AlertContext from '../../context/alert/AlertContext';
import {Container} from 'react-bootstrap';

const Alert = () => {

    const { alert } = useContext(AlertContext);

    return alert !== null && (
        <Container fluid className='alert-container'>
            {alert.type === 'error' && (
                <p className='alert-error'>{alert.msg}</p>
            )}
            {alert.type === 'success' && (
                <p className='alert-success'>{alert.msg}</p>
            )}
        </Container>
    )
};

export default Alert;