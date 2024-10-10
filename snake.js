const ctx = document.getElementById("awesomeCanvas").getContext("2d")
ctx.canvas.height = 900
ctx.canvas.width = 900

const deathSound = new Audio()
deathSound.src = "resources/deathsound.mp3"

let body = [[30,30],[60,30]]

let currentDirection = "right"
let dirChangeQueue = []

let apple = false
let applePos = [-30,-30]

let size = 1


function draw() {
    ctx.clearRect(0,0,900,900)

    let y = 0
    let x = 0
    let done = false
    let groundColors = ["#161717", "#272929"]
    let groundIndex = 0

    while (done == false) {
        for (y; y <= 900; y += 30) {
            for (x; x <= 900; x += 30) {
                ctx.fillStyle = groundColors[groundIndex % 2]
                ctx.fillRect(x, y, 30, 30)
                groundIndex++
            }
            x = 0
        }
        done = true
    }

    let currentBodyPart = 0

    let snakeColors = ["#469e4c", "#4aaa51"]
    let colorIndex = 0

    while (currentBodyPart <= body.length - 1 ) {
        ctx.fillStyle = snakeColors[colorIndex % 2]
        ctx.fillRect(body[currentBodyPart][0],body[currentBodyPart][1],30,30)

        currentBodyPart += 1
        colorIndex++
    }

    ctx.fillStyle = "#ab3434"
    ctx.fillRect(applePos[0],applePos[1],30,30)

    ctx.fillStyle = "white"
    ctx.font = "bold 46px Impact";
    ctx.fillText(size,450,60)
}
function elongate() {
    let end = body.length - 1
    let bodycopy = body
    let newBodyPart
        switch (currentDirection) {
            case "down":
                newBodyPart = [body[end][0], body[end][1]+30]
                break;
            case "left":
                newBodyPart = [body[end][0]-30, body[end][1]]
                break;
            case "right":
                newBodyPart = [body[end][0]+30, body[end][1]]
                break;
            case "up":
                newBodyPart = [body[end][0], body[end][1]-30]
                break;
            default:
                break;
        }
    body = []

    body.push(newBodyPart)

    for (i in bodycopy) {
        body.push(bodycopy[i])
    }

    size++

}
function move() {
    
    let newPart
    let i = body.length - 1
    let bodyCopy = body
    if (dirChangeQueue.length >= 1) {
        let reqChange = dirChangeQueue.shift()
        if (reqChange != currentDirection) {
            currentDirection = reqChange
        }
        
    }
    
    switch (currentDirection) {
        case "down":
            newPart = [body[i][0],body[i][1]+30]
            break;
        case "left":
            newPart = [body[i][0]-30,body[i][1]]
            break;
        case "right":
            newPart = [body[i][0]+30,body[i][1]]
            break;
        case "up":
            newPart = [body[i][0],body[i][1]-30]
            break;
        default:
            break;
    }


    body = []

    for (let ii = 1; ii <= i; ii++) {
        body.push(bodyCopy[ii])
    }

    body.push(newPart)


}
function spawnApple() {
    let appleX = Math.round((Math.random() * (29 - 1) + 1)) * 30;
    let appleY = Math.round((Math.random() * (29 - 1) + 1)) * 30;


    apple = true
    applePos = [appleX, appleY]

    if (applePos in body) {
        spawnApple()
    }

}
function collision() {
    let headPos = body[body.length - 1]
    let b = []

    for (let i = 0; i <= body.length - 2; i++) {
        b.push(body[i])
    }


    if (headPos[0] > 900 || 
        headPos[0] < 0   ||
        headPos[1] > 900 ||
        headPos[1] < 0) {            
            return true

        }


    for (let i = 0; i < b.length - 1; i++) {
        if (b[i][0] == headPos[0] && b[i][1] == headPos[1]) {
                console.log(true)
                return true
            }
    }

    return false

}
function end() {

    const deathMessage =  document.getElementById("you-died-fade");
    deathSound.play()
    deathMessage.animate([
        {
          opacity: 0,
        },
        {
          opacity: 1,
        },
      ],
      2000)
      deathMessage.style = "opacity: 1"
}

function frame(){

    
    if (apple == false) {
        spawnApple()
    }

    let headPos1 = body[body.length - 1]

    if (headPos1[0] == applePos[0] && headPos1[1] == applePos[1]) {
        elongate()
        apple = false
        applePos = [-30,-30]

    }
    

    move()

    if (collision() == true) {
        clearInterval(interval)
        end()
        return
    }

    draw()
}


window.addEventListener("keypress", (e) => {
    switch (e.key) {
        case "s":
            if (currentDirection == "up") {
                break;
            }
            dirChangeQueue.push("down")
            break;
        case "w":
            if (currentDirection == "down") {
                break;
            }
            dirChangeQueue.push("up")
            break;
        case "a":
            if (currentDirection == "right") {
                break;
            }
            dirChangeQueue.push("left")
            break;
        case "d":
            if (currentDirection == "left") {
                break;
            }
            dirChangeQueue.push("right")
            break;
        default:
            break;
    }

})

draw()
const interval = setInterval(frame, 100)