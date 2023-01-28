const loadingHint = document.querySelector('.hint');
const loadingHintText = document.querySelector('.hint__text');

const table = document.querySelector('table');
const tableBody = document.querySelector('tbody');

const inputValue = document.querySelector('#value');
const checkboxNegative = document.querySelector("#option-negative");
const checkboxFloat = document.querySelector("#option-float");

const buttonCreate = document.querySelector("#button-create");

let numberRecords = [];

const startLoading = (text) => {
    if (text != undefined)
        loadingHintText.textContent = text;

    table.classList.add('hidden');
    loadingHint.classList.remove('hidden');
}

const stopLoading = () => {
    loadingHint.classList.add('hidden');
    table.classList.remove('hidden');
}

const addNumberRecord = async (data) => {
    const response = await fetch('/numbers', {
        method: 'POST',
        body: data
    });

    if (!response.ok)
        throw new Error(`Failed to add number record`);

    return await response.json();
}

const getNumberRecords = async () => {
    const response = await fetch('/numbers/records');

    if (!response.ok)
        throw new Error(`Failed to get number records`);

    const json = await response.json();
    return json.numberRecords;
}

const updateNumberRecords = async () => {
    numberRecords = await getNumberRecords();
    
    stopLoading();
    renderNumberRecords();
}

const renderNumberRecords = () => {
    const tableRows = document.querySelectorAll("tbody tr");
    tableRows.forEach(row => row.remove());

    for (const record of numberRecords){    
        const tableRow = document.createElement('tr');

        const colValue = document.createElement('td');
        colValue.appendChild(document.createTextNode(record.currentValue));
        
        const colPrevValue = document.createElement('td');
        colPrevValue.appendChild(document.createTextNode(record.prevValue ?? '-'));
        
        const colResult = document.createElement('td');
        colResult.appendChild(document.createTextNode(record.result ? record.result.toFixed(2) : '-'));

        tableRow.appendChild(colValue);
        tableRow.appendChild(colPrevValue);
        tableRow.appendChild(colResult);

        tableBody.appendChild(tableRow);
    }
}

const onButtonCreateClick = async () => {
    if (inputValue.value == "")
        return inputValue.focus();

    // Using URLSearchParams instead of FormData as server
    // can't handle multipart/form-data requests
    const form = new URLSearchParams();
    form.append('value', inputValue.value);

    if (checkboxNegative.checked)
        form.append('option_negative', 'on');

    if (checkboxFloat.checked)
        form.append('option_float', 'on');

    const newRecord = await addNumberRecord(form);
    numberRecords.unshift(newRecord);

    inputValue.value = "";

    renderNumberRecords();
}

updateNumberRecords();

buttonCreate.onclick = onButtonCreateClick;