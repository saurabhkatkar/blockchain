const SHA256 = require('crypto-js/sha256');

var _ = require('private-parts').createKey();

class Block{
    constructor(index,timestamp,data,previousHash = ''){
        _(this).index = index;              //Private
        _(this).timestamp = timestamp;      //Private
        _(this).data = data;                //Private
        this.previousHash = previousHash;   //Public
        this.hash = this.calculateHash();   //Public
    }
    calculateHash(){
        return SHA256(_(this).index + this.previousHash + _(this).timestamp + JSON.stringify(_(this).data)).toString();
    }
    showBlock(){
        console.log(_(this));
    }
}

class BlockChain{
    constructor(){
        _(this).chain = [this.createGenesisBlock()];    //PRIVATE
    }
    createGenesisBlock(){
        return new Block(0,"01/03/2020","Genesis Block","0");
    }
    getLatestBlock(){
        return _(this).chain[ _(this).chain.length - 1 ];
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        _(this).chain.push(newBlock);

    }
    showBlockChain(){
        console.log(JSON.stringify(_(this),null,4));
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
skCoin.addBlock(new Block('1','10/03/2020',{amount : 3}));
skCoin.addBlock(new Block('2','20/03/2020',{amount : 10}));
if( skCoin.checkHashes){
    console.log("Data is not Tampered");
    skCoin.showBlockChain();                   // Only Access to Hashes
}else{
    console.log("Data is Tampered");
}
