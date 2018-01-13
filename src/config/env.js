/**
 *          .::ENVIRONMENT PARSING::.
 * Parsing .env files and defining Project mode(Development, Production)
 * 
 */
let dotenvPath = "../../.dev.env"
let projectMode = "Development"
process
  .argv
  .forEach((val, index, array) => {
    switch (val) {
      case "--production":
        projectMode = "Production"
        return dotenvPath = '../../.env';
        break;

      //Add more commands here
      default:
    }
  });

dotenv.config({
  path: path.resolve(__dirname, dotenvPath),
});
process.env.projectMode=projectMode;