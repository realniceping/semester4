const net = require('net');
const PORT = 7707
const host = '127.0.0.1';   

{
    //proto design
    //action: string,
    //choosen_item: string,
}
var connections = [];
class Game {
    p1;
    p2;
    p1_item = "";
    p2_item = "";
    somebody_action(){
        console.debug("[P1] = " + this.p1_item);
        console.debug("[P2] = " + this.p2_item);
        if(this.p1_item !== "" && this.p2_item !== ""){
            this.wincheck();
        }
    }
    wincheck(){
        console.debug("[WINCHECK] triggered")
        if(this.p1_item == "rock"){
            if(this.p2_item == "rock"){
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen ROCK, enemy choosen ROCK - DRAW"
                }))
                this.p2.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen ROCK, enemy choosen ROCK - DRAW"
                }))
            }
            if(this.p2_item == "paper"){
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen rock, enemy choosen paper - LOSE"
                }))
                this.p2.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen paper, enemy choose rock - WIN"
                }))
            }
            if(this.p2_item == "scissors"){
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen POCK, enemy choosen SCISSORS - WIN"
                }));
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen SCISSORS, enemy choosen ROCK - LOSE"
                }));
            }
        }
        if(this.p1_item == "paper"){
            if(this.p2_item == "rock"){
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen PAPER, enemy choosen ROCK - WIN"
                }))
                this.p2.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen ROCK, enemy choosen PAPER - LOSE"
                }))
            }
            if(this.p2_item == "paper"){
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen PAPER, enemy choosen PAPER - DRAW"
                }))
                this.p2.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen PAPER, enemy choose PAPER - DRAW"
                }))
            }
            if(this.p2_item == "scissors"){
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen PAPER, enemy choosen SCISSORS - LOSE"
                }));
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen SCISSORS, enemy choosen PAPER - WIN"
                }));
            }
        }
        if(this.p1_item == "scissors"){
            if(this.p2_item == "rock"){
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen PAPER, enemy choosen ROCK - WIN"
                }))
                this.p2.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen ROCK, enemy choosen PAPER - LOSE"
                }))
            }
            if(this.p2_item == "paper"){
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen PAPER, enemy choosen PAPER - DRAW"
                }))
                this.p2.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen PAPER, enemy choose PAPER - DRAW"
                }))
            }
            if(this.p2_item == "scissors"){
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen PAPER, enemy choosen SCISSORS - LOSE"
                }));
                this.p1.write(JSON.stringify({
                    action: "winner",
                    note: "You choosen SCISSORS, enemy choosen PAPER - WIN"
                }));
            }
        }
    }
    constructor(c1, c2){
        this.p1 = c1;
        this.p2 = c2;
        this.p1.on('data', data => {
            const req = JSON.parse(data.toString())
            console.debug("[P1] SENDING DATA");
            this.p1_item = req.choosen_item;
            this.somebody_action();
        })
        this.p2.on('data', data => {
            const req = JSON.parse(data.toString());
            console.debug("[P2] = SENDING DATA" );
            this.p2_item = req.choosen_item;
            this.somebody_action();
        })
        this.p1_item = "";
        this.p2_item = "";
        const res = JSON.stringify({action: "game_begin"})
        this.p1.write(res);
        this.p2.write(res);
    }
}

const server = net.createServer((c) => {
    console.log('[SERVER] client connected');
    connections.push(c);
    if(connections.length == 2){
        const g1 = new Game(connections[0], connections[1]); 
        connections = [];
    }

    c.on('end', () => {
        console.log('[SERVER] client disconnected');
        c.pipe();
    });

    c.on('data', (data) => {
        const req = JSON.parse(data.toString());
        if(req.action !== "turn"){
            console.log(req.choosen_item);
        }
    })
})

server.listen(PORT, () => { 
  console.log('[SERVER] server bound');
});