// initialise a nextBusser object
var nb = makeNextBusser('ttc');

// to change agencies
nb.setAgency('ttc');

// to get all the routes -- this can take a callback or return a promise
var promise = nb.routesList(callerback);

promise.done(function(list) {
  console.log(list);
});

function callerback(routes) {
  console.log(list);
}