evaluate = function (currentPose) {
    var elbow;
    var shoulder;
    var wrist;
    var hip;

    var side = "left";

    while (side !== "") {
        if (side.localeCompare("left") === 0) {
            elbow = currentPose.pose.leftElbow;
            shoulder = currentPose.pose.leftShoulder;
            wrist = currentPose.pose.leftWrist;
            hip = currentPose.pose.leftHip;
        }
        else {
            elbow = currentPose.pose.rightElbow;
            shoulder = currentPose.pose.rightShoulder;
            wrist = currentPose.pose.rightWrist;
            hip = currentPose.pose.rightHip;
        }

        if (elbow.confidence > 0.2 &&
            shoulder.confidence > 0.2 &&
            wrist.confidence > 0.2 &&
            hip.confidence > 0.2) {

            //upper arm vector
            var upperArm = { x: 0.0, y: 0.0 };
            upperArm.x = shoulder.x - elbow.x;
            upperArm.y = shoulder.y - elbow.y;
            let upperArmNorm = Math.sqrt(Math.pow(upperArm.x, 2) + Math.pow(upperArm.y, 2));

            upperArm.x = upperArm.x / upperArmNorm;
            upperArm.y = upperArm.y / upperArmNorm;

            //torso vector
            var torso = { x: 0.0, y: 0.0 };
            torso.x = shoulder.x - hip.x;
            torso.y = shoulder.y - hip.y;
            let torsoNorm = Math.sqrt(Math.pow(torso.x, 2) + Math.pow(torso.y, 2));

            torso.x = torso.x / torsoNorm;
            torso.y = torso.y / torsoNorm;

            //forearm vector
            var forearm = { x: 0.0, y: 0.0 };
            forearm.x = wrist.x - elbow.x;
            forearm.y = wrist.y - elbow.y;
            let forearmNorm = Math.sqrt(Math.pow(forearm.x, 2) + Math.pow(forearm.y, 2));

            forearm.x = forearm.x / forearmNorm;
            forearm.y = forearm.y / forearmNorm;

            //dot product between upper arm vector and torso vector
            var upperArmTorsoDotProduct = dotProduct(upperArm, torso);
            var upperArmTorsoAngle = Math.acos(upperArmTorsoDotProduct) * 180.0 / Math.PI;

            //dot product between foreArm vector and upper Arm vector
            var upperArmForearmDotProduct = dotProduct(upperArm, forearm);
            var upperArmForearmAngle = Math.acos(upperArmForearmDotProduct) * 180.0 / Math.PI;

            var counter;

            if (side.localeCompare("left") === 0) {
                counter = document.getElementById("counterLeft");
            }
            else {
                counter = document.getElementById("counterRight");
            }

            var status;

            if (side.localeCompare("left") === 0) {
                status = leftStatus;
            }
            else {
                status = rightStatus;
            }

            if (upperArmForearmAngle > 165) {
                if (upperArmTorsoAngle < 30) {

                    //at the beggining of a rep
                    if (!status.repStarted) {
                        status.repStarted = true;
                        status.goalAchieved = false;
                        status.moved = false;
                    }
                    else {
                        //at the end of a rep
                        if (status.goalAchieved) {
                            status.reps = status.reps + 1;
                            counter.innerHTML = status.reps;
                            status.repStarted = false;
                            status.goalAchieved = false;
                            status.moved = false;
                        }
                        else {

                            //rep started and arms are significantly moved 
                            if (status.moved) {
                                alertMessage.innerHTML = "Nu ai ridicat antebratul suficient de sus!";
                                myalert.style.display = "block";
                                setTimeout(function () {
                                    myalert.style.display = "none";
                                }, 3000);
                                status.repStarted = false;
                                status.goalAchieved = false;
                                status.moved = false;
                            }
                        }
                    }
                }
                else {
                    if (status.repStarted) {
                        alertMessage.innerHTML = "Ai miscat bratul prea mult!";
                        myalert.style.display = "block";
                        setTimeout(function () {
                            myalert.style.display = "none";
                        }, 3000);
                        status.repStarted = false;
                        status.goalAchieved = false;
                        status.moved = false;
                    }
                }
            }
            else
                //intermediate steps
                if (upperArmForearmAngle > 30) {
                    if (status.repStarted) {
                        if (upperArmTorsoAngle >= 30) {
                            //during the rep
                            alertMessage.innerHTML = "Ai miscat bratul prea mult!";
                            myalert.style.display = "block";
                            setTimeout(function () {
                                myalert.style.display = "none";
                            }, 3000);
                            status.repStarted = false;
                            status.goalAchieved = false;
                            status.moved = false;

                        }
                        else {
                            if (!status.moved) {
                                status.moved = true;
                            }
                        }
                    }
                    
                }
                else                                   
                {
                    //positive goal
                    if (upperArmTorsoAngle < 30) {

                        //goal achieved
                        if (status.repStarted) {
                            status.goalAchieved = true;
                        }
                    }
                    else {
                        if (status.repStarted) {
                            alertMessage.innerHTML = "Ai miscat bratul prea mult!";
                            myalert.style.display = "block";
                            setTimeout(function () {
                                myalert.style.display = "none";
                            }, 3000);
                            status.repStarted = false;
                            status.goalAchieved = false;
                            status.moved = false;
                            counter.innerHTML = status.reps;
                        }
                    }

                }

        }

        if (side.localeCompare("left") === 0) {
            side = "right";
        }
        else {
            side = "";
        }
    }
};