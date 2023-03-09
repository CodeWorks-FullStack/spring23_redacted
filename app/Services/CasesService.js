import { appState } from "../AppState.js";
import { Pop } from "../Utils/Pop.js";
import { saveState } from "../Utils/Store.js";

class CasesService {


    setActive(caseId) {
        // console.log('setting active', caseId);
        let foundCase = appState.cases.find(c => c.id == caseId)
        // console.log(foundCase);
        appState.activeCase = foundCase
    }

    async unlockCase(input) {
        // console.log('unlock this case', input);
        // NOTE bc this button only displays on the active case, we can manip. the appState activeCase instead of passing id's 
        let activeCase = appState.activeCase
        // NOTE bracket notation here says go and return the value of the clearanceLevel that matches the clearance of the activeCase
        let password = appState.clearanceLevels[activeCase.clearance]
        // console.log(password, 'password for the active case');
        if (input == password) {
            // NOTE this will not trigger the observer, bc we are not actually changing the value of the appstate, but a property on an object
            activeCase.unlocked = true
            console.log(activeCase, 'unlocking');
            appState.emit('activeCase')
        } else {
            await Pop.toast('[UNAUTHORIZED] We tracked your IP...dispatching agents to your location')
        }
    }

    saveCase(reportData) {
        // console.log(reportData, 'reporting');
        let activeCase = appState.activeCase
        activeCase.report = reportData
        activeCase.unlocked = false
        appState.emit('activeCase')
        saveState('caseFiles', appState.cases)
        // console.log(activeCase);
    }
}

export const casesService = new CasesService()