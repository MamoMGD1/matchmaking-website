const initialDataBase = [
    {
        firstName: "John", lastName: "Doe", gender: "male",
        features: [25, 2, 180, 75, 2, 4, 3, 1],
        preFeatures: [24, 3, 165, 55, 2, 4, 3, 1],
        coefficients: [4, 5, 5, 3, 5, 4, 2, 3]
    },
    {
        firstName: "Michael", lastName: "Smith", gender: "male",
        features: [30, 1, 175, 80, 3, 2, 4, 5],
        preFeatures: [26, 2, 168, 58, 3, 2, 5, 4],
        coefficients: [3, 3, 3, 4, 5, 4, 3, 2]
    },
    {
        firstName: "James", lastName: "Johnson", gender: "male",
        features: [28, 3, 185, 85, 1, 5, 3, 2],
        preFeatures: [25, 4, 162, 53, 1, 5, 3, 2],
        coefficients: [4, 3, 3, 5, 4, 5, 3, 2]
    },
    {
        firstName: "David", lastName: "Brown", gender: "male",
        features: [32, 5, 170, 70, 4, 1, 2, 3],
        preFeatures: [27, 2, 170, 60, 4, 1, 2, 3],
        coefficients: [3, 4, 4, 3, 5, 4, 2, 3]
    },
    {
        firstName: "Daniel", lastName: "Williams", gender: "male",
        features: [27, 4, 178, 76, 2, 3, 5, 4],
        preFeatures: [28, 1, 166, 57, 2, 3, 5, 4],
        coefficients: [4, 5, 5, 3, 5, 4, 3, 3]
    },
    {
        firstName: "Emily", lastName: "Clark", gender: "female",
        features: [24, 3, 165, 55, 2, 4, 3, 1],
        preFeatures: [30, 4, 180, 75, 3, 4, 1, 5],
        coefficients: [5, 3, 3, 4, 2, 3, 5, 5]
    },
    {
        firstName: "Sophia", lastName: "Lewis", gender: "female",
        features: [26, 5, 168, 58, 3, 2, 5, 4],
        preFeatures: [29, 1, 177, 80, 5, 3, 4, 2],
        coefficients: [4, 3, 3, 3, 2, 4, 5, 3]
    },
    {
        firstName: "Olivia", lastName: "Walker", gender: "female",
        features: [25, 2, 162, 53, 1, 5, 3, 2],
        preFeatures: [31, 3, 174, 78, 1, 3, 5, 4],
        coefficients: [3, 4, 4, 2, 5, 3, 2, 3]
    },
    {
        firstName: "Ava", lastName: "Young", gender: "female",
        features: [28, 1, 166, 57, 2, 3, 5, 4],
        preFeatures: [33, 5, 180, 82, 2, 5, 3, 1],
        coefficients: [2, 4, 4, 3, 4, 5, 3, 3]
    },
    {
        firstName: "Evelyn", lastName: "Adams", gender: "female",
        features: [31, 4, 175, 65, 4, 1, 2, 5],
        preFeatures: [35, 2, 172, 76, 4, 1, 2, 5],
        coefficients: [3, 3, 3, 4, 5, 4, 3, 2]
    }
];
const maxPossibleDiffs = [8, 4, 15, 10, 4, 4, 4, 4]; 
let visitor;
//localStorage.removeItem("dataBase")
let dataBase = (localStorage.getItem("dataBase"))? JSON.parse(localStorage.getItem("dataBase")):[...initialDataBase];
//removePerson("firstName lastName")
function getUserRecord() {
    // Extract values from input fields
    let firstName = document.getElementById("mName").value.trim();
    let lastName = document.getElementById("mLastName").value.trim();
    let gender = document.getElementById("mGender").value.toLowerCase();
    // Get features and multiply them by 3
    let features = [
        parseInt(document.getElementById("mAge").value) || 0,
        parseInt(document.getElementById("mEye").value),
        parseInt(document.getElementById("mHeight").value)|| 0,
        parseInt(document.getElementById("mWeight").value)|| 0,
        parseInt(document.getElementById("mSkin").value),
        parseInt(document.getElementById("mHumor").value),
        parseInt(document.getElementById("mConflict").value),
        parseInt(document.getElementById("mLang").value)
    ];

    // Create the user record object
    let record = {
        firstName: firstName,
        lastName: lastName,
        gender: gender,
        features: features,
        preFeatures: [],
        coefficients: []
    };

    return record;
}
function saveForm1() {
    dataBase.push(getUserRecord());
    document.getElementById('form1').style.display = 'none';
    document.getElementById('form2').style.display = 'block';
}
function saveForm2(){
    let currentUser = dataBase[dataBase.length-1];
    visitor = currentUser;
    currentUser.preFeatures = [
        (parseInt(document.getElementById("pAge").value) || 0),
        parseInt(document.getElementById("pEye").value),
        (parseInt(document.getElementById("pHeight").value) || 0),
        (parseInt(document.getElementById("pWeight").value) || 0),
        parseInt(document.getElementById("pSkin").value),
        parseInt(document.getElementById("pHumor").value),
        parseInt(document.getElementById("pConflict").value),
        parseInt(document.getElementById("pLang").value)
    ];
    currentUser.coefficients = [
        parseInt(document.getElementById("iAge").value),
        parseInt(document.getElementById("iEye").value),
        parseInt(document.getElementById("iHeight").value),
        parseInt(document.getElementById("iWeight").value),
        parseInt(document.getElementById("iSkin").value),
        parseInt(document.getElementById("iHumor").value),
        parseInt(document.getElementById("iConflict").value),
        parseInt(document.getElementById("iLang").value)
    ];
    let records = [];
    dataBase.forEach(user=>{
        if (user.gender!==currentUser.gender){
            let record = {
                recName: `${user.firstName} ${user.lastName}`,
                user: user,
                matchForYou: calculateSimilarity(currentUser, user, true),
                matchForThem: calculateSimilarity(currentUser, user, false),
                total: 0
            };
            record.total = (record.matchForThem+record.matchForYou)/2;
            records.push(record);
        }
    });
    localStorage.setItem("dataBase", JSON.stringify(dataBase))
    document.getElementById('form2').style.display = 'none';
    displayRecords(records);
}
function calculateSimilarity(currentUser, target, forMe) {
    let totalDifference = 0;
    let maxDifference = 0;
    let length = target.coefficients.length;

    if (forMe) {
        for (let i = 0; i < length; i++) {
            if(currentUser.preFeatures[i]===0) continue;
            let importance = currentUser.coefficients[i];
            let maxValue = maxPossibleDiffs[i] * importance;
            let difference = Math.abs(currentUser.preFeatures[i] - target.features[i]) * importance;
            
            totalDifference += difference;
            maxDifference += maxValue;
        }
    } else {
        for (let i = 0; i < length; i++) {
            if(target.preFeatures[i]===0) continue;
            let importance = target.coefficients[i];
            let maxValue = maxPossibleDiffs[i] * importance;
            let difference = Math.abs(currentUser.features[i] - target.preFeatures[i]) * importance;
            
            totalDifference += difference;
            maxDifference += maxValue;
        }
    }
    let similarityPercentage = 100 - ((totalDifference / maxDifference) * 100);
    return Math.max(similarityPercentage, 0);
}
function displayRecords(records) {
    // Sort records by total similarity (descending order)
    records.sort((a, b) => b.total - a.total);

    // Get container element
    let container = document.querySelector('.container');
    container.innerHTML = ''; // Clear previous content
    let header = document.createElement('h1');
    header.innerHTML = `💖 Your AI Matchmaking Results 💖`;
    container.appendChild(header);
    let parag = document.createElement('p');
    parag.innerHTML=`Click on a match to see detailed differences.`;
    container.appendChild(parag);
    // Create table
    let table = document.createElement('table');
    table.classList.add('match-table');

    // Create table headers
    let headerRow = document.createElement('tr');
    headerRow.innerHTML = `
        <th>Name</th>
        <th>Match For You</th>
        <th>Match For Them</th>
        <th>Total Match</th>
    `;
    table.appendChild(headerRow);

    // Add each record to the table
    records.forEach((record, index) => {
        let row = document.createElement('tr');

        // Background color intensity based on similarity percentage
        let colorForYou = `rgba(50, 200, 50, ${record.matchForYou / 100})`;
        let colorForThem = `rgba(50, 200, 50, ${record.matchForThem / 100})`;
        let colorForTotal = `rgba(50, 200, 50, ${record.total / 100})`;

        row.innerHTML = `
            <td>${record.recName}</td>
            <td style="background-color: ${colorForYou}">${record.matchForYou.toFixed(1)}%</td>
            <td style="background-color: ${colorForThem}">${record.matchForThem.toFixed(1)}%</td>
            <td style="background-color: ${colorForTotal}"><strong>${record.total.toFixed(1)}%</strong></td>
        `;

        // Click event to show more details
        row.addEventListener('click', () => showDetails(record));
        
        table.appendChild(row);
    });

    container.appendChild(table);
}
function showDetails(record) {
    let modal = document.getElementById('detailModal');
    let modalContent = document.getElementById('modalContent');

    // Clear previous content
    modalContent.innerHTML = `<h1>💝 Comparison with ${record.recName} 💝</h1>`;

    let detailsTable = document.createElement('table');
    detailsTable.classList.add('details-table');

    // Feature Labels
    let featureNames = ['Age', 'Eye Color', 'Height', 'Weight', 'Skin Tone', 'Humor', 'Conflict', 'Language'];

    // Convert numerical values into meaningful descriptions
    function getFeatureLabel(index, value) {
        switch (index) {
            case 1: // Eye Color
                return ["Blue", "Green", "Brown", "Hazel", "Gray"][value - 1] || "Unknown";
            case 4: // Skin Tone
                return ["Fair", "Tan", "Olive", "Brown", "Dark"][value - 1] || "Unknown";
            case 5: // Humor Level
            case 6: // Conflict Handling
            case 7: // Language Proficiency
                return ["Very Low", "Low", "Moderate", "High", "Very High"][value - 1] || "Unknown";
            default:
                return value; // Other numeric values (Age, Height, Weight)
        }
    }
    // Create and append the title row
    let titleRow = document.createElement('tr');
    titleRow.innerHTML = `
        <th>Feature</th>
        <th>Their Value - Your Preference</th>
        <th>Your Value - Their Preference</th>
        <th>Difference</th>
    `;
    titleRow.style.fontWeight = "bold"; // Make the title stand out
    detailsTable.appendChild(titleRow);

    for (let i = 0; i < record.user.features.length; i++) {
        let userValue = getFeatureLabel(i, record.user.features[i]);
        let preferredValue = getFeatureLabel(i, record.user.preFeatures[i]);
        let visitorValue = getFeatureLabel(i, visitor.features[i])
        let visitorPref = getFeatureLabel(i, visitor.preFeatures[i])
        let difference = (Math.abs(record.user.features[i] - visitor.preFeatures[i])+Math.abs(record.user.preFeatures[i] - visitor.features[i]))/2;
        let color = `rgba(255, 0, 0, ${Math.min(difference / maxPossibleDiffs[i], 1)})`; // More red for larger differences

        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${featureNames[i]}</td>
            <td>${userValue} - ${visitorPref}</td>
            <td>${visitorValue} - ${preferredValue}</td>
            <td style="background-color: ${color}">${difference}</td>
        `;
        detailsTable.appendChild(row);
    }

    modalContent.appendChild(detailsTable);
    modal.style.display = 'block';
    document.querySelector(".modal-overlay").style.display = "block";
}
document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('detailModal').style.display = 'none';
    document.querySelector('.modal-overlay').style.display = 'none';
});
document.getElementById("form1").addEventListener("submit", (event)=>{
    event.preventDefault();
    saveForm1();
});
document.getElementById("form2").addEventListener("submit", (event)=>{
    event.preventDefault();
    saveForm2();
});
function removePerson(fullName){
    console.log(`It was ${dataBase.length}`)
    dataBase=dataBase.filter(person=>person.firstName+' '+person.lastName!==fullName);
    localStorage.setItem("dataBase", JSON.stringify(dataBase))
    console.log(`Now it is ${dataBase.length}`)
    //console.log(dataBase)
}