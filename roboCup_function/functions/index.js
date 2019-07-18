const functions = require('firebase-functions');
const admin = require("firebase-admin");

const appOptions = JSON.parse(process.env.FIREBASE_CONFIG);
const app = admin.initializeApp(appOptions, "app");
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
exports.autoMatchUpdate = functions.firestore.document("/matches/{matchID}").onUpdate((change, context) => {
    const nextMatchID = change.after.data().nextMatch;
    if (typeof nextMatchID === "undefined") {
        return;
    }

    if (change.after.data().state === "DONE" && change.before.data().state !== "DONE") {
        const teamType = context.params.matchID.split("-")[1];
        const winnerID = change.after.data().teamAScore > change.after.data().teamBScore ? change.after.data().teamAId : change.after.data().teamBId;
        const winnerLogo = change.after.data().teamAScore > change.after.data().teamBScore ? change.after.data().teamALogo : change.after.data().teamBLogo;
        const winnerName = change.after.data().teamAScore > change.after.data().teamBScore ? change.after.data().teamAName : change.after.data().teamBName;

        if (teamType === "1") {
            app.firestore().doc("/matches/" + nextMatchID).update({
                teamAId: winnerID,
                teamALogo: winnerLogo,
                teamAName: winnerName
            });
        }
        else {
            app.firestore().doc("/matches/" + nextMatchID).update({
                teamBId: winnerID,
                teamBLogo: winnerLogo,
                teamBName: winnerName
            });
        }
        
        //only for third place match
        const nextLoserMatchID = change.after.data().nextLoserMatch;
        if (typeof nextLoserMatchID !== "undefined") {
            const LoserID = change.after.data().teamAScore > change.after.data().teamBScore ? change.after.data().teamBId : change.after.data().teamAId;
            const LoserLogo = change.after.data().teamAScore > change.after.data().teamBScore ? change.after.data().teamBLogo : change.after.data().teamALogo;
            const LoserName = change.after.data().teamAScore > change.after.data().teamBScore ? change.after.data().teamBName : change.after.data().teamAName;

            if (teamType === "1") {
                app.firestore().doc("/matches/" + nextLoserMatchID).update({
                    teamAId: LoserID,
                    teamALogo: LoserLogo,
                    teamAName: LoserName
                });
            }
            else {
                app.firestore().doc("/matches/" + nextLoserMatchID).update({
                    teamBId: LoserID,
                    teamBLogo: LoserLogo,
                    teamBName: LoserName
                });
            }
        }
    }
});