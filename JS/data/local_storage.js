
const LSController = (function () {

    const _saveUserPlaylist = (user) => {
        const playlist = JSON.stringify(user.playlist) // convert object to JSON string
        localStorage.setItem('playlists', playlist)
    }

    const _getUserPlaylist = () => {
        const data = localStorage.getItem('playlists')
        const playlist = JSON.parse(data) // convert JSON string to JavaScript object o value

        return playlist;
    }

    return {
        saverUserPlaylist (user) {
            return _saveUserPlaylist(user);
        },
        getUserPlaylist() {
            return _getUserPlaylist();
        }
    }

})();

export {LSController};
