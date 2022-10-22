var canvas = document.getElementById('canvas');

var screen_cycle;
var planet_radius
var planet_one_line_pixels;
var planet_Xangle;
var planet_Yangle;
var map = []

// ############################ INIT SETTING ############################# //
// ############################ INIT SETTING ############################# //
// ############################ INIT SETTING ############################# //

function canvas_init_setting() {
    screen_cycle = 0;
    planet_radius = 300;
    planet_one_line_pixels = 40;
    planet_Xangle = 0;
    planet_Yangle = 0;
    var tmp, tmp2;
    for(var i = 0 ; i < planet_one_line_pixels * 2 ; i++) {
        map.push([]);
        tmp2 = (Math.round(256 / (planet_one_line_pixels * 2)) * i).toString(16);
        for(var j = 0 ; j < planet_one_line_pixels * 2; j++) {
            tmp = (Math.round(256 / (planet_one_line_pixels * 2)) * j).toString(16);
            tmp = tmp.length < 2 ? "0" + tmp : tmp;
            tmp2 = tmp2.length < 2 ? "0" + tmp2 : tmp2;
            map[i].push("#" + tmp + tmp2 + "FF");
        }
    }
    //map[0][0] = "#FF0000";
    //map[2][1] = 2;
}

// ############################ UPDATE ############################# //
// ############################ UPDATE ############################# //
// ############################ UPDATE ############################# //

function data_update() {

    screen_cycle++;
    if(screen_cycle >= 1000) {
        screen_cycle = 0;
    }

    if(screen_cycle % 2 == 0) {
        planet_Xangle++;
        planet_Yangle++;
    }
   
}

// ############################ DRAW ############################# //
// ############################ DRAW ############################# //
// ############################ DRAW ############################# //

function planet_draw(radius, pixel, XmovePos, YmovePos) {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    for(var deltaFor = 0 ; deltaFor < pixel; deltaFor++) {
        for(var cetaFor = 0 ; cetaFor < pixel; cetaFor++) {

            var cetaPos = (cetaFor + XmovePos) % (pixel * 2);
            var deltaPos = (deltaFor + YmovePos) % (pixel * 2);

            var ceta = (-1) * Math.PI / 2 + Math.PI / pixel * (cetaPos - XmovePos);
            var delta = Math.PI / pixel * (deltaPos - YmovePos);

            ctx.beginPath();
        
            ctx.fillStyle = map[cetaPos][deltaPos];
            
            ctx.moveTo(radius * Math.cos(Math.PI * 0.5 - (delta)) * Math.sin(ceta),
             radius * Math.sin(Math.PI * 0.5 - (delta)));
            ctx.lineTo(radius * Math.cos(Math.PI * 0.5 - (delta)) * Math.sin(ceta + Math.PI / pixel),
             radius * Math.sin(Math.PI * 0.5 - (delta)));
            ctx.lineTo(radius * Math.cos(Math.PI * 0.5 - ((delta) + Math.PI / pixel)) * Math.sin(ceta + Math.PI / pixel),
             radius * Math.sin(Math.PI * 0.5 - ((delta) + Math.PI / pixel)));
            ctx.lineTo(radius * Math.cos(Math.PI * 0.5 - ((delta) + Math.PI / pixel)) * Math.sin(ceta),
             radius * Math.sin(Math.PI * 0.5 - ((delta) + Math.PI / pixel)));
            ctx.lineTo(radius * Math.cos(Math.PI * 0.5 - (delta)) * Math.sin(ceta),
             radius * Math.sin(Math.PI * 0.5 - (delta)));
        
            ctx.fill();
            
            ctx.closePath();
        }
    }
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
}

function screen_draw() {
    planet_draw(planet_radius, planet_one_line_pixels, planet_Xangle, planet_Yangle);
}

// ############################ LOOP ############################# //
// ############################ LOOP ############################# //
// ############################ LOOP ############################# //

function canvas_loop() {

    // Screen Erase Code & Position Init
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    data_update();
    screen_draw();
    
    
    
}

// ############################ MAIN ############################# //
// ############################ MAIN ############################# //
// ############################ MAIN ############################# //

if(canvas.getContext) {
    var ctx = canvas.getContext('2d');
}

canvas_init_setting();

setInterval(() => {
    canvas_loop();
}, 1);