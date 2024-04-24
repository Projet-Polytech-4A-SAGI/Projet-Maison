const tal = require("fr-compromise");
const controller = require('./Controller/controller.js');
const volet = [controller.Shutter1, controller.Shutter2]
const lights = [controller.Light1, controller.Light2, controller.Light3]
const radiateurs = [controller.Radiator1, controller.Radiator2]
tal.plugin({
    tags:{
      Heat: {},
      Light: {},
      Shutter: {},},
	words:{
		chauffage : "Heat",
		radiateur : "Heat",
		volet : "Shutter",
		fenetre : "Shutter",
		fenêtre : "Shutter",
		fenêtres : "Shutter",
		store : "Shutter",
		lampe : "Light",
		lumiere : "Light",
		chauffages : "Heat",
		radiateurs : "Heat",
		volets : "Shutter",
		fenetres : "Shutter",
		stores : "Shutter",
		lampes : "Light",
		lumieres : "Light",
		lumières : "Light",
		lumière : "Light"

	}
	})

msg = tal("Augmente le chauffage dans le salon à 22 degres. Ouvre le volet de la chambre. Eteint la lumière des toilettes. Casse moi le radiateur du garage");
sentences = msg.sentence().out("array");
sentences.forEach(element => {
    parse(element);

})

function parse(msg)
{

channel = client.channels.cache.get(channel_id)
let doc = tal(msg);
let boolChauffage = doc.has('#Heat');
let boolVolet = doc.has('#Shutter');
let boolLight = (doc.has("#Light"));
let piece = -1
let val = doc.numbers().get();
var pieces = ["chambre","salon","toilettes"];
if(doc.has("chambre"))
{
    piece = 1;
}
else if(doc.has("salon"))
{
    piece = 2;
}
else if(doc.has("toilette") || doc.has("toilettes"))
{
    piece = 3;
}
else
{
    let reply = "La pièce n'est pas prise en compte ou n'existe pas.\r\nVeuillez utiliser les pièces suivantes:"
    reply = reply + "\r\n- Chambre\r\n- Salon\r\n- Toilettes"
    channel.send(reply)
    return null
}
if (boolChauffage) {
    try
    {
        if(val.length != 1)
        {
            throw new Error();
        }
    radiateurs[piece-1].toggleRadiator(val[0]);
    channel.send('Le radiateur de la pièce "'+pieces[piece-1]+'" a été réglé à '+val[0]+"°");

    }
    catch(e)
    {
        channel.send("Votre instruction est incorrecte, veuillez réessayer.");

    }

}
else if (boolVolet) {
    try {
        let found = false
            if (doc.has("{ouvrir}")) {
                found = true
                if(!volet[piece-1].getVoletState())
                {
                volet[piece-1].toggleVolet();
                channel.send('Le volet de la pièce "'+pieces[piece-1]+'" a été ouvert');
                }
                else
                {
                    channel.send('Le volet est déjà ouvert');

                }

            }
            else if (doc.has("{fermer}")) {
                found = true
                if(!volet[piece-1].getVoletState())
                {
                volet[piece-1].toggleVolet();
                channel.send('Le volet de la pièce "'+pieces[piece-1]+'" a été fermé');
                }
                else
                {
                    channel.send('Le volet est déjà fermé');
                }

            }
        if(!found)
        {
            channel.send("Votre instrcution n'est pas reconnue. Veuillez utiliser les verbes \"ouvrir\" ou \"fermer\".");
        }
    } catch (e) {
        channel.send("Votre instruction est incorrecte, veuillez réessayer.");
     };
}
else if (boolLight) {
    try {
        let found = false
            if (doc.has("{allumer}")) {
                found = true
                if(lights[piece-1].getLightState())
                {
                    lights[piece-1].toggleLight();
                    channel.send('La lampe de la pièce "'+pieces[piece-1]+'" a été allumée');
                }
                else
                {
                    channel.send('La lampe est déjà allumée');
                }

            }
            else if (doc.has("{eteindre}")) {
                found = true
                if(!lights[piece-1].getLightState())
                {
                lights[piece-1].toggleLight();
                channel.send('La lampe de la pièce "'+pieces[piece-1]+'" a été éteinte');
                }
                else
                {
                    channel.send('La lampe est déjà allumée');
                }

            }
        if(!found)
        {
            channel.send("Votre instrcution n'est pas reconnue. Veuillez utiliser les verbes \"allumer\" ou \"éteindre\".");
        }
    } catch (e) {
        channel.send("Votre instruction est incorrecte, veuillez réessayer.");
     };
}
else
{
    
}

}