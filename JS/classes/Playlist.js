class Playlist {
    constructor (name, listOfTracks = [], totalDuration = 0) { // Add total duration (optional)
        this._name = name;
        this._amountOftracks = listOfTracks.length;
        this._listOfTracks = listOfTracks;// Será un array con canciones
        this._totalDuration = totalDuration;
        this._owner = 'Default User'
    }
    // Getter
    get name() { // get playlist name
        return this._name;
    }
    // Setter
    set name(updatedName) {
        this._name = updatedName;
    }

    set listOfTracks(listOfTracks) { // Add tracks
        this._listOfTracks.push(...listOfTracks);
        this._totalDuration = this.calculateDuration();
        this._amountOftracks = this.calculateAmountOfTracks();
    }

    removeTracks(tracksTodelete = []) {
        //this._listOfTracks = this._listOfTracks.filter((track) => !tracksTodelete.includes(track.name)); If a song is duplicated, it will remove all these
        // Delete tracks
        tracksTodelete.forEach((trackToDelete) => {
            var positionTrack = this._listOfTracks.findIndex((track) => track.name === trackToDelete)
            if (positionTrack != -1) {
                this._listOfTracks.splice(positionTrack, 1)
            }
        });
        // Update the duration of the playlist and the number of songs
        this._totalDuration = this.calculateDuration();
        this._amountOftracks = this.calculateAmountOfTracks();
    }
    
    // Functions
    calculateDuration() {
            return this._listOfTracks.reduce((accumulator, {duration} = track) => accumulator + duration, 0) 
    }

    calculateAmountOfTracks() {
        return this._listOfTracks.length;
    }

    searchTrack (trackName) { // Solo encuentra canciones con el nombre exacto.
        const trackFound = this._listOfTracks.filter((track) => track.name == trackName)
        return trackFound
    }

    /**
     * 
     * @param {string} property set property to compare ( name | duration | album | artist)
     * @param {number} typeOfOrder 0 for ascending order and 1 for descending order 
     */
    orderBy (property, typeOfOrder) {
        property == 'name' ? typeOfOrder === 0 ? 
            this._listOfTracks.sort((track1, track2) => track1.name.localeCompare(track2.name)) 
            : this._listOfTracks.sort((track1, track2) => track2.name.localeCompare(track1.name)) 
        : property == 'duration' ? typeOfOrder === 0 ?
            this._listOfTracks.sort((track1, track2) => track1.duration - track2.duration)
            : this._listOfTracks.sort((track1, track2) =>track2.duration - track1.duration)
        : property == 'album' ? typeOfOrder === 0 ? 
            this._listOfTracks.sort((track1, track2) => track1.album.localeCompare(track2.album))
            : this._listOfTracks.sort((track1, track2) => track2.album.localeCompare(track1.album))
        : typeOfOrder === 0 ? // Last is for artist
            this._listOfTracks.sort((track1, track2) => track1.artist.localeCompare(track2.artist))
            : this._listOfTracks.sort((track1, track2) => track2.artist.localeCompare(track1.artist))
    }


}