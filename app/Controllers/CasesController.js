import { appState } from "../AppState.js"
import { casesService } from "../Services/CasesService.js"
import { getFormData } from "../Utils/FormHandler.js"
import { Pop } from "../Utils/Pop.js"
import { setHTML } from "../Utils/Writer.js"

function _drawCases() {
    // console.log('drawing cases')
    let cases = appState.cases
    let template = ''
    cases.forEach(c => template += c.ListTemplate)

    setHTML('cases', template)
}

function _drawActive() {
    console.log('drawing active');
    let activeCase = appState.activeCase
    // NOTE if the case is unlocked draw the unredacted
    if (activeCase.unlocked) {
        setHTML('active', activeCase.UnredactedTemplate)
    } else {
        // NOTE if the case is locked, draw the redacted template
        setHTML('active', activeCase.RedactedTemplate)
    }
}

export class CasesController {
    // ANCHOR when we create a class, the constructor 'builds' it
    // NOTE in the controller, use our constructor for defining what we want to occur when this file is built
    // e.g. draw functions or listeners
    constructor() {
        // console.log('hello from the cases controller')
        _drawCases()
        appState.on('activeCase', _drawActive)
        appState.on('cases', _drawCases)
    }

    setActive(caseId) {
        console.log('setting active', caseId)
        casesService.setActive(caseId)
    }

    async unlockCase() {
        // console.log('unlocking');
        let input = ''
        if (appState.activeCase.clearance != 'none') {
            input = await Pop.prompt('Password? Please verify your clearance level.', true)
        }
        casesService.unlockCase(input)
        // @ts-ignore
        document.querySelector('.report').focus()
    }

    saveCase() {
        // console.log('saving the case')
        // NOTE this will grab the entire text area.... in order to get the text inside, we must target its value
        let report = document.querySelector('.report')
        // @ts-ignore
        console.log(report.value);
        // @ts-ignore
        casesService.saveCase(report.value)
    }

    createCase() {
        console.log('creating case');
        window.event.preventDefault()
        // NOTE target the onsubmit
        let form = event.target
        // NOTE get form data creates an object with key:value pairs between the name of the input and the input value
        let newReport = getFormData(form)
        console.log(newReport);
        casesService.createCase(newReport)
        // @ts-ignore
        document.querySelector('.report').focus()
    }

}