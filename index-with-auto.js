import async from 'async'
import MongoDB from 'mongodb'

function connect(callback) {
  MongoDB.MongoClient.connect('mongodb://localhost/test', callback)
}

function findEveryone(callback, {db}) {
  const people = db.collection('people')
  people.find().toArray((err, everyone) => { callback(err, everyone) })
}
function extractPersonName(callback, {everyone}){
  callback(null, everyone.map((p)=> p.name));
}

const tasks = {
  db: connect,
  everyone: ['db', findEveryone],
  names: ['everyone', extractPersonName]
}
async.auto(tasks, (err, {db, names}) => {
  db && db.close()
  if (err) {
    console.log('Something went wrong', err);
    return;
  }
  console.log(names)
  
})
