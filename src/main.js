import './style.css'

import { HomePage } from './pages/Home.js'

const home = new HomePage();
(async () => {
    await home.init();
})();
