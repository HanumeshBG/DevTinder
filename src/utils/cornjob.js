const corn = require('node-cron');
const {subDays, startOfDay, endOfDay} = require('date-fns')
const ConnectionRequest = require('../models/connectionRequest');
const sendEmail = require('./sendEmail');

corn.schedule("51 16 * * *", async () => {
    // console.log("Cron job running every second" + new Date());
    try {
        const yesterday = subDays(new Date(), 0);
        const yesterdayStart = startOfDay(yesterday);
        const yesterdayEnd = endOfDay(yesterday);

        const pendingRequests = await ConnectionRequest.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd
            }
        }).populate("fromUserId toUserId")

        const listOfEmails = [...new Set(pendingRequests.map(request => request.toUserId.email))];

        for(let email of listOfEmails){
            const res = await sendEmail.run(
                `Pending Connection Requests by : ${email}`,
             `You have pending connection requests from ${email}. Please review them on DevTinder.`
            );
        }
    } catch (err) {
        console.error("Error in cron job: " + err.message);
    }

})