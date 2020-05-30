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