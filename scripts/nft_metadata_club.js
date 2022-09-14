var fs = require('fs');

var collectible =["Wayne Gretzky", "Leslie Claudius", "Alexander Ovechkin", "Sidney Crosbar", "Terry Sawchuk", "Steve Yzerman", "Bobby Orr", "Jaromir Jagr", "Dominik Hasek", "Joe Pavelski"];
// var country = ["Canada", "India", "Russia", "Canada", "Canada", "Canada", "Canada", "Czech", "Czech", "America"];
// var age = [61, 2012, 36, 35, 1970, 57, 74, 50, 57, 38];
// var category = ["Player", "Player", "Player", "Player", "Goaltender", "Player", "Player", "Right Wing", "Goaltender", "Player"];
var description = ["By age 10 Gretzky had scored an astonishing 378 goals and 139 assists in just one season with the Brantford Nadrofsky Steelers", "Leslie Claudius was the first hockey player to have competed in four Olympics", "At the age of 19 Ovechkin was named to the Russian national team for the 2004 World Cup of Hockey", "Sidney Crosby was selected first overall by the Penguins in the 2005 NHL Entry Draft", "Terry Sawchuk won the Calder Trophy, earned the Vezina Trophy in four different seasons", "Yzerman was considered a leading candidate for the captaincy of Team Canada in 1998", "Orr inspired the game of hockey with his command of the two-way game", "Jaromir Jagr is the most productive European player who has ever played in the NHL", "I saw my whole career flash before my eyes from the first time my parents took me to a game until now", "Pavelski earned the nickname Little Joe from Sharks announcer Randy Hahn"];

for (let i = 1; i <= 10; i++) {
    var json = {}
    json.name = collectible[i-1];
    json.description = description[i-1];
    json.image = "ipfs://bafybeigtofxfh4oi3iabty4rllombk4ni5zpw7fcspm4fl5ybxkadojfl4" + "/" + i + ".PNG";

    fs.writeFileSync('' + i, JSON.stringify(json));
}
