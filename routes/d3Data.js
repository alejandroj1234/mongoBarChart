var express = require('express');
var router = express.Router();

/*
 * GET d3Chart.
 */
router.get('/d3Chart', function(req, res) {
    var db = req.db;
    var collection = db.get('d3Chart');
    collection.find({},{},function(e,docs){
        res.json(docs);
    });
});

/*
 * POST to addChartValue.
 */
router.post('/addChartValue', function(req, res) {
    var db = req.db;
    var collection = db.get('d3Chart');
    console.log(req.body)
    collection.insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to deleteBar.
 */
router.delete('/deleteBar/:id', function(req, res) {
    var db = req.db;
    var collection = db.get('d3Chart');
    var barToDelete = req.params.id;
    collection.remove({ '_id' : barToDelete }, function(err) {
        res.send((err === null) ? { msg: '' } : { msg:'error: ' + err });
    });
});



module.exports = router;
