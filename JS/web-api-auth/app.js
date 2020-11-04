
/**
 * First example with fetch, using only one parameter to test it.
 * 
 */

/*
fetch('https://reqres.in/api/users/')
    .then(result => {
        if (result.ok) {
            console.log('todo bien master')
            result.json()
            .then(data => console.log(data))
        } else {
            console.log('AHH. Un fallo!')
        }
    })
    .catch(error => console.log(error))


fetch('https://reqres.in/api/users/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        name: 'user1'
    })
}).then(result => {
    return result.json();
}).then(data => console.log(data)) // capturo el promise que devuelte result.json()
    .catch(error => console.log(error))
*/

const client_id = '49a52023a4f447ce86507bc0e636fed1'; // Your client ID
const client_secret = '39c63715bd964d58af65657966b99172'; // Your client secrect



const _getToken = () => {
    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)
        },
        body: 'grant_type=client_credentials'
    }).then(result => {
        return result.json();
    }).then(data => { 
        token=data['access_token'];
        console.log(token);
    }).catch(error => console.log(error))
}


const _getGenres = (token) => {
    fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US&limit=10', {
        method : 'GET',
        headers : {
            'Authorization' : 'Bearer ' + token
        }
    }).then(result => {
        return result.json();
    }).then(data => {
        album = data;
        console.log(data)
    })
}



_getToken();
var token;
_getGenres(token);
var token;
var albums;













