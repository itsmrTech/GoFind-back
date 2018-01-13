/**
 *          .::USER ROUTES::.
 * All User's apis are routed here.
 * 
 */
const routes = express.Router();

import Auth from '../middlewares/Auth';
import {
	register,
	login,
	me
} from '../controllers/UsersController'

//ENDPOINTS
routes.post('/register', register);
routes.post('/login', login);
routes.post('/me', Auth, me);



export default routes;