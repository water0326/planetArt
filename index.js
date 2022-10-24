var canvas = document.getElementById('canvas');

var screen_cycle;
var planet_radius
var planet_one_line_pixels;
var planet_Xangle;
var planet_Yangle;
var map = [];
var isClicked;
var click_xPos, click_yPos;


// var k_1;
// var k_2;

// var k1_sqr;
// var k2_sqr;
// var k1_sqrt;
// var k2_sqrt;

// var x_1;
// var x_2;
// var y_1;
// var y_2;

// var x_m;
// var y_m;
// var k_m;

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

    var k_1 = (a * b + (-1) * r * (a * a + b * b - r * r)**0.5) / (a * a - r * r);
    var k_2 = (a * b + r * (a * a + b * b - r * r)**0.5) / (a * a - r * r);

    var k1_sqr = k_1 * k_1 + 1;
    var k2_sqr = k_2 * k_2 + 1;
    var k1_sqrt = (k1_sqr)**0.5;
    var k2_sqrt = (k2_sqr)**0.5;

    var x_1 = (k_1 * r * k1_sqrt * (-1)) / (k1_sqr);
    var x_2 = (k_2 * r * k2_sqrt) / (k2_sqr);
    var y_1 = k_1 * x_1 + r * k1_sqrt;
    var y_2 = k_2 * x_2 + (-1) * r * k2_sqrt;

    var x_m = (x_2 + x_1) * 0.5;
    var y_m = (y_2 + y_1) * 0.5;
    var k_m = (y_2 - y_1) / (x_2 - x_1);
    
    return [x_m, y_m, k_m, x_1, y_1, x_2, y_2];

}

function get_image_value(a, b, x, y, middle) {
    var k_image = (y - b) / (x - a);
    
    
    var x_image = ((-1) * a * k_image + b + middle[2] * middle[0] - middle[1]) / (middle[2] - k_image);
    var y_image = k_image * (x_image - a) + b;

    if (x < x_image) return false;
    if(b == 0) {
        height_result = k_image * (middle[0] - a) + b;
        return height_result;
    }
    var height_result = ((middle[0] - x_image) * (middle[0] - x_image) + (middle[1] - y_image) * (middle[1] - y_image))**0.5;
    
    return y_image > middle[1] ? height_result : height_result * (-1);
}

function planet_draw(radius, size, XmovePos, YmovePos, map) {
    ctx.translate(canvas.width / 2, canvas.height / 2);

    var a = radius * 2;
    var b = 0;
    var c = -radius;

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

            if(x_height === false || y_height === false) continue;

            if(!map[cetaPos][deltaPos]) continue;

            ctx.beginPath();

            ctx.fillStyle = map[cetaPos][deltaPos];

            ctx.arc(x_height, y_height, 5, 0, 2 * Math.PI);
            //ctx.arc(radius * Math.sin(delta) * Math.sin(ceta), radius * Math.cos(delta), 5, 0, 2 * Math.PI);
            
        
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