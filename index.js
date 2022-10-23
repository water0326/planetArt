var canvas = document.getElementById('canvas');

var screen_cycle;
var planet_radius
var planet_one_line_pixels;
var planet_Xangle;
var planet_Yangle;
var map = [];
var isClicked;
var click_xPos, click_yPos;

// ############################ INIT SETTING ############################# //
// ############################ INIT SETTING ############################# //
// ############################ INIT SETTING ############################# //

function canvas_init_setting() {
    screen_cycle = 0;
    planet_radius = 300;
    planet_one_line_pixels = 64;
    planet_Xangle = 0;
    planet_Yangle = 0;
    isClicked = false;
    var tmp, tmp2;
    for(var i = 0 ; i < planet_one_line_pixels * 2 ; i++) {
        map.push([]);
        tmp2 = (Math.floor(256 / (planet_one_line_pixels * 2)) * i).toString(16);
        for(var j = 0 ; j < planet_one_line_pixels * 2; j++) {
            tmp = (Math.floor(256 / (planet_one_line_pixels * 2)) * j).toString(16);
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
   
}

// ############################ DRAW ############################# //
// ############################ DRAW ############################# //
// ############################ DRAW ############################# //

/*
XmovePos, YmovePos는 정수여야함
*/

function planet_draw(radius, size, XmovePos, YmovePos, map) {
    ctx.translate(canvas.width / 2, canvas.height / 2);
    for(var deltaFor = 0 ; deltaFor < size; deltaFor++) {
        for(var cetaFor = 0 ; cetaFor < size; cetaFor++) {

            var cetaPos = (cetaFor + XmovePos) % (size * 2);
            var deltaPos = (deltaFor + YmovePos) % (size * 2);

            if(cetaPos < 0) cetaPos += size * 2;
            if(deltaPos < 0) deltaPos += size * 2;

            var ceta = (-1) * Math.PI / 2 + Math.PI / size * (cetaPos - XmovePos);
            var delta = Math.PI / size * (deltaPos - YmovePos);
            

            if(!map[cetaPos][deltaPos]) continue;

            ctx.beginPath();

            ctx.fillStyle = map[cetaPos][deltaPos];

            ctx.moveTo(radius * Math.cos(Math.PI * 0.5 - (delta)) * Math.sin(ceta),
             radius * Math.sin(Math.PI * 0.5 - (delta)) * Math.cos(ceta));
            ctx.lineTo(radius * Math.cos(Math.PI * 0.5 - (delta)) * Math.sin(ceta + Math.PI / size),
             radius * Math.sin(Math.PI * 0.5 - (delta)) * Math.cos(ceta));
            ctx.lineTo(radius * Math.cos(Math.PI * 0.5 - ((delta) + Math.PI / size)) * Math.sin(ceta + Math.PI / size),
             radius * Math.sin(Math.PI * 0.5 - ((delta) + Math.PI / size)) * Math.cos(ceta));
            ctx.lineTo(radius * Math.cos(Math.PI * 0.5 - ((delta) + Math.PI / size)) * Math.sin(ceta),
             radius * Math.sin(Math.PI * 0.5 - ((delta) + Math.PI / size)) * Math.cos(ceta));
            ctx.lineTo(radius * Math.cos(Math.PI * 0.5 - (delta)) * Math.sin(ceta),
             radius * Math.sin(Math.PI * 0.5 - (delta)) * Math.cos(ceta));
        
            ctx.fill();
            
            ctx.closePath();
        }
    }
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
}

function planet_rerendering(pixel_value) {
    planet_image_data = ctx.getImageData(canvas.width / 2 - planet_radius, canvas.height / 2 - planet_radius, 2 * planet_radius, 2 * planet_radius);
    planet_image_data_len = 2 * planet_radius * 4;
    for(var i = 0 ; i < planet_image_data.data.length ; i++) {
        if(i % 4 == 3) {
            planet_image_data.data[i] = 255;//planet_image_data.data[i] ? 0 : 255;
            continue;    
        }
        planet_image_data.data[i] = planet_image_data.data[Math.floor(i/(planet_image_data_len * pixel_value)) * (planet_image_data_len * pixel_value) + i % planet_image_data_len];
    }
    ctx.putImageData(planet_image_data, canvas.width / 2 - planet_radius, canvas.height / 2 - planet_radius);
}

function screen_draw() {
    planet_draw(planet_radius, planet_one_line_pixels, planet_Xangle, planet_Yangle, map);
    //planet_rerendering(4);
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

addEventListener('mousedown', e => {
    isClicked = true;
    click_xPos = e.x;
    click_yPos = e.y;
});

addEventListener('mouseup', (e) => {
    isClicked = false;
});

addEventListener('mousemove', (e) => {
    if(isClicked) {
        planet_Xangle += Math.round((click_xPos - e.x) / 8);
        planet_Yangle -= Math.round((click_yPos - e.y) / 8);
        click_xPos = e.x;
        click_yPos = e.y;
        console.log(planet_Xangle, planet_Yangle);
    }
});