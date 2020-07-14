/*
    proTheme: variabila care specifica daca tema de culoare curenta 
    corespunde versiunii clasice sau pro
*/
var proTheme = false;


//  label: retine rezultatul clasificarii cadrului video curent
var label = "";

/*
    training: indica faptul ca procesul de antrenare a retelei neuronale
    este in desfasurare
*/
var training = false;


//  classifying: indica faptul ca procesul de clasificare este in desfasurare
var classifying = false;


//  results: vector care retine rezultatele clasificarii unei secvențe de cadre
var results = [];

var trainingData = [];

var isTrained = false;

function startReps() {
    var selectExercise = document.getElementById("selectExercise");
    var scriptAndType = selectExercise.value;
    var values = scriptAndType.split("+");

    sessionStorage.setItem("exerciseId", values[2]);
    sessionStorage.setItem("exerciseType", values[1]);

    var type = values[1];

    if (type === 'Unilateral') {
        $.get("/Home/CounterUnilateralExercises", function (response) {
            $("#noteContent").html(response);
        });
    }
    else {
        $.get("/Home/CounterBilateralExercises", function (response) {
            $("#noteContent").html(response);
        });
    }

    exercise = document.createElement("script");
    exercise.setAttribute('src', values[0]);
    exercise.setAttribute('id', 'exerciseScript');
    document.body.appendChild(exercise);

    if (countStarted !== undefined)
        countStarted = true;
}

function stopReps() {
    if (leftStatus !== undefined)
        leftStatus = new Status(false, false, 0);

    if (rightStatus !== undefined)
        rightStatus = new Status(false, false, 0);

    var exerciseScript = document.getElementById('exerciseScript');
    document.body.removeChild(exerciseScript);

    if (evaluate !== undefined)
        evaluate = function () { };

    if (countStarted !== undefined)
        countStarted = false;

    $.get("/Home/ChooseExercise", function (response) {
        $("#noteContent").html(response);
    });

    var reps;
    var currentExercise = sessionStorage.getItem("exerciseId");
    var exerciseType = sessionStorage.getItem("exerciseType");

    if (exerciseType === 'Bilateral') {
        var counterRight = document.getElementById("counterRight");
        var counterLeft = document.getElementById("counterLeft");
        reps = {
            LeftSideReps: parseInt(counterLeft.innerHTML),
            RightSideReps: parseInt(counterRight.innerHTML),
            ExerciseId: currentExercise
        };
        $.post("Home/SaveRepsBilateral", reps);
    }
    else {
        var counter = document.getElementById("counterUnilateral");
        reps = {
            Reps: parseInt(counter.innerHTML),
            ExerciseId: currentExercise
        };
        $.post("Home/SaveRepsUnilateral", reps);
    }
}

function returnToClassic() {
    proTheme = false;
    stopClassifierCounter();

    $.get("/Home/ChooseExercise", function (response) {
        $("#noteContent").html(response);
        document.getElementById("pro").disabled = false;
    });

    document.getElementById("header").style.color = "cyan";
    document.getElementById("popi").style.color = "cyan";
    document.getElementById("userIcon").style.color = "cyan";

    var popi = document.getElementById("popi");

    popi.setAttribute("data-content",
        '<!DOCTYPE html><html>' +
        '<a href="History/Index" class="d-block text-center text-dark">Istoricul exercitiilor</a>' +
        '<br />' +
        '<a href="Account/Logout" class="btn start">Deconectare</a></html>');
}


/*
    tip de strat = dens: - foloseste o functie de activare (functie neliniara)
    units = 2/3 * no_inputs + no_outputs
    relu: - f(x) = max(0, x)
          - cost computational scazut
    sigmoid: - f(x) = 1/(1 + e^(-x))
             - cost computational ridicat
    softmax: - f(x)i = (e^xi)/sum[j=1...k](e^xj), i = 1...k, x=(x1,x2,...xk)
             - folosita pentru clasificare; rezultatul este un set de probabilitati
 */
let options = {
    inputs: 34,                      
    task: 'classification',
    layers: [
        {
            type: 'dense',
            units: 25,
            activation: 'relu'
        },
        {
            type: 'dense',
            units: 25,
            activation: 'sigmoid'
        },
        {
            type: 'dense',
            activation: 'softmax'
        }
    ],
    debug: false
};

var neuralNetwork;

//-------------------------------------------------------

//detalii despre antrenare
let trainingOptions = {
    epochs: 100
};

//--------------------------------------------------------

//functie care se apeleaza inainte de antrenarea retelei
function saveTrainingData() {
    /*for (let i = 0; i < trainingData.length; i++) {
        neuralNetwork.addData(trainingData[i].inputData, trainingData[i].targetData);
    }*/
    neuralNetwork.normalizeData();
    neuralNetwork.train(trainingOptions, finishedTraining);
}

//functie care se apeleaza la finalul procesului de antrenare
function finishedTraining() {
    console.log('Model antrenat');
    isTrained = true;
    classifying = true;

    neuralNetwork.saveData('MyTrainer_trainingData');

    $.get("/Home/ClassifierCounter", function (response) {
        $("#noteContent").html(response);
        document.getElementById("MLClassificationResult").innerText = "SE ÎNCARCĂ EXERCIȚIILE...";
        classifyExercises();
    });
}

function tryPro() {
    document.getElementById("pro").disabled = true;
    proTheme = true;
    if (!isTrained) {
        $.get("/Home/Pro", function (response) {
            $("#noteContent").html(response);
        });

        neuralNetwork = ml5.neuralNetwork(options);
        console.log(neuralNetwork);
    } else {
        classifying = true;
        $.get("/Home/ClassifierCounter", function (response) {
            $("#noteContent").html(response);
            classifyExercises();
        });
    }

    document.getElementById("header").style.color = "magenta";
    document.getElementById("popi").style.color = "magenta";
    document.getElementById("userIcon").style.color = "magenta";

    var popi = document.getElementById("popi");

    popi.setAttribute("data-content",
        '<!DOCTYPE html><html>' +
        '<a href="History/Index" class="d-block text-center text-dark">Istoricul exercitiilor</a>' +
        '<br />' +
        '<a href="Account/Logout" class="btn proLogout">Deconectare</a></html>');
}

function loadingFinished() {
    neuralNetwork.normalizeData();
    neuralNetwork.train(trainingOptions, startupTraining);
}

function startupTraining() {
    console.log('Model antrenat');
    isTrained = true;
    classifying = true;
    classifyExercises();
    document.getElementById("trainButton").disabled = false;
    document.getElementById("MTClassic").disabled = false;
}


function saveExercises() {
    document.getElementById("saveExercises").disabled = true;
    saveTrainingData();
}

function startTraining() {
    document.getElementById("trainButton").disabled = true;
    classifying = false;

    $.get("/Home/AddExercise", function (response) {
        $("#noteContent").html(response);
        document.getElementById("startTrainingCount").disabled = true;
        document.getElementById("saveExercises").disabled = true;

        try {
            neuralNetwork.loadData('../model/trainingData.json', loadingFinishedTraining);
        }
        catch (error) {
            console.log('Nu exista un model antrenat pentru MY TRAINER');
        }
    });
}

function loadingFinishedTraining() {
    document.getElementById("startTrainingCount").disabled = false;
    document.getElementById("saveExercises").disabled = false;
}

var startTimeout, cancelTimeout, counterInterval, collectingInterval;
let collectMessage;

function cancelTimer() {
    console.log('Finalizare colectare');
    training = false;

    clearTimeout(startTimeout);
    clearTimeout(cancelTimeout);
    clearInterval(counterInterval);
    clearInterval(collectingInterval);

    $.get("/Home/TrainingOptions", function (response) {
        $("#noteContent").html(response);
        document.getElementById("addExample").disabled = false;
    });
}

//define move
var targetLabel = "";

function nameIntroduced() {
    let firstStep = true;

    collectingInterval = setInterval(function () {
        if (firstStep) {
            collectMessage = document.getElementById("collectMessage");
            collectMessage.innerText = "Colectarea începe în 00:04";
            firstStep = false;
        }
        else {
            let collectMessageText = collectMessage.innerText.split(":");
            let collectMessageTimer = parseInt(collectMessageText[1]);
            collectMessageTimer = collectMessageTimer - 1;
            document.getElementById("collectMessage").innerText = "Colectarea începe în 00:0" + collectMessageTimer;
        }
    }, 1000);

    startTimeout = setTimeout(function () {

        clearInterval(collectingInterval);
        collectMessage.innerText = "";

        training = true;
        console.log('Colectare date');

        counterInterval = setInterval(function () {
            let timer = document.getElementById("timer");
            let timerText = timer.innerText.split(":");
            let timerValue = parseInt(timerText[1]);
            timerValue = timerValue - 1;
            document.getElementById("timer").innerText = "00:0" + timerValue;
        }, 1000);

        cancelTimeout = setTimeout(function () {
            cancelTimer();
        }, 10000);
    }, 5000);
}

//---------------------------------------------------------

function startCount() {
    document.getElementById("startTrainingCount").disabled = true;
    document.getElementById("saveExercises").disabled = true;
    var nameInput = document.getElementById("exerciseName");
    targetLabel = nameInput.value;

    $.get("/Home/TrainingCounter", function (response) {
        $("#noteContent").html(response);
    });
   
    nameIntroduced();
}

function addMoreExercises() {
    $.get("/Home/AddExercise", function (response) {
        $("#noteContent").html(response);
        document.getElementById("startTrainingCount").disabled = false;
        document.getElementById("saveExercises").disabled = false;
    });
}

function addExample() {
    document.getElementById("addExample").disabled = true;
    $.get("/Home/TrainingCounter", function (response) {
        $("#noteContent").html(response);
    });

    nameIntroduced();
}

var classifierCounterInterval, classifierTimeout;

function classifyExercises() {
    classifierCounterInterval = setInterval(function () {
        let timer = document.getElementById("classifierTimer");
        let timerText = timer.innerText.split(":");
        let timerValue = parseInt(timerText[1]);
        timerValue = timerValue - 1;
        document.getElementById("classifierTimer").innerText = "00:0" + timerValue;
        if (timerValue === 0) {
            timer.style.color = "red";
        } else {
            timer.style.color = "white";
        }
        document.getElementById("MLClassificationResult").style.color = "magenta";
    }, 1000);

    classifierTimeout = setTimeout(function() {
        let mlClassificationResult = document.getElementById("MLClassificationResult");
        mlClassificationResult.style.color = "white";

        if (results.length === 0) {
            if (mlClassificationResult) {
                mlClassificationResult.innerText = "DETECȚIE NEREUȘITĂ";
            }
        }
        else {
            let resultsDictionary = [];
            for (let i = 0; i < results.length; i++) {
                let j = 0;
                for (; j < resultsDictionary.length; j++) {
                    if (results[i] === resultsDictionary[j].name) {
                        resultsDictionary[j].count += 1;
                        break;
                    }
                }

                if (j === resultsDictionary.length) {
                    resultsDictionary.push({
                        name: results[i],
                        count: 1
                    });
                }
            }

            sortedResults = resultsDictionary.sort((obj1, obj2) => obj2.count - obj1.count);

            console.log(sortedResults);

            if (mlClassificationResult && sortedResults.length > 0) {
                mlClassificationResult.innerText = sortedResults[0].name;
            }
        }

        results = [];
        resetCounter();
    }, 6000);
}

function resetCounter() {
    clearInterval(classifierCounterInterval);
    clearTimeout(classifierTimeout);

    let classifierTimer = document.getElementById("classifierTimer");
    classifierTimer.innerText = "00:05";
    classifierTimer.style.color = "green";

    classifyExercises();
}

function stopClassifierCounter() {
    clearInterval(classifierCounterInterval);
    clearTimeout(classifierTimeout);

    document.getElementById("classifierTimer").innerText = "00:05";
}

function tryingBaseSet() {
    document.getElementById("tryBaseSet").disabled = true;
    document.getElementById("trainButton").disabled = true;
    document.getElementById("inputFile").disabled = true;
    try {
        neuralNetwork.loadData('../model/trainingData.json', loadingFinishedTryBaseSet);
    }
    catch (error) {
        console.log('Nu exista un model antrenat pentru MY TRAINER');
    }
}

function loadingFinishedTryBaseSet() {
    neuralNetwork.normalizeData();
    neuralNetwork.train(trainingOptions, finishedTrainingBaseSet);
}

function finishedTrainingBaseSet() {
    isTrained = true;
    classifying = true;
    $.get("/Home/ClassifierCounter", function (response) {
        $("#noteContent").html(response);
        classifyExercises();
    });
}