import { CasesController } from "./Controllers/CasesController.js";
import { ValuesController } from "./Controllers/ValuesController.js";

class App {
  // valuesController = new ValuesController();

  casesController = new CasesController();
}

window["app"] = new App();
