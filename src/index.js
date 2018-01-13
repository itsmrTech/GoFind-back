/**
 *          .::MAIN FILE::.
 * 
 * 
 */
import vars from "./globals";
import './config/env';

import Project from './config/project';
if (process.env.projectMode == "Production") {
  //Don't print logs in production mode
  console.config({
    activeLevel: 2
  })
}
//STARTUP
console.intro({
  Name: Project.Name,
  Description: Project.Description,
  Notes: Project.Notes,
  Mode: process.env.projectMode
});

import './config/database';
import routes from './app/routes';
import CORS from './app/middlewares/CORS';
import ExpressPlugins from './app/middlewares/ExpressPlugins';

const app = express();


// Middlewares
app.use(bodyParser.json());
app.use(CORS);
app.use(ExpressPlugins);

// Routes
routes.post('/', (req, res) => res.json({
  message: Project.Name+ ' API'
}));
app.use('/api', routes);
app.use(express.static(path.join(__dirname, '../public')));

app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
app.use((err,req,res,next)=>{
  if(!err) return res.validSend(201,{});
  if(!err.status)err.status=500;
  return res.validSend(err.status,{error:err.message})
})

const port = process.env.API_PORT || 3000;


app.listen(port, (err) => { 
  if (err) {
    console.error(err)
  }

  console.info(`listening on port`, Number(port))
});