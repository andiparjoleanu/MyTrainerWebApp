evaluate = function (currentPose) {
    leftHip = currentPose.pose.leftHip;
    rightHip = currentPose.pose.rightHip;

    leftKnee = currentPose.pose.leftKnee;
    rightKnee = currentPose.pose.rightKnee;

    leftAnkle = currentPose.pose.leftAnkle;
    rightAnkle = currentPose.pose.rightAnkle;

    if (leftHip.confidence > 0.2 &&
        rightHip.confidence > 0.2 &&
        leftKnee.confidence > 0.2 &&
        rightKnee.confidence > 0.2 &&
        leftAnkle.confidence > 0.2 &&
        rightAnkle.confidence > 0.2) {

        //right leg vector
        var rightLeg = { x: 0.0, y: 0.0 };
        rightLeg.x = rightHip.x - rightAnkle.x;
        rightLeg.y = rightHip.y - rightAnkle.y;
        let rightLegNorm = Math.sqrt(Math.pow(rightLeg.x, 2) + Math.pow(rightLeg.y, 2));

        rightLeg.x = rightLeg.x / rightLegNorm;
        rightLeg.y = rightLeg.y / rightLegNorm;

        //left leg vector
        var leftLeg = { x: 0.0, y: 0.0 };
        leftLeg.x = leftHip.x - leftAnkle.x;
        leftLeg.y = leftHip.y - leftAnkle.y;
        let leftLegNorm = Math.sqrt(Math.pow(leftLeg.x, 2) + Math.pow(leftLeg.y, 2));

        leftLeg.x = leftLeg.x / leftLegNorm;
        leftLeg.y = leftLeg.y / leftLegNorm;

        //left femur vector
        var leftFemur = { x: 0.0, y: 0.0 };
        leftFemur.x = leftHip.x - leftKnee.x;
        leftFemur.y = leftHip.y - leftKnee.y;
        let leftFemurNorm = Math.sqrt(Math.pow(leftFemur.x, 2) + Math.pow(leftFemur.y, 2));

        leftFemur.x = leftFemur.x / leftFemurNorm;
        leftFemur.y = leftFemur.y / leftFemurNorm;

        //right femur vector
        var rightFemur = { x: 0.0, y: 0.0 };
        rightFemur.x = rightHip.x - rightKnee.x;
        rightFemur.y = rightHip.y - rightKnee.y;
        let rightFemurNorm = Math.sqrt(Math.pow(rightFemur.x, 2) + Math.pow(rightFemur.y, 2));

        rightFemur.x = rightFemur.x / rightFemurNorm;
        rightFemur.y = rightFemur.y / rightFemurNorm;

        //left tibia vector
        var leftTibia = { x: 0.0, y: 0.0 };
        leftTibia.x = leftAnkle.x - leftKnee.x;
        leftTibia.y = leftAnkle.y - leftKnee.y;
        let leftTibiaNorm = Math.sqrt(Math.pow(leftTibia.x, 2) + Math.pow(leftTibia.y, 2));

        leftTibia.x = leftTibia.x / leftTibiaNorm;
        leftTibia.y = leftTibia.y / leftTibiaNorm;

        //right Tibia vector
        var rightTibia = { x: 0.0, y: 0.0 };
        rightTibia.x = rightAnkle.x - rightKnee.x;
        rightTibia.y = rightAnkle.y - rightKnee.y;
        let rightTibiaNorm = Math.sqrt(Math.pow(rightTibia.x, 2) + Math.pow(rightTibia.y, 2));

        rightTibia.x = rightTibia.x / rightTibiaNorm;
        rightTibia.y = rightTibia.y / rightTibiaNorm;

        //angle between legs
        var legsDotProduct = dotProduct(leftLeg, rightLeg);
        var legsAngle = Math.acos(legsDotProduct) * 180.0 / Math.PI;

        //angle between left femur and left tibia
        var leftFemurTibiaDotProduct = dotProduct(leftFemur, leftTibia);
        var leftFemurTibiaAngle = Math.acos(leftFemurTibiaDotProduct) * 180.0 / Math.PI;

        //angle between right femur and right tibia
        var rightFemurTibiaDotProduct = dotProduct(rightFemur, rightTibia);
        var rightFemurTibiaAngle = Math.acos(rightFemurTibiaDotProduct) * 180.0 / Math.PI;

        var status = leftStatus;

        var counter = document.getElementById("counterUnilateral");

        if (leftFemurTibiaAngle > 165 && rightFemurTibiaAngle > 165) {
            if (!status.repStarted) {
                if (legsAngle > 5 && legsAngle < 90) {
                    status.repStarted = true;
                    status.goalAchieved = false;
                    status.moved = false;
                }
            }
            else {
                if (status.goalAchieved) {
                    status.reps = status.reps + 1;
                    counter.innerHTML = status.reps;
                    status.repStarted = false;
                    status.goalAchieved = false;
                    status.moved = false;
                }
                else {
                    if (status.moved) {
                        alertMessage.innerHTML = "Nu te-ai lăsat suficient de jos!";
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
        else if (leftFemurTibiaAngle > 105 && leftFemurTibiaAngle <= 165 && rightFemurTibiaAngle > 105 && rightFemurTibiaAngle <= 165) {
            if (status.repStarted) {
                if (!status.moved) {
                    status.moved = true;
                }
            }
        }
        else if (leftFemurTibiaAngle > 80 && leftFemurTibiaAngle <= 105 && rightFemurTibiaAngle > 80 && rightFemurTibiaAngle <= 105) {
            if (status.repStarted) {
                status.goalAchieved = true;
            }
        }
    }
};