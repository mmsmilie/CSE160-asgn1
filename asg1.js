// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform float u_Size;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = u_Size;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'uniform vec4 u_FragColor;\n' +  // uniform変数
  'void main() {\n' +
  '  gl_FragColor = u_FragColor;\n' +
  '}\n';


const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

// Global Variables
let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;

let g_selectedsize = 5.0;
let g_selectedColor = [1.0, 0.0, 0.0, 1.0];
let g_selectedType = POINT;

function setupWebGL(){
        // Retrieve <canvas> element
        canvas = document.getElementById('webgl');
    
        // Get the rendering context for WebGL  
        gl = getWebGLContext(canvas);
        if (!gl) {
            console.log('Failed to get the rendering context for WebGL');
            return;
        }
}

function connectVariablesToGLSL(){
    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Get the storage location of a_Position
    a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }

    // Get the storage location of u_FragColor
    u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
    if (!u_FragColor) {
        console.log('Failed to get the storage location of u_FragColor');
        return;
    }

    u_Size = gl.getUniformLocation(gl.program, 'u_Size');
    if (!u_Size) {
        console.log('Failed to get the storage location of u_Size');
        return;
    }
}

function main() {

    var doDraw = false;

    setupWebGL();
    connectVariablesToGLSL();

    // Register function (event handler) to be called on a mouse press
    canvas.onmousedown = function(ev){ 
        doDraw = true;
        click(ev) 
    };

    canvas.onmousemove = function(ev){ 
        if (doDraw) {
            click(ev)
        }
    };

    canvas.onmouseleave = function(ev){
        doDraw = false;
    }

    canvas.onmouseup = function(ev){
        doDraw = false;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_shapeList = [];

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];

function click(ev) {

    let [x, y] = convertCoordinatesEventToGL(ev);
    let point;
    if(g_selectedType == POINT) {
        point = new Point();
    } else if(g_selectedType == TRIANGLE) {
        point = new Triangle();
    }else if(g_selectedType == CIRCLE) {
        point = new Circle();
    }
    point.position = [x, y];
    point.color = getColor().slice();
    point.size = getSize();
    if(point.type = 'circle'){
        point.segments = getSegments();
    }
    g_shapeList.push(point);

    renderAllShapes();

}

function convertCoordinatesEventToGL(ev) {
    var x = ev.clientX; // x coordinate of a mouse pointer
    var y = ev.clientY; // y coordinate of a mouse pointer
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
    return [x, y];
}

function renderAllShapes(){
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    var len = g_shapeList.length;

    for(var i = 0; i < len; i++) {

        g_shapeList[i].render();

    }
}

function getColor() {
    var r = parseFloat(document.getElementById('red').value) / 255;
    var g = parseFloat(document.getElementById('green').value) / 255;
    var b = parseFloat(document.getElementById('blue').value) / 255;
    var a = parseFloat(document.getElementById('opacity').value) / 100;
    //console.log(r, g, b, a);
    return new Float32Array([r, g, b, a]);
}

function clearCanvas(){
    g_shapeList = [];
    renderAllShapes();
}

function getSize(){
    return document.getElementById('size').value;
}

function drawMode(mode) {
    g_selectedType = mode;
}

function getSegments(){
    //if(debug) console.log("Getting Segments");
    return document.getElementById('segments').value;
}
