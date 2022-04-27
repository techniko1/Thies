window.addEventListener('DOMContentLoaded', () => init())
function init() {
    
    window.instart = true;
    window.abc = false;
    window.bcd = false;

    canvas = document.getElementById('game');
    context = canvas.getContext('2d');

    next_Figurs_canvas = document.getElementById('next_Figurs');
    next_Figurs_context = next_Figurs_canvas.getContext('2d');

    Store_canvas = document.getElementById('Store');
    Store_context = Store_canvas.getContext('2d');
    
    // let scale = 1/Math.max(canvas.clientHeight/window.innerHeight);
    // canvas.style.width="500"
    // canvas.style.height="1050"

    // canvas.style.transform='scale('+ parseFloat(scale-(scale/100*5)); +")";
    
    
    window.Rect_größe = Math.floor(canvas.height/21);
    window.draw_Rect_größe = Math.floor(canvas.height/30);


    // let next_Figurs_scale = 1/Math.max(next_Figurs_canvas.clientHeight/(draw_Rect_größe*14));
    // let Store_scale = 1/Math.max(Store_canvas.clientHeight/(draw_Rect_größe*4));
    
    // next_Figurs_canvas.style.transform='scale('+ parseFloat(next_Figurs_scale); +")";
    // Store_canvas.style.transform='scale('+ parseFloat(Store_scale) +")";

    // Store_canvas.style.position="absolute"
    // next_Figurs_canvas.style.position="absolute"

    // Store_canvas.style.left=  canvas.getBoundingClientRect().left+'px'
    // Store_canvas.style.left = parseFloat(Store_canvas.style.left.substring(0,Store_canvas.style.left.length-2))-draw_Rect_größe*4
    // next_Figurs_canvas.style.left= canvas.getBoundingClientRect().right+(canvas.getBoundingClientRect().right/100)+'px'//substring
    
    // Store_canvas.style.top= canvas.getBoundingClientRect().top+"px"
    // next_Figurs_canvas.style.top= canvas.getBoundingClientRect().top+"px"

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

    window.dd=performance.now();

    window.behrührt = false;
    window.Gameover = false;
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
            type===-1 ? this.type = next_Figurs_List[0] : this.type=type
            this.x=x;
            this.y=y;
            this.color=Colors[this.type];
            this.rotation =0;
            this.Hologramm = new Hologramm(this)
        }
        rotate(direction) {
            if (direction) this.rotation = (this.rotation +1)% this.Tetreminos[this.type].length;
            else {this.rotation = Math.abs((this.rotation -1)% this.Tetreminos[this.type].length);}
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
            while (Hologramm_is_possible()) this.y++;
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
        blocktime = 0;
        if (fps===undefined) fps=60;
        dd=performance.now()-0.5;
        runtertime = 0.5*fps;
        new_Figur = new Figure(3,0,-1);
        while (Possible())new_Figur.y += -1;
        new_Figur.y += 1
        if (!Possible())Gameover = true;
        Was_Stored = false;
    }

    function next_Figure() {
        next_Figurs_List.shift();
		next_Figurs_List.push(Math.floor(Math.random()*new_Figur.Tetreminos.length));
        New();
    }

    function Possible() {
        let possible = true;
        for (let Höhe = 0; Höhe < 4; Höhe++){
            for (let Breite = 0; Breite < 4; Breite++){
                let index = Höhe * 4 + Breite;                
                if(new_Figur.pos.includes(index)){
                    //console.log(new_Figur.y+Höhe,new_Figur.x+Breite);
                    if (new_Figur.y+Höhe>Blöcke_y-1||new_Figur.y+Höhe<0||new_Figur.x+Breite<0||new_Figur.x+Breite>Blöcke_x-1) {
                        possible = false;
                    }
                    else if (Gamestate[new_Figur.y+Höhe][new_Figur.x+Breite] != 0) possible = false;
                } // if (new_Figur.y+Höhe<0) possible = false;
                    // if (new_Figur.x+Breite<0) possible = false;
                    // if (new_Figur.x+Breite>Blöcke_x-1) possible = false;
            
            }}
        return possible;
    }
    function Hologramm_is_possible() {
        let possible = true;
        for (let Höhe = 0; Höhe < 4; Höhe++){
            for (let Breite = 0; Breite < 4; Breite++){
                let index = Höhe * 4 + Breite;                
                if(new_Figur.Hologramm.pos.includes(index)){
                    if (new_Figur.Hologramm.y+Höhe>20) possible = false
                    else if (new_Figur.Hologramm.y+Höhe<0) possible = false
                    else if (Gamestate[new_Figur.Hologramm.y+Höhe][new_Figur.Hologramm.x+Breite] != 0) possible = false
                }
            
            }}
        return possible;
    }
    function Left() {
        new_Figur.x--;
        if (!Possible()) {new_Figur.x++;}
    }
    function Right() {
        new_Figur.x++;
        if (!Possible()) {new_Figur.x--;}
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
                for (let X = 0; X <= Blöcke_x-1; X++) {
                    Gamestate[0].push(0);
            }
        }});
        glines += lines
        if (lines == 0) Points +=0;
        if (lines == 1) Points +=100*bfps;
        if (lines == 2) Points +=300*bfps;
        if (lines == 3) Points +=500*bfps;
        if (lines == 4) Points +=800*bfps;
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
        new_Figur = new Figure(3,0,Stored_Block_old);
        while (Possible()) new_Figur.y--;
        new_Figur.y++
        Was_Stored =true
    }

    function rotate(direction) {
        new_Figur.rotate(direction);
        if (!Possible()) {
            new_Figur.y++
            if (!Possible()) {
                new_Figur.y--
                new_Figur.x--
                if (!Possible()) {
                    new_Figur.x+=2
                    if (!Possible()) {
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
        loosetime = 0;
        ticktime = 0;
        blocktime = 0;
        runtertime = 0;
        dd=performance.time;
    }

    function CheckLevel(){
        bfps = Math.round((glines+10)/10);
        bps = 9+bfps;
    }

    function read() {
        
    }

    function write(text) {
        
    }

    function log_Data() {
        console.log(new_Figur.x,"=x",new_Figur.y,"=y/n",new_Figur.Hologramm.x,"=Holox",new_Figur.Hologramm.y,"=Holoy");
    }
    
    function draw_Bord(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        next_Figurs_context.clearRect(0, 0, next_Figurs_canvas.width, next_Figurs_canvas.height);//SB
        Store_context.clearRect(0, 0, Store_canvas.width, Store_canvas.height);//NB
        // Stored Block zeichen
        for (let Höhe = 0; Höhe < 4; Höhe++) {
            for (let Breite = 0; Breite < 4; Breite++) {
                let index = Höhe * 4 + Breite;
                let SF = new Draw_Figure(Stored_Block)
                if (SF.pos.includes(index)) {Draw_Rect(Breite,Höhe,draw_Rect_größe,SF.color,Store_context)}//Stored Block zeichen 
            }
        }
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
                if (Gamestate[Höhe][Breite]===0) Draw_Rect(Breite,Höhe,Rect_größe,"white",context);//leere Zeichnen
                else Draw_Rect(Breite,Höhe,Rect_größe,Colors[Gamestate[Höhe][Breite]-1],context); //print Colors(Gamestate[h][b])
            }
        }
        // Hologramm zeichen
        new_Figur.Hologramm.update();
        for (let Höhe = 0; Höhe < 4; Höhe++) {
            for (let Breite = 0; Breite < 4; Breite++) {
                let index = Höhe * 4 + Breite;
                if (new_Figur.Hologramm.pos.includes(index)) Draw_Rect(Breite+new_Figur.Hologramm.x,Höhe+new_Figur.Hologramm.y,Rect_größe,"gray",context);//Hologramm zeichnen
            }
        }
        // Figur zeichen
        for (let Höhe = 0; Höhe < 4; Höhe++) {
            for (let Breite = 0; Breite < 4; Breite++) {
                let index = Höhe * 4 + Breite;
                if (new_Figur.pos.includes(index)) Draw_Rect(Breite+new_Figur.x,Höhe+new_Figur.y,Rect_größe,new_Figur.color,context);//block zeichen
            }
        }
    }

    function Draw_Rect(pos_X,pos_Y,Größe,color,c){
        c.fillStyle = color;
        c.fillRect(pos_X * Größe, pos_Y * Größe, Größe-2, Größe-2);
    }

    
    let times=[];
    let fps;
    let rAF = null;

    function Gamover() {
        window.cancelAnimationFrame(rAF);
    }

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
    
    
    if (runter_gedrückt) {if (blocktime/fps>= 1/bps) {blocktime = 0; down(true);}}
    if (rechts_gedrückt) {if (blocktime/fps>= 1/bps) {blocktime = 0; Right();}}
    if (links_gedrückt) {if (blocktime/fps>= 1/bps) {blocktime = 0; Left();}}
    blocktime++;
    draw_Bord();

    if (++runtertime/fps>= 1/bfps) {
        down(false);
        runtertime = 0;
    }}
function can_down() {
    let possi
    new_Figur.y++;
    Possible()?possi=true:possi=false;
    new_Figur.y--;
    return possi;
}

function Compleatly_down() {    
    while (can_down()) {
        down(true);
    }
}
let B_pressed = false
function pause() {
    if (rAF!==null) {
        if (B_pressed===false) {
            window.cancelAnimationFrame(rAF);
        document.getElementById('overlay').style.display= "block";
        document.getElementById('h1').innerText="Pause"
            B_pressed = true
        } else {
            window.requestAnimationFrame(gameLoop);
            document.getElementById('overlay').style.display= "none";
            document.getElementById('h1').innerText=""
            B_pressed =false
        }
    }
}

function key_down_events(e){
    console.log(e.code)
    if (e.code=== "Escape") pause();
    if (e.code === "ArrowUp"){Store();}
    if (e.code === "KeyA"){rotate(false);}
    if (e.code === "KeyD"){rotate(true);}
    if (e.code === "ArrowDown") {
        if (!runter_gedrückt) {
        runter_gedrückt=true;
        if (blocktime/fps>= 1/bps) {
            blocktime = 0;
            if (performance.now()-dd<=0.5*1000){
                Compleatly_down();
        }}
            dd=performance.now();
        }} //console.log(runter_gedrückt=true);
    if (e.code === "ArrowLeft") {links_gedrückt =true;}
    if (e.code === "ArrowRight") {rechts_gedrückt =true;}
}

document.addEventListener("keydown",(e) => {
    key_down_events(e);
})
document.addEventListener("keyup",(e) => {
    if (e.code === "ArrowDown") runter_gedrückt =false;
    if (e.code === "ArrowLeft") links_gedrückt =false;
    if (e.code === "ArrowRight") rechts_gedrückt =false;
})