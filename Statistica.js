const { Graduate, Employer, JobHistory } = require("./model");

async function getStat(request, response) {
    try {
        const graduateCount = await Graduate.count();
        const employerCount = await Employer.count();
        const jobHistoryCount = await JobHistory.count();

        const totalRecords = {
            graduateCount,
            employerCount,
            jobHistoryCount,
        };

        response.json(totalRecords);
    } catch (error) {

        console.error("Ошибка:", error);
        return response.status(500).json({ error: "Internal server error" });
    }
}

module.exports={
    getStat
}