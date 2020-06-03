// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet using p5.js
=== */
/* eslint-disable */
// Grab elements, create settings, etc.

var pageContent = document.getElementById("pageContent");

var header = document.getElementsByClassName("header")[0];


var height = pageContent.offsetHeight;
//var width = pageContent.offsetWidth;
var width = height * 1.42;

var video = document.getElementById('video');
video.width = width;
video.height = height;


var canvas = document.getElementById('canvas');

canvas.style.top = header.offsetHeight + "px";
canvas.width = width;
canvas.height = height;

var ctx = canvas.getContext('2d');
ctx.canvas.width = width;
ctx.canvas.height = height;

var myalert = document.getElementById("alert");
var alertMessage = document.getElementById("alertMessage");

function resizeElements() {
    //width = pageContent.offsetWidth;
    height = pageContent.offsetHeight;
    width = height * 1.42;

    canvas.width = width;
    canvas.height = height; 
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    video.width = width;
    video.height = height;
};

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
function drawCameraIntoCanvas() {
    // Draw the video element into the canvas
    ctx.drawImage(video, 0, 0, width, height);
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    ctx.lineWidth = 5;
    ctx.fillStyle = '#00FFFF';
    ctx.strokeStyle = '#00FFFF';

    // We can call both functions to draw all keypoints and the skeletons
    drawSkeleton();
    drawKeypoints();
    window.requestAnimationFrame(drawCameraIntoCanvas);
}
// Loop over the drawCameraIntoCanvas function
drawCameraIntoCanvas();

// Create a new poseNet method with a single detection
const poseNet = ml5.poseNet(video, modelReady);
poseNet.on('pose', gotPoses);

// A function that gets called every time there's an update from the model
function gotPoses(results) {
    poses = results;
}

function modelReady() {
    console.log("model ready");
    poseNet.singlePose(video)
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
    // Loop through all the poses detected
    if (poses[0] != undefined) {
        let currentPose = poses[0];
        // For each pose detected, loop through all the keypoints
        for (let j = 0; j < currentPose.pose.keypoints.length; j++) {
            let keypoint = currentPose.pose.keypoints[j];

            if (previousKeypoints.length < currentPose.pose.keypoints.length) {
                previousKeypoints.push(currentPose.pose.keypoints[j]);
            }

            // Only draw an ellipse if the pose probability is bigger than 0.2
            if (keypoint.score > 0.2) {
                ctx.fillStyle = '#00FFFF';
                ctx.strokeStyle = '#00FFFF';
                ctx.beginPath();
                ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                previousKeypoints[j] = keypoint;
            }
            else {
                if (previousKeypoints[j].score > 0.2) {
                    ctx.fillStyle = '#FF00FF';
                    ctx.strokeStyle = '#FF00FF';
                    ctx.beginPath();
                    ctx.arc(previousKeypoints[j].position.x, previousKeypoints[j].position.y, 5, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }

        if (countStarted) {
            evaluate(currentPose);
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
    ctx.fillStyle = '#00FFFF';
    ctx.strokeStyle = '#00FFFF';
    // Loop through all the skeletons detected
    if (poses[0] != undefined) {
        for (let j = 0; j < poses[0].skeleton.length; j++) {
            if (previousSkeleton.length < poses[0].skeleton.length) {
                previousSkeleton.push(poses[0].skeleton[j]);
            }

            let partA = poses[0].skeleton[j][0];
            let partB = poses[0].skeleton[j][1];

            let partA1 = partA, partB1 = partB;
            if (partA.score < 0.2) {
                partA1 = previousSkeleton[j][0];
            }
            else {
                previousSkeleton[j][0] = partA;
            }

            if (partB.score < 0.2) {
                partB1 = previousSkeleton[j][1];
            }
            else {
                previousSkeleton[j][1] = partB;
            }

            ctx.beginPath();
            ctx.moveTo(partA1.position.x, partA1.position.y);
            ctx.lineTo(partB1.position.x, partB1.position.y);
            ctx.stroke();
        }
    }
    else {
        previousSkeleton = [];
    }
    
}

function evaluate() {}