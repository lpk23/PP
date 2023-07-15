const kladrApi = require("kladrapi-for-node");

async function search(req, res) {
    const kladr = new kladrApi();
    const { ParentType, ParentId, contentType, query, withParent, limit } = req.query;

    const kladrQuery = {
        ParentType,
        ParentId,
        contentType,
        query,
        withParent,
        limit
    };
    kladr.getData(kladrQuery, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(result);
        }
    });
}
module.exports={
    search
}