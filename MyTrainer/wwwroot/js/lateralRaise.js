evaluate = function (currentPose) {
    var shoulder;
    var wrist;
    var hip;
    var elbow;

    var side = "left";

    while (side !== "") {
        if (side.localeCompare("left") === 0) {
            shoulder = currentPose.pose.leftShoulder;
            wrist = currentPose.pose.leftWrist;
            hip = currentPose.pose.leftHip;
            elbow = currentPose.pose.leftElbow;
        }
        else {
            shoulder = currentPose.pose.rightShoulder;
            wrist = currentPose.pose.rightWrist;
            hip = currentPose.pose.rightHip;
            elbow = currentPose.pose.rightElbow;
        }

        if (shoulder.confidence > 0.2 &&
            wrist.confidence > 0.2 &&
            hip.confidence > 0.2 &&
            elbow.confidence > 0.2) {

            //forearm vector
            var forearm = { x: 0.0, y: 0.0 };
            forearm.x = wrist.x - elbow.x;
            forearm.y = wrist.y - elbow.y;
            let forearmNorm = Math.sqrt(Math.pow(forearm.x, 2) + Math.pow(forearm.y, 2));

            forearm.x = forearm.x / forearmNorm;
            forearm.y = forearm.y / forearmNorm;

            //upper Arm vector
            var upperArm = { x: 0.0, y: 0.0 };
            upperArm.x = shoulder.x - elbow.x;
            upperArm.y = shoulder.y - elbow.y;
            let upperArmNorm = Math.sqrt(Math.pow(upperArm.x, 2) + Math.pow(upperArm.y, 2));

            upperArm.x = upperArm.x / upperArmNorm;
            upperArm.y = upperArm.y / upperArmNorm;

            //arm vector
            var arm = { x: 0.0, y: 0.0 };
            arm.x = shoulder.x - wrist.x;
            arm.y = shoulder.y - wrist.y;
            let armNorm = Math.sqrt(Math.pow(arm.x, 2) + Math.pow(arm.y, 2));

            arm.x = arm.x / armNorm;
            arm.y = arm.y / armNorm;

            //torso vector
            var torso = { x: 0.0, y: 0.0 };
            torso.x = shoulder.x - hip.x;
            torso.y = shoulder.y - hip.y;
            let torsoNorm = Math.sqrt(Math.pow(torso.x, 2) + Math.pow(torso.y, 2));

            torso.x = torso.x / torsoNorm;
            torso.y = torso.y / torsoNorm;

            //dot product between arm vector and torso vector
            var armTorsoDotProduct = dotProduct(arm, torso);
            var armTorsoAngle = Math.acos(armTorsoDotProduct) * 180.0 / Math.PI;

            //dot product between forearm vector and upper Arm vector
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
            var direction;
            var prevAngle;

            if (side.localeCompare("left") === 0) {
                status = leftStatus;
            }
            else {
                status = rightStatus;
            }

            if (armTorsoAngle < 20) {
                if (!status.repStarted) {
                    status.repStarted = true;
                    status.goalAchieved = false;
                    status.moved = false;
                }
                else {
                    //at the end of a rep
                    if (status.goalAchieved)                
                    {
                        status.reps = status.reps + 1;
                        counter.innerHTML = status.reps;
                        status.repStarted = false;
                        status.goalAchieved = false;
                        status.moved = false;
                    }
                    else
                    {
                        if (status.moved) {
                            alertMessage.innerHTML = "Nu ai ridicat mâna " + (side === "left" ? "stângă" : "dreaptă") + " suficient de sus!";
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
            else if (armTorsoAngle >= 20 && armTorsoAngle <= 85)
            {
                if (status.repStarted) {
                    if (upperArmForearmAngle < 160) {
                        alertMessage.innerHTML = "Nu ai ținut brațele drepte";
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
            else if (armTorsoAngle > 85 && armTorsoAngle < 95) {
                if (upperArmForearmAngle >= 170) {
                    if (status.repStarted) {
                        status.goalAchieved = true;
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