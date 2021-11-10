//Real time Brainfuck interpreter, written in JS
var byteStack = [];
var stackLength = 32;
var acceptedChars = ["+", "-", ">", "<", "[", "]", ".", ","];
var position = 0;
var code = "";

// Set all bytes to 0 as starting point
resetBytestack();

printByteStack(byteStack);

document.getElementById('reset').addEventListener("click", function() {
    resetBytestack();
    document.getElementById('input').value = '';
    document.getElementById("output").innerText = "Output: ";
    position = 0;
    printByteStack(byteStack);
})

document.getElementById('input').addEventListener("keydown", (e) => {

    printByteStack(byteStack);
    code = document.getElementById('input').value;

    // e.key => display key
    // e.which => display ASCII value
    ReadThatBrainfuck(e.key)


    // Used to prevent a delay in displaying values due to OS delay input rules
    document.getElementById('input').addEventListener("keyup", (e) => {
        printByteStack(byteStack);
    });
})

function resetBytestack() {
    for (let i = 0; i < stackLength; i++) {
        byteStack[i] = 0;
    }
}

function setByteBounds(i) {
    if (i > 255) {
        i = 0;
    }
    else if( i < 0)
    {
        i = 255;
    }

    return i;
}

function setStackBounds(i) {
    if (i < 0 || i > stackLength) {

        return position;

    } else {

        return i;
    }
}

function printByteStack(byteStack)
{
    document.getElementById("stack").innerHTML = "";
    for(let i = 0; i < byteStack.length; i++)
    {
        let newByte = document.createElement("P");
        newByte.setAttribute("class", "col-sm");
        newByte.setAttribute("id", "byte byte"+i);
        newByte.innerText = byteStack[i];
        if(i == position)
        {
            newByte.setAttribute("style", "color: red");
        }
        
        document.getElementById("stack").appendChild(newByte);
    }

}

function setOpacity(object, value)
{
    object.setAttribute("style", "opacity: "+ value);
}

function ReadThatBrainfuck(value) {
    if (acceptedChars.includes(value)) {
        switch (value) {
            case "+":
                increment();
                break;

            case "-":
                decrement();
                break;

            case ">":
                moveForward();
                break;

            case "<":
                moveBack();
                break;

            case "[":
                createLoop();
                break;

            case "]":
                break;

            case ".":
                print();
                break;

            case ",":
                ask();
                break;

            default:
                break;
        }
    }
}

function increment() {
    byteStack[position] = setByteBounds(byteStack[position] + 1);
}

function decrement() {
    byteStack[position] = setByteBounds(byteStack[position] - 1);
}

function moveForward() {
    position = setStackBounds(position + 1);
}

function moveBack() {
    position = setStackBounds(position - 1);
}

function print() {
    document.getElementById("output").innerText += String.fromCharCode(byteStack[position]);
}

function ask(){

    const askInput = document.createElement("input");
    const container = document.createElement("div");
    container.setAttribute("class", "container ask-container")
    askInput.setAttribute("type", "text");
    askInput.setAttribute("id", "askInput");
    container.appendChild(askInput);
    document.body.appendChild(container);

    setOpacity(document.getElementById("main-container"), 0.1);
    askInput.select();
  
    document.getElementById('input').disabled = true;

    askInput.addEventListener("keydown", (e) =>{

        if(e.key != "Shift" && !e.ctrlKey && e.key != "AltGraph")
        {
            byteStack[position] = setByteBounds(byteStack[position] + e.key.charCodeAt(0));
            document.getElementsByClassName("ask-container")[0].remove();
            document.getElementById('input').disabled = false;
            setOpacity(document.getElementById("main-container"), 1);
            document.getElementById('input').value += e.key;
            printByteStack(byteStack);
        }
    })
}

function createLoop(){

    let startLoopPos = code.length;
    const loopInput = document.createElement("input");
    const container = document.createElement("div");
    container.setAttribute("class", "container loop-container")
    loopInput.setAttribute("type", "text");
    loopInput.setAttribute("id", "loopInput");
    container.appendChild(loopInput);

    setOpacity(document.getElementById("main-container"), 0.1);
    document.body.appendChild(container);

    loopInput.select();

    document.getElementById('input').disabled = true;

    let loopContent = "[";
    document.getElementById('loopInput').addEventListener("keydown", (e) => {

        if(acceptedChars.includes(e.key))
        {
            loopContent += e.key;
        }

        if(e.key == "Backspace" || e.key == "Delete")
        {
            loopContent = loopContent.slice(0, -1);
        }

        if(e.key == "Enter")
        {
            Loop(loopContent);
        }

    })
}

function Loop(loopContent) {

    let loops = [];

    let i = 0;
    while(loopContent.lastIndexOf("[") != -1)
    {
        loops[i] = loopContent.substring(loopContent.lastIndexOf("[") + 1, loopContent.indexOf("]"));

        let loopResult = "";
        for(j = 0; j < byteStack[position]; j++)
        {
            loopResult += loops[i];
        }

        loopContent = loopContent.slice(0, loopContent.lastIndexOf("[")) + loopResult + loopContent.slice(loopContent.indexOf("]") + 1, loopContent.length);
        i++;
    }

    let loopContentArray = loopContent.split('')
    let controller = position;

    while (byteStack[controller] != 0) {
        for (let i = 0; i < loopContentArray.length; i++) {
            ReadThatBrainfuck(loopContentArray[i]);
        }
    }

    cleanLoop(loopContent);
}

function cleanLoop(loopContent){

    printByteStack(byteStack);

    document.getElementsByClassName("loop-container")[0].remove();
    document.getElementById('input').disabled = false;
    setOpacity(document.getElementById("main-container"), 1);
    document.getElementById('input').value += loopContent;

}