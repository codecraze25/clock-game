var arr = [];
var level = 0;
if (localStorage.getItem('level'))
    level = parseInt(localStorage.getItem('level'));
// var selected = -1;
var pos = 0;
var selected = [0, 1, 2, 3, 4, 5, 6, 7, 8]
let score = 0;
let prefix = '';
let imageSource = [];

const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
};

// Usage 
selected = shuffle(selected);

const changeDisp = (pos) => {
    if (pos == 9) return;
    const h = arr[selected[pos]][0] / 30;
    const m = arr[selected[pos]][1] / 30 * 5;
    document.getElementById('hours').innerText = h.toString().padStart(2, '0');
    document.getElementById('mins').innerText = m.toString().padStart(2, '0')
}

var init = () => {
    while (1) {
        const temp = [];
        let a = 0;
        let b = 0;
        console.log(level);
        if (level == 0) {
            b = Math.trunc(Math.random() * 2) * 180;
            a = Math.trunc(Math.random() * 12) * 30;
        } else if (level == 1) {
            b = Math.trunc(Math.random() * 4) * 90;
            a = Math.trunc(Math.random() * 12) * 30;
        } else {
            b = Math.trunc(Math.random() * 60) * 6;
            a = Math.trunc(Math.random() * 12) * 30;
        }
        temp.push(a);
        temp.push(b);
        if (arr.findIndex(item => item[0] === temp[0] && item[1] === temp[1]) === -1)
            arr.push(temp);
        if (arr.length === 9) break;
    }
    changeDisp(0);
    document.getElementById('level').innerText = 'Level ' + (level + 1).toString();
}

init();

prefix = 'assets/images/' + level + '/';
imageSource = [];
for (let index = 9; index > 0; index--) {
    const temp = selected[index - 1] + 1;
    imageSource.push(temp + '.jpg');
}
// new Array('1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg', '6.jpg', '7.jpg', '8.jpg', '9.jpg');

function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

const scoreDisp = (score) => {
    document.getElementById('score').innerHTML = 'SCORE : ' + score;
}

function drop(ev) {
    // To cancel other fired event, such as image click
    ev.preventDefault();

    console.log(ev);

    var draggedId = ev.dataTransfer.getData("text");

    const item = document.getElementById(draggedId);


    const index = String(ev.target.id).slice(5);
    if (selected[pos] !== index - 1) {
        score--;
        console.log(score)
        scoreDisp(score)
        return;
    }
    score++;
    scoreDisp(score)
    console.log('pos', pos)
    changeDisp(++pos);

    document.getElementById('piece' + index).replaceWith(item);
    if (pos === 9) {
        setTimeout(() => {
            alert('Well Done!\n Your score is : ', score);
            localStorage.setItem('level', level + 1);
            location.reload();
        }, 100);
    }
}

const clock_builder = (index, hour, mins) => {
    const clock = document.createElement('div');
    clock.id = 'piece' + index;
    clock.draggable = true;
    clock.className = "icofreak circle clock";

    const clockbody = document.createElement('div');
    clockbody.className = "body";
    clockbody.id = 'aaaaa' + index;
    clockbody.style.backgroundImage = "url(assets/images/back.png)";
    clockbody.style.backgroundPosition = 'center';
    clockbody.style.backgroundSize = '118%';

    const clockaxel = document.createElement('div');
    clockaxel.className = "axel";
    clockaxel.id = 'bbbbb' + index;

    const clockhours = document.createElement('span');
    clockhours.className = "ticker hours";
    clockhours.style.transform = 'rotate(' + hour + 'deg)';
    clockhours.id = 'ccccc' + index;


    const clockminutes = document.createElement('span');
    clockminutes.className = "ticker minutes";
    clockminutes.style.transform = 'rotate(' + mins + 'deg)';
    clockminutes.id = 'ddddd' + index;

    clockaxel.append(clockhours, clockminutes);
    clockbody.append(clockaxel);
    clock.append(clockbody);
    return clock;
}


window.onload = function () {

    const clocks = document.getElementById('clocks');
    const newClocks = document.createElement('div');
    newClocks.className = "container_pieces";

    for (let index = 1; index < 10; index++) {
        const mins = arr[index - 1][1];
        const hour = arr[index - 1][0] + mins / 12;
        document.getElementById('square' + index).append(clock_builder(index, hour, mins));
        // newClocks.appendChild(clock_builder(index, hour, mins));
    }

    for (let i = 0; i < 9; i++) {
        const picTemp = document.createElement('img');
        picTemp.src = prefix + imageSource[i];
        picTemp.draggable = true;
        picTemp.addEventListener('dragstart', drag);
        picTemp.className = "icofreak circle clock";
        picTemp.id = `pic${i}`;
        newClocks.append(picTemp);
    }


    console.log(newClocks);
    clocks.replaceWith(newClocks);


    for (i = 1; i <= 9; i++) {
        document.getElementById('square' + i).addEventListener('drop', drop);
        document.getElementById('square' + i).addEventListener('dragover', allowDrop);
        document.getElementById('piece' + i).addEventListener('dragstart', drag);
    }

    // Shuffle the pieces
    for (i = 0; i < 50; i++) {
        var id1 = Math.floor(Math.random() * 9);
        var id2 = Math.floor(Math.random() * 9);
        var temp = imageSource[id1];
        imageSource[id1] = imageSource[id2];
        imageSource[id2] = temp;
    }

    // for (i = 1; i <= 9; i++) {
    //     document.getElementById('img' + i).src = imageSource[i - 1];
    // }
}

document.getElementById('next_btn').addEventListener('click', () => {
    if (level == 4) return;
    localStorage.setItem('level', level + 1);
    location.reload();
});

document.getElementById('prev_btn').addEventListener('click', () => {
    if (level == 0) return;
    localStorage.setItem('level', level - 1);
    location.reload();
});