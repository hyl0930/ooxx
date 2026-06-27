const cells=document.querySelectorAll(".cell");
const status=document.getElementById("status");
const restart=document.getElementById("restart");

let board=["","","","","","","","",""];
let current="X";
let playing=true;

const win=[
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[2,4,6]
];

cells.forEach(cell=>{
    cell.addEventListener("click",clickCell);
});

restart.addEventListener("click",reset);

function clickCell(){

    const i=this.dataset.index;

    if(board[i]!==""||!playing)return;

    board[i]=current;
    this.textContent=current;

    if(checkWin()){
        status.textContent=`🎉 玩家 ${current} 獲勝！`;
        playing=false;
        return;
    }

    if(!board.includes("")){
        status.textContent="平手！";
        playing=false;
        return;
    }

    current=current==="X"?"O":"X";
    status.textContent=`玩家 ${current} 回合`;
}

function checkWin(){

    return win.some(c=>{
        return c.every(i=>board[i]===current);
    });

}

function reset(){

    board=["","","","","","","","",""];

    current="X";

    playing=true;

    status.textContent="玩家 X 回合";

    cells.forEach(c=>c.textContent="");

}