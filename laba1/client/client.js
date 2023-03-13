const net = require('net');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });

const PORT = 7707;
const host = '127.0.0.1';   
  

const client = net.createConnection({ port: PORT }, () => {
    
});

client.on('connect', () => {
    
    //begin here
    console.log('connected to server!');
    
})

client.on('error', () => {
    console.log("uncatched")
})

client.on('data', (data) => {
    const player_turn = () => {
        readline.question("choose your item(rock paper scissors)>> ", input_data => {
            if(input_data.toString() == "0"){
                client.end(() => {});
                client.pipe(client);
            }
            client.write(JSON.stringify({
                action: "turn",
                choosen_item: input_data
            }));
        })
    }
    const res = JSON.parse(data.toString());
    if(res.action == "game_begin"){
        player_turn();
    }
    if(res.action == "winner"){
        console.log(res.note)
        // client.pipe();
    }
});

client.on('end', () => {
  console.log('disconnected from server');
});