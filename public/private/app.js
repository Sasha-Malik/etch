let socket = io('/privateSpace');

let roomName = window.prompt("Enter a room name!");

//Listen for confirmation of connection
socket.on('connect', function() {
    console.log("Connected");

    while(!roomName || roomName == "")
    {
        roomName = window.prompt("Enter a room name!");
    }
   
    let roomData = {          
        name : roomName
    }
    socket.emit("roomJoin",roomData);
});

socket.on('sdata',(data)=>{
    //console.log(data);
    let element = document.getElementById(data);
    //console.log(element);
    element.classList.add('color');
})

socket.on('scleanData',(data)=>{
    clean();
})

const container = document.querySelector('.container');

/* making the grid*/
for(let i = 0 ; i < 40 ; i++)
{ 
    const col = document.createElement('div');
    col.classList.add('col');

    for(let j = 0 ; j < 40 ; j++)
    { 

        const content = document.createElement('div');
     
        content.classList.add('content');
        content.id = i * 100 + j;
        col.appendChild(content);
    
    }

    container.appendChild(col);
}

/* checks if mouse is pressed */

let isMouseDown = false;
container.addEventListener('mousedown', ()=>{isMouseDown = true;})
container.addEventListener('mouseup', ()=>{isMouseDown = false;})

/* draws when hovering with mouse pressed */

function draw(e){

    if(this.classList.length !== 2 && isMouseDown == true)
    {    
        this.classList.add('color');
        //console.log(e.path[0].id);
        socket.emit('data',e.path[0].id);
    }
}

/* draws while clicking */
function drawClick(e){

    if(this.classList.length !== 2)
    {
        this.classList.add('color');
        //console.log(e.path[0].id);
        socket.emit('data',e.path[0].id);
    }
    
    
}

const contentHover = document.querySelectorAll('.content');
contentHover.forEach((content) => {

    content.addEventListener('mouseover', draw);
    content.addEventListener('click', drawClick);
});

/*cleaning the board*/

function clean(){

    const contentHover = document.querySelectorAll('.content');

    contentHover.forEach((content) => {

        content.classList.remove('color');
    
    });

}

const button = document.querySelector('.clean');
button.addEventListener('click', ()=>{
    clean();
    socket.emit('cleanData',"clean");
});

/* help button */

function closeBox(e){
   const box = document.querySelector('.help');
   box.remove();
}

const help = document.querySelector('.helpButton');
help.addEventListener('click',closeBox);

