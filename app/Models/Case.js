import { appState } from "../AppState.js";
import { generateId } from "../Utils/generateId.js";

export class Case {
    // NOTE constructor here for handling 'building' instances of this class
    constructor(data) {
        this.id = generateId()
        this.report = data.report || 'No report'
        this.clearance = data.clearance
        this.agency = data.agency
        // ANCHOR if you do not provide a value with the new Date() constructor, it will use the current time/date of local machine
        this.date = data.date ? new Date(data.date) : new Date()
        this.unlocked = false
    }

    get ListTemplate() {
        return `
           <div class="col-12 bg-primary selectable user-select-none" onclick="app.casesController.setActive('${this.id}')">
              <div class="row ">
                <div class="col-2">
                  <p>${this.agency}</p>
                </div>
                <div class="col-7">
                  <p>${this.ComputeReport}</p>
                </div>
                <div class="col-3">
                  <p>${this.ComputeDate}</p>
                </div>
              </div>
            </div>`
    }

    get RedactedTemplate() {
        return `
                    <div class="col-8">
              <h1>${this.agency} ${this.clearance.toUpperCase()}</h1>
            </div>
            <div class="col-4">
              <button class="btn btn-primary" onclick="app.casesController.unlockCase()"><i class="mdi mdi-lock"></i></button>
            </div>
            <div class="col-12">
              <h3>${this.ComputeDate}</h3>
            </div>

            <textarea disabled class="report" name="caseReport" id="caseReport" cols="30"
              rows="10">${this.ComputeRedacted}</textarea>`
    }

    get UnredactedTemplate() {
        return `
                    <div class="col-8">
              <h1>${this.agency} ${this.clearance.toUpperCase()}</h1>
            </div>
            <div class="col-4">
              <button class="btn btn-primary" onclick="app.casesController.saveCase()"><i class="mdi mdi-content-save"></i></button>
            </div>
            <div class="col-12">
              <h3>${this.ComputeDate}</h3>
            </div>

            <textarea  onblur="app.casesController.saveCase()" class="report" name="caseReport" id="caseReport" cols="30"
              rows="10">${this.report}</textarea>`
    }




    // TODO compute date
    get ComputeDate() {
        let date = this.date
        // NOTE date constructor returns these values as strings which is why I can just concatonate like so
        // NOTE the month is 0 indexed, so you will need to add one to get the correct number here
        return (date.getMonth() + 1) + '/' + (date.getDate()) + '/' + (date.getFullYear())
    }

    // TODO compute report display
    get ComputeReport() {
        return this.report.slice(0, 15) + '...'
    }

    get ComputeRedacted() {
        // NOTE this takes the report string, and 'splits' ea. word into an array
        let origReportArr = this.report.split(' ')
        let redactedReportArr = origReportArr.map(word => {
            // ANCHOR check to see if the 'word' in our orig array is also a word in the classified list
            if (appState.classifiedWords.includes(word.toLowerCase())) {
                // ANCHOR if 'word' is also in the classified list, then map (transform) it into a redacted characters, otherwise return the orig. 'word'
                return '⬛⬛⬛⬛'
            } else {
                return word
            }
        })
        // ANCHOR lastly, join the indiv. words back into a string
        return redactedReportArr.join(' ')
    }
}