class Track {
    
    constructor (name, author, album, duration) {
        this._name = name;
        this._author = author;
        this._album = album;
        this._duration = duration;
    }

    // Getters
    get name () {
        return this._name;
    }
    get author () {
        return this._author;
    }
    get album () {
        return this._album;
    }
    get duration () {
        return this._duration;
    }

}