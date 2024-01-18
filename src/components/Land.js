import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getSearchParams } from '../actions/getter';

function Land() {

    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const queryParams = getSearchParams(search);
        
        if(queryParams['edit-password']) navigate('/account/edit-password')
        else navigate('/home')
    // eslint-disable-next-line
    }, [search])

    return <></>;
}

export default Land;