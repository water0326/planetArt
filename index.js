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
        //screen_cycle = 0;
    }
   
}

// ############################ DRAW ############################# //
// ############################ DRAW ############################# //
// ############################ DRAW ############################# //

/*
XmovePos, YmovePos는 정수여야함
*/

function get_middle(a, b, r) {
    var k_1 = (a * b + (-1) * Math.sqrt(a * a + b * b - r * r)) / (a * a - r * r);
    var k_2 = (a * b + Math.sqrt(a * a + b * b - r * r)) / (a * a - r * r);
    var x_1 = (k_1 * r * Math.sqrt(k_1 * k_1 + 1) * (-1)) / (k_1 * k_1 + 1);
    var x_2 = (k_2 * r * Math.sqrt(k_2 * k_2 + 1)) / (k_2 * k_2 + 1);
    var y_1 = k_1 * x_1 + (-1) * r * Math.sqrt(k_1 * k_1 + 1);
    var y_2 = k_2 * x_2 + r * Math.sqrt(k_2 * k_2 + 1);

    var x_m = (x_2 - x_1) / 2;
    var y_m = (y_2 - y_1) / 2;
    var k_m = y_m / x_m;
    console.log([x_m, y_m, k_m]);
    return [x_m, y_m, k_m];

}

function get_image_value(a, b, x, y, middle) {
    var k_image = (y - middle[1]) / (x - middle[0])
    var x_image = ((-1) * a * k_image + b + middle[2] * middle[0] - middle[1]) / (middle[2] - k_image);
    var y_image = k_image * (x_image - a) + b;

    var height_result = Math.sqrt((middle[0] - x_image) * (middle[0] - x_image) + (middle[1] - y_image) * (middle[1] - y_image));
    
    return middle[1] > y_image ? height_result * (-1) : height_result;
}

function planet_draw(radius, size, XmovePos, YmovePos, map) {
    ctx.translate(canvas.width / 2, canvas.height / 2);

    var a = radius * 2;
    var b = 0;
    var c = radius;

    var x_middle = get_middle(a, b, radius);
    var y_middle = get_middle(a, c, radius);
    


    for(var deltaFor = 0 ; deltaFor < size; deltaFor++) {
        for(var cetaFor = 0 ; cetaFor < size; cetaFor++) {

            var cetaPos = (cetaFor + XmovePos) % (size * 2);
            var deltaPos = (deltaFor + YmovePos) % (size * 2);

            if(cetaPos < 0) cetaPos += size * 2;
            if(deltaPos < 0) deltaPos += size * 2;

            var ceta = (-1) * Math.PI / 2 + Math.PI / size * (cetaPos - XmovePos);
            var delta = Math.PI / size * (deltaPos - YmovePos);
            
            var x_height = get_image_value(a, b, radius * Math.cos(Math.PI * 0.5 - delta) * Math.sin(Math.PI * 0.5 - ceta), radius * Math.cos(Math.PI * 0.5 - (delta)) * Math.sin(ceta), x_middle);
            var y_height = get_image_value(a, c, radius * Math.cos(Math.PI * 0.5 - delta) * Math.sin(Math.PI * 0.5 - ceta), radius * Math.sin(Math.PI * 0.5 - (delta)), y_middle);

            if(!map[cetaPos][deltaPos]) continue;

            ctx.beginPath();

            ctx.fillStyle = map[cetaPos][deltaPos];

            ctx.arc(x_height, y_height, 5, 0, 2 * Math.PI);
            console.log(x_height, y_height);
        
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


    if(screen_cycle == 0) {
        data_update();
        screen_draw();
    }
    
    
    
    
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