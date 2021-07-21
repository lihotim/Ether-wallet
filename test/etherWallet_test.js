const { assert } = require('chai');

const EtherWallet = artifacts.require("EtherWallet");

require('chai')
.use(require('chai-as-promised'))
.should()

contract('EtherWallet', ([deployer, buddy1, buddy2]) => {

    let etherWallet

    before(async() => {
        etherWallet = await EtherWallet.deployed()
    })

    describe('Deployment', async() => {
        it('deploys successfully', async() => {
            const address = EtherWallet.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has the correct owner', async() => {
            let owner = await etherWallet.owner()
            assert.equal(owner, deployer)
        })

        it('Initially there has 0 funds in contract', async() => {
            let balance = await etherWallet.getBalance()
            assert.equal(balance.toString(), 0)  
        })
    })

    describe('Deposit', async() => {
        it('Can deposit 5 ether into the smart contract', async() => {

            // web3.utils.toWei('1', 'ether') === '1000000000000000000'
            await etherWallet.deposit({value: web3.utils.toWei('5', 'ether'), from: deployer})
            let balance = await etherWallet.getBalance()
            assert.equal(balance.toString(), web3.utils.toWei('5', 'ether'))
        })
    })

    describe('Withdraw', async() => {
        it('Can withdraw 1 ether from the smart contract', async() => {
            // web3.utils.toWei('1', 'ether') === '1000000000000000000'
            await etherWallet.withdraw(web3.utils.toWei('1', 'ether'), {from: deployer})
        })

        it('Now there should be 4 ether left in the smart contract', async() => {
            let balance = await etherWallet.getBalance()
            assert.equal(balance.toString(), web3.utils.toWei('4', 'ether'))
        })
    })

    describe('Transfer', async() => {
        let buddy1BeforeBal, buddy1AfterBal
        
        it('Can transfer 2 ether to buddy1', async() => {
            // Fetch buddy1's account BEFORE balance, then change it to BN for calculation
            buddy1BeforeBal = await web3.eth.getBalance(buddy1)
            buddy1BeforeBal = new web3.utils.BN(buddy1BeforeBal)

            await etherWallet.transfer(buddy1, web3.utils.toWei('2', 'ether'), {from: deployer})
            
            // Fetch buddy1's account After balance, then change it to BN for calculation
            buddy1AfterBal = await web3.eth.getBalance(buddy1)
            buddy1AfterBal = new web3.utils.BN(buddy1AfterBal)
        })

        it('buddy1 should receive 2 ethers', async() => {
            // console.log(buddy1BeforeBal)
            // console.log(buddy1AfterBal)
            // console.log(buddy1AfterBal - buddy1BeforeBal)
            assert.equal(buddy1AfterBal - buddy1BeforeBal, web3.utils.toWei('2', 'ether'))
        })

        it('Now there should be 2 ether left in the smart contract', async() => {
            let balance = await etherWallet.getBalance()
            assert.equal(balance.toString(), web3.utils.toWei('2', 'ether'))
        })
    })

    describe('Cannot withdraw or transfer more than the contract owns', async() => {
        it('cannot withdraw more than 2 ether', async() => {
            await etherWallet.withdraw(web3.utils.toWei('2.5', 'ether'), {from: deployer}).should.be.rejected
        })

        it('cannot transfer more than 2 ether to buddy2', async() => {
            await etherWallet.transfer(buddy2, web3.utils.toWei('2.5', 'ether'), {from: deployer}).should.be.rejected
        })

        it('Now there should be 2 ether left in the smart contract', async() => {
            let balance = await etherWallet.getBalance()
            assert.equal(balance.toString(), web3.utils.toWei('2', 'ether'))
        })
    })


})