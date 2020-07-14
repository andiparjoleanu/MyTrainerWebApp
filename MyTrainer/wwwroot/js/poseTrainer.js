var pageContent = document.getElementById("pageContent");

var header = document.getElementsByClassName("header")[0];

var video = document.getElementById('video');
var width = video.width;
var height = video.height;

var canvas = document.getElementById('canvas');
var url = canvas.toDataURL();
pageContent.style.backgroundImage = "url(" + url + ")";
canvas.style.display = "none";

canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext('2d');
ctx.canvas.width = width;
ctx.canvas.height = height;

var myalert = document.getElementById("alert");
var alertMessage = document.getElementById("alertMessage");

function resizeElements() {
    canvas.width = width;
    canvas.height = height; 
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    video.width = width;
    video.height = height;
}

window.addEventListener("resize", resizeElements);

// The detected positions will be inside an array
let poses = [];

// Create a webcam capture
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
        video.srcObject = stream;
        video.play();
    });
}

// A function to draw the video and poses into the canvas.
// This function is independent of the result of posenet
// This way the video will not seem slow if poseNet 
// is not detecting a position
function drawPose() {

    // Draw the video element into the canvas
    //ctx.drawImage(video, 0, 0, width, height);
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 8;

    // We can call both functions to draw all keypoints and the skeletons
    drawSkeleton();
    drawKeypoints();
    url = canvas.toDataURL();
    pageContent.style.backgroundImage = "url(" + url + ")";
    window.requestAnimationFrame(drawPose);

}

function neuralNetworkProcessing() {
    if (training) {
        if (poses[0] !== undefined) {
            let inputs = [];
            for (let i = 0; i < poses[0].pose.keypoints.length; i++) {
                let x = poses[0].pose.keypoints[i].position.x;
                let y = poses[0].pose.keypoints[i].position.y;
                inputs.push(x);
                inputs.push(y);
            }

            let target = [targetLabel];

            /*trainingData.push({
                inputData: inputs,
                targetData: target
            });*/

            neuralNetwork.addData(inputs, target);
        }
    } else if (classifying) {
        if (poses[0] !== undefined) {
            let inputs = [];
            for (let i = 0; i < poses[0].pose.keypoints.length; i++) {
                let x = poses[0].pose.keypoints[i].position.x;
                let y = poses[0].pose.keypoints[i].position.y;
                inputs.push(x);
                inputs.push(y);
            }

            neuralNetwork.classify(inputs, gotResults);
        }
    }
}

function gotResults(error, data) {
    if (!error) {
        label = data[0].label;
        label = label.split(",")[0].toUpperCase();

        if (data[0].confidence >= 0.75) {
            results.push(label);
        }
    }
}


// Loop over the drawPose function
drawPose();

// Create a new poseNet method with a single detection
const poseNet = ml5.poseNet(video, modelReady);
poseNet.on('pose', gotPoses);

// A function that gets called every time there's an update from the model

function gotPoses(results) {
    poses = results;
    neuralNetworkProcessing();
    if (countStarted) {
        if (poses[0] !== undefined) {
            evaluate(poses[0]);
        }
    }
}

function modelReady() {
    console.log("model ready");
    poseNet.singlePose(video);
}

var countStarted = false;

class Status {
    constructor(repStarted, goalAchieved, reps) {
        this.repStarted = repStarted;
        this.goalAchieved = goalAchieved;
        this.reps = reps;
        this.moved = false;
    }
}

var leftStatus = new Status(false, false, 0);
var rightStatus = new Status(false, false, 0);

var previousKeypoints = [];

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {

    if (poses[0] !== undefined) {
        let currentPose = poses[0];

        // For each pose detected, loop through all the keypoints
        for (let j = 0; j < currentPose.pose.keypoints.length; j++) {
            let keypoint = currentPose.pose.keypoints[j];

            if (previousKeypoints.length < currentPose.pose.keypoints.length) {
                previousKeypoints.push(currentPose.pose.keypoints[j]);
            }

            // Only draw an ellipse if the pose probability is bigger than 0.2
            if (keypoint.score > 0.1) {
                ctx.beginPath();
                ctx.arc(keypoint.position.x, keypoint.position.y, 10, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
            }
                
        }

    } else {
        previousKeypoints = [];
    }
}

var exercise;

function dotProduct(vector1, vector2) {
    var result = vector1.x * vector2.x + vector1.y * vector2.y;

    if (result > 1.0) {
        return 1.0;
    }
    else if (result < -1.0) {
        return -1.0;
    }

    return result;
}

var previousSkeleton = [];

// A function to draw the skeletons
function drawSkeleton() {
    if (proTheme) {
        ctx.fillStyle = "#FF00FF";
        ctx.strokeStyle = "#FF00FF";
    }
    else {
        ctx.fillStyle = '#00FFFF';
        ctx.strokeStyle = '#00FFFF';
    }

    // Loop through all the skeletons detected
    if (poses[0] !== undefined) {
        for (let j = 0; j < poses[0].skeleton.length; j++) {

            let partA = poses[0].skeleton[j][0];
            let partB = poses[0].skeleton[j][1];

            ctx.beginPath();
            ctx.moveTo(partA.position.x, partA.position.y);
            ctx.lineTo(partB.position.x, partB.position.y);
            ctx.stroke();
        }
    }
    else {
        previousSkeleton = [];
    }
    
}

function evaluate() {}