class TableWizard {
    constructor(tests) {
        this.tests = tests
        this.init()
    }

    init() {
        this.renderTable()
        this.initButtons()
        this.initAddTest()
    }

    renderTable() {
        const table = document.getElementById('tests-table')
        table.innerHTML = ''

        for (let obj of this.tests) {
            const row = `<tr scope="row" class="test-row-${obj.id}">
                    <td>${obj.name}</td>
                    <td data-testid="${obj.id}" id="result-${obj.id}">${obj.result}</td>
                    <td>
                        <button class="btn btn-danger" data-testid="${obj.id}" id="delete-${obj.id}">Delete</button>
                        <button class="btn btn-info" disabled data-testid="${obj.id}" id="save-${obj.id}">Save</button>
                        
                        <button class="btn btn-danger hidden" data-testid="${obj.id}" id="cancel-${obj.id}">Cancel</button>
                        <button class="btn btn-primary hidden" data-testid="${obj.id}" id="confirm-${obj.id}">Confirm</button>
                    </td>
                </tr>`

            table.innerHTML += row
        }
    }

    initButtons() {
        const deleteBtns = document.querySelectorAll(`button[id*='delete']`);
        const cancelBtns = document.querySelectorAll(`button[id*='cancel']`);
        const confirmBtns = document.querySelectorAll(`button[id*='confirm']`);
        const results = document.querySelectorAll(`td[id*='result']`);
        const saveBtns = document.querySelectorAll(`button[id*='save']`);

        deleteBtns.forEach(button => { button.addEventListener('click', (e) => this.showDeleteSaveButtons(e, true)) })
        cancelBtns.forEach(button => { button.addEventListener('click', (e) => this.showDeleteSaveButtons(e, false)) })
        confirmBtns.forEach(button => { button.addEventListener('click', this.confirmDeletion) })
        results.forEach(button => { button.addEventListener('click', this.editResult, { once: true }) })
        saveBtns.forEach(button => { button.addEventListener('click', this.saveUpdate) })
    }

    initAddTest() {
        const formWrapper = document.querySelector('.form-wrapper')
        const errorMsg = document.querySelector('.error-msg')

        const testResult = document.getElementById('test-result')
        const testName = document.getElementById('test-name')
        const testCreateBtn = document.getElementById('create-test')

        const newTest = { 'name': null, 'id': 4, 'result': null }


        testResult.addEventListener('keyup', () => {
            if (newTest.name)
                errorMsg.classList.add('hidden')
            newTest.result = testResult.value
        })

        testName.addEventListener('change', () => {
            if (newTest.result) {
                errorMsg.classList.add('hidden')
            }
            newTest.name = testName.value
            console.log('testName.Value', testName.value)
        })

        testCreateBtn.addEventListener('click', () => {
            if (this.newTestValid(newTest)) {
                this.renderTableWithNewTestRow(newTest, testName, testResult)
                newTest.name = ''
                newTest.result = ''
            } else {
                errorMsg.classList.remove('hidden')
            }
        })
    }

    newTestValid(newTest) {
        const name = newTest.name
        const result = newTest.result

        return (name && name.trim() && (name.indexOf('---', 0) < 0) &&
            result && result.trim())

    }
    renderTableWithNewTestRow(newTest, testName, testResult) {
        newTest.id = tests.length + 1
        this.tests.push({ ...newTest })

        this.renderTable()
        this.initButtons()

        testResult.value = null
        testName.value = '---'
    }

    editResult = (e) => {
        const target = e.target
        const testid = target.dataset.testid
        const value = target.innerHTML
        target.innerHTML = `<input class = "result" data-testid="${testid}" type = "text" value = "${value}">`

        target.addEventListener('keyup', this.enableSaveButton)
    }

    enableSaveButton = (e) => {
        const testid = e.target.dataset.testid
        const saveBtn = document.getElementById(`save-${testid}`)

        saveBtn.removeAttribute('disabled')
    }

    saveUpdate = (e) => {
        const testid = e.target.dataset.testid
        const table = document.getElementById('tests-table')
        const row = document.querySelector(`.test-row-${testid}`)

        e.target.setAttribute('disabled', 'true')
        row.classList.add('disabled')
        row.classList.remove('enabled')
        setTimeout(function () {
            row.classList.add('enabled')
            row.classList.remove('disabled')
        }, 2000)
    }

    showDeleteSaveButtons(e, shown) {
        const testid = e.target.dataset.testid

        const deleteBtn = document.getElementById(`delete-${testid}`)
        const saveBtn = document.getElementById(`save-${testid}`)
        const cancelBtn = document.getElementById(`cancel-${testid}`)
        const confirmBtn = document.getElementById(`confirm-${testid}`)

        deleteBtn.classList[shown ? 'add' : 'remove']('hidden')
        saveBtn.classList[shown ? 'add' : 'remove']('hidden')
        cancelBtn.classList[shown ? 'remove' : 'add']('hidden')
        confirmBtn.classList[shown ? 'remove' : 'add']('hidden')
    }

    confirmDeletion = (e) => {
        const testid = e.target.dataset.testid
        const tests = this.tests

        const row = document.querySelector(`.test-row-${testid}`)
        row.remove()
        tests.splice(testid - 1, 1)

        for (let i = 0; i < this.tests.length; i++) {
            this.tests[i].id = i + 1
        }
    }
}

const tests = [
    { 'name': 'Distillation 50%', 'id': 1, 'result': '43' },
    { 'name': 'Flash Point', 'id': 2, 'result': '61' },
    { 'name': 'Water by Karl Fisher', 'id': 3, 'result': '24' },
]

const tableWizard = new TableWizard(tests)