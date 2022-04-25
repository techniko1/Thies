window.addEventListener('DOMContentLoaded', () => init())
function init() {
    
    window.instart = true;
    window.abc = false;
    window.bcd = false;

    canvas = document.getElementById('game');
    context = canvas.getContext('2d');

    

    let d = document.getElementById("game");
    let scale = 1/Math.max(d.clientHeight/window.innerHeight);
    d.style.transform='scale('+ parseFloat(scale-(scale/100*5)); +")";

    window.Rect_größe = Math.floor(canvas.height/21);
    window.draw_Rect_größe = Math.floor(canvas.height/30);

    Colors  = [
        "rgb(0, 240, 240)",//   Türkis  I
        "rgb(0, 0, 240)",//     Blau    J
        "rgb(240, 160, 0)",//   Orange  L
        "rgb(240, 240, 0)",//   Gelb    O
        "rgb(160, 0, 240)",//   Lila    T
        "rgb(0, 240, 0)",//     Grün    S
        "rgb(240, 0, 0)"]//     Rot     Z

    window.Hightscore = 0;

    window.bps = 10;
    window.bfps = 1;

    window.level = 1;
    window.Points = 0;
    window.glines = 0;

    window.Stored_Block = -1;
    window.Stored_Block_old = -1;
    window.Was_Stored = false;

    window.behrührt = false;
    window.Gameover = false;

    window.ticktime = performance.now(); 
    window.runtertime = performance.now();
    window.blocktime = performance.now();
    window.dd = performance.now();
    window.loosetime = performance.now();

    window.runter_gedrückt = false;
    window.links_gedrückt = false;
    window.rechts_gedrückt = false;

    window.next_Figurs_List = [];
    window.Gamestate = [];
    window.Blöcke_x = 10;
    window.Blöcke_y =21;

    Reset();
    New();
    window.requestAnimationFrame(gameLoop);
}

    

    class Figure{
    Tetreminos =[
    [[1, 5, 9, 13], [4, 5, 6, 7], [2, 6, 10, 14], [8, 9, 10, 11]],//I
    [[4,8,9,10],[5,6,9,13],[8,9,10,14],[5,9,12,13]], //             J
    [[8,9,10,12],[4,5,9,13],[6,8,9,10],[5,9,13,14]], //             L
    [[5,6,9,10],[5,6,9,10],[5,6,9,10],[5,6,9,10]], //               O
    [[4,5,6,9],[1,4,5,9],[1,4,5,6],[1,5,6,9]], //                   T
    [[1,2,4,5],[1,5,6,10],[5,6,8,9],[0,4,5,9]], //                  S
    [[0,1,5,6],[2,5,6,9],[4,5,9,10],[1,4,5,8]]] //                  Z

        constructor(x,y,type) {
            type==-1 ? this.type = next_Figurs_List[0] : this.type=type
            this.x=x;
            this.y=y;
            this.color=Colors[this.type];
            this.rotation =0;
            this.Hologramm = new Hologramm(this)
        }
        rotate(direction) {
            if (direction) this.rotation = (this.rotation +1)% this.Tetreminos[this.type].length;
            else this.rotation = (this.rotation -1)% this.Tetreminos[this.type].length;
        }
        get pos(){return this.Tetreminos[this.type][this.rotation];
        }
    }
    class Hologramm{
        
        Tetreminos = [
            [[1, 5, 9, 13], [4, 5, 6, 7], [2, 6, 10, 14], [8, 9, 10, 11]],//I
            [[4,8,9,10],[5,6,9,13],[8,9,10,14],[5,9,12,13]], //             J
            [[8,9,10,12],[4,5,9,13],[6,8,9,10],[5,9,13,14]], //             L
            [[5,6,9,10],[5,6,9,10],[5,6,9,10],[5,6,9,10]], //               O
            [[4,5,6,9],[1,4,5,9],[1,4,5,6],[1,5,6,9]], //                   T
            [[1,2,4,5],[1,5,6,10],[5,6,8,9],[0,4,5,9]], //                  S
            [[0,1,5,6],[2,5,6,9],[4,5,9,10],[1,4,5,8]]] //                  Z
        
        constructor(Creator) {
            this.type = Creator.type;
            this.y = Creator.y;
            this.x = Creator.x;
            this.color = Colors[this.type];
            this.rotation = Creator.rotation;
            this.Creator = Creator;
        }
        update(){
            this.y = this.Creator.y;
            this.x = this.Creator.x;
            this.rotation = this.Creator.rotation;
            while (Hologramm_is_possible(this)) this.y++;
            this.y--;
        }
        get pos(){return this.Tetreminos[this.type][this.rotation]}
        }

        class Draw_Figure{
            Tetreminos = [
                [1, 5, 9, 13],  //I
                [5,6,9,13],     //J
                [5,9,13,14],    //L
                [5,6,9,10],     //O
                [1,5,6,9],      //T
                [1,5,6,10],     //S
                [2,5,6,9],      //Z
            ]
           constructor(type){
                this.type = type              
                this.color = Colors[this.type]
            }
            get pos(){
                if (this.type == -1) return [-1]
                return this.Tetreminos[this.type]}
            }

    
    function New(){
        blocktime = performance.now();;
        dd = performance.now();-0.5;
        runtertime = performance.now();+0.5;
        new_Figur = new Figure(3,0,-1);
        while (Possible())new_Figur.y += -1;
        new_Figur.y += 1
        if (!Possible())Gameover = true;
        Was_Stored = false;
    }

    function next_Figure() {
        next_Figurs_List.shift;
        next_Figurs_List.push(Math.floor(Math.random()*new_Figur.Tetreminos.length));
        New();
    }

    function Possible() {
        let possible = true;
        for (let Höhe = 0; Höhe < 4; Höhe++){
            for (let Breite = 0; Breite < 4; Breite++){
                let index = Höhe * 4 + Breite;                
                if(new_Figur.pos.includes(index)){
                    if (new_Figur.y+Höhe>20) possible = false
                    else if (new_Figur.y+Höhe<0) possible = false
                    else if (Gamestate[new_Figur.y+Höhe][new_Figur.x+Breite] != 0) possible = false
                }
            
            }}
        return possible;
    }
    function Hologramm_is_possible(Obj) {
        let possible = true;
        for (let Höhe = 0; Höhe < 4; Höhe++){
            for (let Breite = 0; Breite < 4; Breite++){
                let index = Höhe * 4 + Breite;                
                if(Obj.pos.includes(index)){
                    if (Obj.y+Höhe>20) possible = false
                    else if (Obj.y+Höhe<0) possible = false
                    else if (Gamestate[Obj.y+Höhe][Obj.x+Breite] != 0) possible = false
                }
            
            }}
        return possible;
    }
    function Left() {
        new_Figur.x--;
        if (!Possible) new_Figur.x++;
    }
    function Right() {
        new_Figur.x++;
        if (!Possible) new_Figur.x--;
    }

    function down(Playermade) {
        if (Playermade) Points += bfps;
        new_Figur.y++;
        if (!Possible()) {
            new_Figur.y--;
            behrührt = true;
            if (performance.now()-loosetime <=1 &&!Playermade) {
                return
            }
            for (let Höhe = 0; Höhe < 4; Höhe++){
                for (let Breite = 0; Breite < 4; Breite++){
                    let index = Höhe * 4 + Breite;
                    if(new_Figur.pos.includes(index)) {
                        console.log(new_Figur.y+Höhe,new_Figur.x+Breite,new_Figur.type+1); 
                        Gamestate[new_Figur.y+Höhe][new_Figur.x+Breite] = new_Figur.type+1;}
            }}
            next_Figure();
            CheckLayer();
        }
        loosetime = performance.now();
        behrührt = false;
        return false;}

    function CheckLayer() {
        let lines = 0;
        Gamestate.forEach((value,index) => {
            if (!value.includes(0)) {
                lines++;
                for (let h = index; h > 0 ; h--) {
                    Gamestate[h] = Gamestate[h-1];
                }
                Gamestate[0] = [];
                for (let X = 0; X <= Blöcke_x; X++) {
                    Gamestate[0].push(0);
            }
        }});
        glines += lines
        if (lines == 0) Points +=0;
        else if (lines == 1) Points +=100*bfps;
        else if (lines == 2) Points +=300*bfps;
        else if (lines == 3) Points +=500*bfps;
        else if (lines == 4) Points +=800*bfps;
        CheckLevel();
    }

    function Store() {
        if (Was_Stored) return false;
        if (Stored_Block== -1) {
            Stored_Block = new_Figur.type;
            next_Figure();
            Was_Stored = true;
            return false
        }
        Stored_Block_old = Stored_Block;
        Stored_Block = new_Figur.type;
        new_Figur = Figure(Blöcke_x%2==0? Blöcke_x/2-2 : 3,0,Stored_Block_old);
        while (Possible) new_Figur.y--
        new_Figur.y++
        Was_Stored =true
    }

    function rotate(direction) {
        new_Figur.rotate(direction);
        if (!Possible) {
            new_Figur.y++
            if (!Possible) {
                new_Figur.y--
                new_Figur.x--
                if (!Possible) {
                    new_Figur.x+=2
                    if (!Possible) {
                        new_Figur.x--
                        new_Figur.rotate(!direction)
        }}}}}

    function Reset() {
        next_Figurs_List = [];
        for (let i = 0; i < 5; i++) next_Figurs_List.push(Math.floor(Math.random()*7));
        for (let Y = 0; Y <= Blöcke_y-1; Y++) {
            Gamestate.push([])
            for (let X = 0; X <= Blöcke_x-1; X++) {
                Gamestate[Y].push(0)
             }}
        runter_gedrückt = false;
        links_gedrückt = false;
        rechts_gedrückt = false;

        glines = 0;
        Points = 0;
        Gameover = false;
        bfps = 1;
        level = 1;
        Points = 0;
        glines = 0;
        Stored_Block = -1;
        Stored_Block_old = -1;
        Was_Stored = false;
        bps = 10;
        loosetime = performance.now();
        ticktime = performance.now();
        blocktime = performance.now();
        runtertime = performance.now();
    }

    function CheckLevel(){
        bfps = Math.round((glines+10)/10);
        bps = 9+bfps;
    }

    function read() {
        
    }

    function write(text) {
        
    }

    
    function draw_Bord(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        //context.clearRect(0, 0, canvas.width, canvas.height);//SB
        //context.clearRect(0, 0, canvas.width, canvas.height);//NB
        //Stored Block zeichen
        // for (let Höhe = 0; Höhe < 4; Höhe++) {
        //     for (let Breite = 0; Breite < 4; Breite++) {
        //         let index = Höhe * 4 + Breite;
        //         let SF = new Draw_Figure(Stored_Block)
        //         if (SF.pos.includes(index)) {}//Stored Block zeichen 
        //     }
        // }
        // //Next Figurs zeichen
        // for (let i = 0; i < 3; i++) {
        //     for (let Höhe = 0; Höhe < 4; Höhe++) {
        //         for (let Breite = 0; Breite < 4; Breite++) {
        //             let index = Höhe * 4 + Breite;
        //             let NB = new Draw_Figure(next_Figurs_List[i+1])
        //             if (NB.pos.includes(index)) {}//Stored Block zeichen 
        //         }
        //     }
        // }
        //Gamsetate zeichen nummer = color|0=leer
        for (let Höhe = 0; Höhe < Blöcke_y; Höhe++) {
            for (let Breite = 0; Breite < Blöcke_x; Breite++) {
                if (Gamestate[Höhe][Breite]===0) Draw_Rect(Breite,Höhe,Rect_größe,"white");//leere Zeichnen
                else Draw_Rect(Breite,Höhe,Rect_größe,Colors[Gamestate[Höhe][Breite]-1]); //print Colors(Gamestate[h][b])
            }
        }
        // Hologramm zeichen
        new_Figur.Hologramm.update();
        for (let Höhe = 0; Höhe < 4; Höhe++) {
            for (let Breite = 0; Breite < 4; Breite++) {
                let index = Höhe * 4 + Breite;
                if (new_Figur.Hologramm.pos.includes(index)) Draw_Rect(Breite+new_Figur.Hologramm.x,Höhe+new_Figur.Hologramm.y,Rect_größe,"gray");//Hologramm zeichnen
            }
        }
        // Figur zeichen
        for (let Höhe = 0; Höhe < 4; Höhe++) {
            for (let Breite = 0; Breite < 4; Breite++) {
                let index = Höhe * 4 + Breite;
                if (new_Figur.pos.includes(index)) Draw_Rect(Breite+new_Figur.x,Höhe+new_Figur.y,Rect_größe,new_Figur.color);//block zeichen
            }
        }
    }

    function Draw_Rect(pos_X,pos_Y,Größe,color){
        context.fillStyle = color;
        context.fillRect(pos_X * Größe, pos_Y * Größe, Größe-2, Größe-2);
    }
 
    let times=[];
    let fps;
    let fps_count;
    let rAF = null;
    let count = 0;
function gameLoop(timeStamp) {
    rAF = requestAnimationFrame(gameLoop);
    const now  = performance.now();
    while (times.length>0&&times[0]<=now-1000){
        times.shift();
    }
    times.push(now);
    fps = times.length;
    
        // if (instart) {
            
        // } else{
    if (++count/fps>= 1/bfps) {
        down(false);
        count = 0;
    }
    if (runter_gedrückt) {if (performance.now()-blocktime >= 1/bps) blocktime = performance.now(); down(true);}
    if (rechts_gedrückt) {if (performance.now()-blocktime >= 1/bps) blocktime = performance.now(); Right();}
    if (links_gedrückt) {if (performance.now()-blocktime >= 1/bps) blocktime = performance.now(); Left();}
    draw_Bord();


    }
let pressed = false
document.addEventListener("keydown",(e) => {
    if (e.code === "ArrowUp") if (rAF!==null) {
        pressed===false ? window.cancelAnimationFrame(rAF) : window.requestAnimationFrame(gameLoop);
        pressed===false ? pressed = true : pressed =false
    }
    runter_gedrückt =true;
})
document.addEventListener("keyup",(e) => {
    if (e.code === "ArrowUp") runter_gedrückt =false;
})