// Load the Cloudant library.
var Cloudant = require('@cloudant/cloudant')

var me = 'IBMid-550001A3VQ'
var username = 'redsouredstraddessesiffe'
var token = '32b84acdac24b6631f99727c559c35d8fde98a3d'

var cred = {
    "apikey": "JyY08Y6NfDNhuAz83LiWqYSRsnpbJTnxagsWcqQJD9OJ",
    "host": "ff56d9fe-efa2-49c0-92e8-6d6e1cc21b27-bluemix.cloudant.com",
    "iam_apikey_description": "Auto generated apikey during resource-key operation for Instance - crn:v1:bluemix:public:cloudantnosqldb:us-south:a/03500e756b90458682ddcc9433386e7a:ee8754d3-f23f-4787-9f3a-e9e80fb790cc::",
    "iam_apikey_name": "auto-generated-apikey-72ff1e5e-f214-4b97-bd6c-9a004ab25cb2",
    "iam_role_crn": "crn:v1:bluemix:public:iam::::serviceRole:Manager",
    "iam_serviceid_crn": "crn:v1:bluemix:public:iam-identity::a/03500e756b90458682ddcc9433386e7a::serviceid:ServiceId-6d1575a4-a789-47e4-9b46-eea413b62bf2",
    "password": "7d14b076dd3540e34e5181d886d8c95733470a05fecee2601238a70aa6b3da18",
    "port": 443,
    "url": "https://ff56d9fe-efa2-49c0-92e8-6d6e1cc21b27-bluemix:7d14b076dd3540e34e5181d886d8c95733470a05fecee2601238a70aa6b3da18@ff56d9fe-efa2-49c0-92e8-6d6e1cc21b27-bluemix.cloudant.com",
    "username": "ff56d9fe-efa2-49c0-92e8-6d6e1cc21b27-bluemix"
}

// Initialize the library with my account.
var cloudant = Cloudant(cred.url)

cloudant.db.list(function(err, allDbs) {
  console.log('All my databases: %s', allDbs.join(', '))
});

var db = cloudant.db.use('sensor')

console.log(db.allDbs)

/*db.list(function (err, data) {
    console.log(err, data);
})*/

var doc_name = '3f4edec95c3df1e0338512ccbd3f1e6451c0d2d1'

db.index(function(er, result) {
    if (er) {
      throw er;
    }
  
    console.log('The database has %d indexes', result.indexes.length);
    for (var i = 0; i < result.indexes.length; i++) {
      console.log('  %s (%s): %j', result.indexes[i].name, result.indexes[i].type, result.indexes[i].def);
    }
});



module.exports.poll = function(callback) {
    db.find({
        selector:{"timestamp": {"$exists" : true}},
        limit: 1,
        sort: [{"timestamp": "desc"}],
        fields: ['_id', 'timestamp', 'payload'],
    }, function(er, result) {
        if (er) {
            throw er;
        }

        console.log('Found %d documents with timestamp', result.docs.length);

        if (result.docs.length > 0) {
            callback(result.docs[0])
        } else {
            callback(null)
        }
    });
}

/*db.search(doc_name, 'timestamp-index', {q:'_id:>0'}, function(er, result) {
    if (er) throw er;

    console.log('Showing %d out of a total %d books by Dickens', result.rows.length, result.total_rows);
    for (var i = 0; i < result.rows.length; i++) {
        console.log('Document id: %s', result.rows[i].id);
    }
})*/