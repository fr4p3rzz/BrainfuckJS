// Real time Brainfuck interpreter, written in JS
// Made for fun by Francesco Peruzzi, GitHub: https://github.com/fr4p3rzz
// Have fun, my dudes, I love you all

var byteStack = [];
var stackDefaultLength = 32;
var stackLength = stackDefaultLength;
var acceptedChars = ["+", "-", ">", "<", "[", "]", ".", ","];
var position = 0;

/** Set all bytes to 0 as starting point */
resetBytestack();

printByteStack(byteStack);

/** Define the length of the byte stack based on user input */
document.getElementById('byteStack-length').addEventListener("keyup", (e) => {

    let value = document.getElementById('byteStack-length').value;
    if (value > 0 && value <= 32) {
        stackLength = value
    } else {
        stackLength = stackDefaultLength;
    }

    resetBytestack();
    position = 0;
    printByteStack(byteStack);
    document.getElementById('input').value = '';
})

/** Next EventListeners are for navbar buttons */
document.getElementById('force').addEventListener("click", function() {
    forceReading(document.getElementById("input").value);
    printByteStack(byteStack);
})

document.getElementById('force').addEventListener("mouseover", function() {
    document.getElementById('force').innerText = "LETS F#@! THAT BRAIN!"
    document.getElementById('force').addEventListener("mouseout", function() {
        document.getElementById('force').innerText = "Brainfuck interpreter"
    })
})

document.getElementById('reset').addEventListener("click", function() {
    resetBytestack();
    document.getElementById('input').value = '';
    document.getElementById("output").innerText = "Output: ";
    position = 0;
    printByteStack(byteStack);
})

document.getElementById('how-to').addEventListener("click", function() {
    let instructions = document.getElementById("instructions");
    if (instructions.style.display != "none") {
        instructions.setAttribute("style", "display: none;");
    } else {
        instructions.setAttribute("style", "display: relative;");
    }

})

/** --------------------------------------- */
/** MAIN LOGIC - the brainfuck input field */
/** ------------------------------------- */
document.getElementById('input').addEventListener("keydown", (e) => {

    // e.key => display key
    // e.which => display ASCII value
    ReadThatBrainfuck(e.key)

    // update the displayed bytestack
    printByteStack(byteStack);

})

/** Next functions are for controls on values and inputs*/
function resetBytestack() {
    byteStack = [];
    for (let i = 0; i < stackLength; i++) {
        byteStack[i] = 0;
    }
}

function setByteBounds(i) {
    if (i > 255) {
        i = 0;
    } else if (i < 0) {
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

function forceReading(string) {
    if (string == "") {
        string = "+++++++>++++++++++<->++++++++++<->++++++++++<->++++++++++<->++++++++++<->++++++++++<->++++++++++<->++.<<+++++++>>++++++++++<<->>++++++++++<<->>++++++++++<<->>++++++++++<<->>++++++++++<<->>++++++++++<<->>++++++++++<<->>-.<<+++++++>>>++++++++++<<<->>>++++++++++<<<->>>++++++++++<<<->>>++++++++++<<<->>>++++++++++<<<->>>++++++++++<<<->>>++++++++++<<<->>>++++++.<<<+++++++>>>>++++++++++<<<<->>>>++++++++++<<<<->>>>++++++++++<<<<->>>>++++++++++<<<<->>>>++++++++++<<<<->>>>++++++++++<<<<->>>>++++++++++<<<<->>>>+++++++-.<<<<++++++++>>>>>++++++++++<<<<<->>>>>++++++++++<<<<<->>>>>++++++++++<<<<<->>>>>++++++++++<<<<<->>>>>++++++++++<<<<<->>>>>++++++++++<<<<<->>>>>++++++++++<<<<<->>>>>++++++++++<<<<<->>>>>-.<<<<<++++++>>>>>>++++++++++<<<<<<->>>>>>++++++++++<<<<<<->>>>>>++++++++++<<<<<<->>>>>>++++++++++<<<<<<->>>>>>++++++++++<<<<<<->>>>>>++++++++++<<<<<<->>>>>>--.<<<<<<++++>>>>>>>++++++++++<<<<<<<->>>>>>>++++++++++<<<<<<<->>>>>>>++++++++++<<<<<<<->>>>>>>++++++++++<<<<<<<->>>>>>>+.";
        document.getElementById("input").value = string;
    }

    let code = Array.from(string);
    for (let i = 0; i < code.length; i++) {
        ReadThatBrainfuck(code[i]);
    }
}

/** Next functions are for graphic and displaying content */
function printByteStack(byteStack) {
    document.getElementById("stack").innerHTML = "";
    for (let i = 0; i < byteStack.length; i++) {
        let newByte = document.createElement("P");
        newByte.setAttribute("class", "col-sm byte");
        newByte.setAttribute("id", "byte byte" + i);
        newByte.innerText = byteStack[i];
        if (i == position) {
            newByte.setAttribute("style", "color: red");
        }

        document.getElementById("stack").appendChild(newByte);
    }

}

function setOpacity(object, value) {
    object.setAttribute("style", "opacity: " + value);
}

/** Next functions are the actual brainfuck interpreter */
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

function ask() {

    /** This function is used to scan 1 char from keyboard input. */

    if(document.getElementById("instructions").style.display != "none")
    {
        document.getElementById("instructions").style.display = "none";
    }

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

    askInput.addEventListener("keydown", (e) => {

        if(e.key == "Delete" || e.key == "Escape")
        {
            cleanAction("", "ask-container");
        }
        else if (e.key != "Shift" && !e.ctrlKey && e.key != "AltGraph") {
            byteStack[position] = setByteBounds(byteStack[position] + e.key.charCodeAt(0));
            document.getElementsByClassName("ask-container")[0].remove();
            document.getElementById('input').disabled = false;
            setOpacity(document.getElementById("main-container"), 1);
            document.getElementById('input').value += e.key;
            printByteStack(byteStack);
        }
    })
}

function createLoop() {

    /** This function is used in order to create a loop instance where the user can insert the loop content. Loop content gets
     * passed to the Loop function once the user press Enter key */
    if(document.getElementById("instructions").style.display != "none")
    {
        document.getElementById("instructions").style.display = "none";
    }

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

        if(e.key == "Delete" || e.key == "Escape")
        {
            cleanAction("", "loop-container");
        }

        if (acceptedChars.includes(e.key)) {
            loopContent += e.key;
        }

        if (e.key == "Backspace" || e.key == "Delete") {
            loopContent = loopContent.slice(0, -1);
        }

        if (e.key == "Enter") {
            Loop(loopContent);
        }

    })
}

function Loop(loopContent) {

    /** Loop function isoaltes the substring that each [...] contains; remove the brackets from the code and duplicate the substring 
     * by the number of loops that the cycle is gonna make. This process is repeated starting from inner brackets [] to outer brackets [].
     * resulting string is then compiled normally. */
    let loops = [];

    let i = 0;
    while (loopContent.lastIndexOf("[") != -1) {
        loops[i] = loopContent.substring(loopContent.lastIndexOf("[") + 1, loopContent.indexOf("]"));

        let loopResult = "";
        for (j = 0; j < byteStack[position]; j++) {
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

    cleanAction(loopContent, "loop-container");
}

function cleanAction(loopContent, classToDelete) {

    /** cleanAction is used after a loop or a scan (ask function) in order to remove the generated input field; add
     *  the resulted content and bringing back the standard display of the page */
    printByteStack(byteStack);

    document.getElementsByClassName(classToDelete)[0].remove();
    document.getElementById('input').disabled = false;
    setOpacity(document.getElementById("main-container"), 1);
    document.getElementById('input').value += loopContent;

}

/** main function used to read brainfuck code */
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

