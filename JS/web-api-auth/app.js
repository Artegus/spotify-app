
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
*/

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
