class Playlist {
    constructor (name) {
        this._name = name;
        this._amountOftracks = this.calculateAmountOfTracks || 0;
        this._listOfTracks = [] // Será un array con canciones
        this._totalDuration = this.calculateDuration;
    }
    // Getter
    get name () {
        return this._name;
    }
    // Setter
    set name (updatedName) {
        this._name = updatedName;
    }

    set listOfTracks(listOfTracks) {
        this._listOfTracks = listOfTracks;
    }

    calculateDuration() {
        return this._listOfTracks.reduce((accumulator, track) => accumulator + track.duration);
    }

    calculateAmountOfTracks() {
        return this._listOfTracks.length;
    }

    showPlaylist () {
        console.log(this._listOfTracks);
    }

    orderByDuration () {
        this._listOfTracks.sort((track1, track2) => track1.duration - track2.duration);
    }

    orderByName () {
        this._listOfTracks.sort((track1, track2) => track1.name.localeCompare(track2.name))
    }

    orderByAlbum () {
        this._listOfTracks.sort((track1, track2) => track1.album.localeCompare(track2.album))
    }
}