
const LSController = (function () {

    const _saveUserPlaylists = (user) => {
        const playlists = JSON.stringify(user.playlists) // convert object to JSON string
        localStorage.setItem('playlists', playlists)
    }

    const _getUserPlaylists = () => {
        const data = localStorage.getItem('playlists')
        const playlists = JSON.parse(data) // convert JSON string to JavaScript object o value

        return playlists;
    }

    return {
        saverUserPlaylists (user) {
            return _saveUserPlaylists(user);
        },
        getUserPlaylists() {
            return _getUserPlaylists();
        }
    }

})();

export {LSController};
