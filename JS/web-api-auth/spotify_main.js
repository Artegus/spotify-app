import {APIcontroller, UIController_Main} from './functions.js';

const APPController = (function(APICtrl, UICtrl){

    // Get container field
    const DOMcontainers = UICtrl.containerField();

    const loadRecommendedPlaylist = async () => {
        const token = await APICtrl.getToken()
        

        console.log(token)
    }


    return {
        init() {
            console.log('loading')
            loadRecommendedPlaylist();
        }
    }

})(APIcontroller, UIController_Main);

APPController.init();