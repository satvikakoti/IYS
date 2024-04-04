/**
 * getUserId.js: Function component that is used to fetch the user ID by fetching token data
 *
 * Michelle Peters
 *
 * 
 * Date Created: 10/29/2020
 * Last Updated: 11/25/2020
 */

import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';

function GetUserId () {
    const [ userId, setUserId ] = useState([]);
    const [ token ]             = useCookies(['user-token'])

    /**
     * Gets the logged in users id corresponding to token
     * 
     * Michelle Peters
     */
    useEffect( () => {
        if (token['user-token'] != 'undefined') {
            axios.get(`${process.env.REACT_APP_API_URL}/IYS/tokens/${token['user-token']}/`)
            .then( response => {
                // set user id corresponding to token of logged in user
                setUserId(response.data.user)
            }).catch(error => {
                console.log(error)
            })
        }
    }, [])

    return [userId]
}

export default GetUserId;
