//Real time Brainfuck interpreter, written in JS
var byteStack = [];
var stackLength = 16;
var acceptedChars = ["+", "-", ">", "<", "[", "]", ".", ","];
var position = 0;
var startLoopPos = 0;
var endLoopPos = 0;

// Set all bytes to 0 as starting point
resetBytestack();

document.getElementById("stack").innerText = byteStack;

document.getElementById('reset').addEventListener("click", function() {
    resetBytestack();
    document.getElementById("stack").innerText = byteStack;
    document.getElementById('input').value = '';
})

document.getElementById('input').addEventListener("keydown", (e) => {

    document.getElementById("stack").innerText = byteStack;

    // e.key => display key
    // e.which => display ASCII value
    ReadThatBrainfuck(e.key)


    // Used to prevent a delay in displaying values due to OS delay input rules
    document.getElementById('input').addEventListener("keyup", (e) => {
        document.getElementById("stack").innerText = byteStack;
    });
})

function resetBytestack() {
    for (let i = 0; i < stackLength; i++) {
        byteStack[i] = 0;
    }
}

function setByteBounds(i) {
    if (i < 0 || i > 255) {
        i = 0;
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

                break;

            case "]":
                Loop();
                break;

            case ".":
                print();
                break;

            case ",":
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

function Loop() {
    let content = document.getElementById("input").value;
    let endLoopPos = content.length
    let openBracketPos = content.indexOf("[");

    if (openBracketPos != -1) {

        let startLoopPos = openBracketPos;
        let loopContent = content.substring(startLoopPos + 1, endLoopPos);
        let loopContentArray = loopContent.split('')
        let controller = position - 1;

        console.log(startLoopPos + " " + endLoopPos);
        console.log(loopContent);

        while (byteStack[controller] != 0) {
            for (let i = 0; i < loopContentArray.length; i++) {
                ReadThatBrainfuck(loopContentArray[i]);
            }
            byteStack[controller] -= 1;
        }
    }
}