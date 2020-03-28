const SHA256 = require('crypto-js/sha256');

var _ = require('private-parts').createKey();

class Block{
    constructor(index,timestamp,data,previousHash = ''){
        _(this).index = index;              //Private
        _(this).timestamp = timestamp;      //Private
        _(this).data = data;                //Private
        this.previousHash = previousHash;   //Public
        this.hash = this.calculateHash();   //Public
        _(this).nounce = 0;                 //Private value mining
    }
    calculateHash(){
        return SHA256(_(this).index + this.previousHash + _(this).timestamp + JSON.stringify(_(this).data) + _(this).nounce).toString();
    }
    showBlock(){
        console.log(_(this));
    }
    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join('0')){
            _(this).nounce++;
            this.hash = this.calculateHash();
        }
        console.log("Block Minied : " + this.hash);
    }
}

class BlockChain{
    constructor(){
        _(this).chain = [this.createGenesisBlock()];    //PRIVATE
        _(this).difficulty = 3;                        //PRIVATE Adjust Dificulty
    }
    createGenesisBlock(){
        return new Block(0,"01/03/2020","Genesis Block","0");
    }
    getLatestBlock(){
        return _(this).chain[ _(this).chain.length - 1 ];
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(_(this).difficulty);
        // newBlock.hash = newBlock.calculateHash();
        _(this).chain.push(newBlock);
    }
    showBlockChain(){
        console.log(JSON.stringify(_(this).chain,null,4));
    }
    checkHashes(){
        for (let i = 1; i< _(this).chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if( currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }
            if( previousBlock.hash !== previousBlock.calculateHash()){
                return false;
            }

        }
        return true;
    }
}

let skCoin = new BlockChain();

console.log("Block 1 added .......");

skCoin.addBlock(new Block('1','10/03/2020',{amount : 3}));

console.log("Block 2 added .......");

skCoin.addBlock(new Block('2','20/03/2020',{amount : 10}));
if( skCoin.checkHashes){
    console.log("Data is not Tampered");
    skCoin.showBlockChain();                   // Only Access to Hashes
}else{
    console.log("Data is Tampered");
}
