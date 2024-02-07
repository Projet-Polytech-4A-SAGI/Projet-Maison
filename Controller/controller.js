console.log("controller.js : Début");

var mafunction = function(user)
{
console.log("controller.js : mafonction a été appelé par "+user);
}

console.log("controller.js : Fin");

module.exports = {
 mafunction : mafunction
 }
