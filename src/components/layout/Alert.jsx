import React, {useContext} from 'react';
import {Container} from 'react-bootstrap';
import AlertContext from '../../context/alert/AlertContext';

const Alert = () => {

    const { alert } = useContext(AlertContext);

    return alert !== null && (
        <Container fluid className="alert-container">
            {alert.type === 'error' && (
                <p className="alert-error">{alert.msg}</p>
            )}
            {alert.type === 'success' && (
                <p className="alert-success">{alert.msg}</p>
            )}
        </Container>
    )
};

export default Alert;