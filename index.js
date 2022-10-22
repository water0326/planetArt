var canvas = document.getElementById('canvas');

if(canvas.getContext) {
    var ctx = canvas.getContext('2d');
}

//var circleDDang = Math.PI / 2;
var radius = 300;
ctx.translate(350, 350);
for(var circleDDang = 0 ; circleDDang < Math.PI ; circleDDang += Math.PI / 180) {
    for(var ceta = (-1) * Math.PI / 2 ; ceta < Math.PI / 2 ; ceta += Math.PI / 180) {
        ctx.beginPath();
    
        ctx.strokeStyle = "#00000044";
        ctx.moveTo(radius * Math.cos(Math.PI / 2 - circleDDang) * Math.sin(ceta),
         radius * Math.sin(Math.PI / 2 - circleDDang));
        ctx.lineTo(radius * Math.cos(Math.PI / 2 - circleDDang) * Math.sin(ceta + Math.PI / 180),
         radius * Math.sin(Math.PI / 2 - circleDDang));
        ctx.lineTo(radius * Math.cos(Math.PI / 2 - (circleDDang + Math.PI / 180)) * Math.sin(ceta + Math.PI / 180),
         radius * Math.sin(Math.PI / 2 - (circleDDang + Math.PI / 180)));
        ctx.lineTo(radius * Math.cos(Math.PI / 2 - (circleDDang + Math.PI / 180)) * Math.sin(ceta),
         radius * Math.sin(Math.PI / 2 - (circleDDang + Math.PI / 180)));
        ctx.lineTo(radius * Math.cos(Math.PI / 2 - circleDDang) * Math.sin(ceta),
         radius * Math.sin(Math.PI / 2 - circleDDang));
    
        ctx.stroke();
        ctx.closePath();
    }
}
