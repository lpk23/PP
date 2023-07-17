const KladrApi = require("./kladr_api");

async function search(req, res) {
    const kladr = new KladrApi();
    const { ParentType, ParentId, contentType, query, withParent, limit } = req.query;

    const kladrQuery = {
        ParentType,
        ParentId,
        contentType,
        query,
        withParent,
        limit
    };

    try {
        const result = await kladr.getData(kladrQuery);

        // Filter out the entry with id "Free" from the result
        const filteredResult = result.result.filter(item => item.id !== "Free");

        res.json(filteredResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    search
};
