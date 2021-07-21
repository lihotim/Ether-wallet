import React, { Component } from 'react';
import Web3 from 'web3'
import EtherWallet from '../abis/EtherWallet.json'
import './App.css';

import Main from './Main'

class App extends Component {

  async componentDidMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {

    const web3 = window.web3

    //load accounts, fetch account's ETH balance
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })

    // fetch the '5777' value
    const networdId = await web3.eth.net.getId()

    // Load EtherWallet smart contract
    const networkData = EtherWallet.networks[networdId]
    if(networkData){
      const etherWallet = new web3.eth.Contract(EtherWallet.abi, networkData.address)
      this.setState({ etherWallet })

      const owner = await etherWallet.methods.owner().call()
      this.setState({ owner })

      let balance = await etherWallet.methods.getBalance().call()
      // console.log(balance)

      balance =  balance.toString()
      // console.log(balance)

      balance = web3.utils.fromWei(balance, 'ether')
      // console.log(balance)

      this.setState({ balance })
      
    }else{
      window.alert('EtherWallet contract not deployed to detected network.')
    }

    this.setState({loading:false})
  }

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      account:'0x0',
      etherWallet: {},
      owner: '',
      balance: 0,
    };
  }

  deposit = (amount) => {
    this.setState({ loading: true })
    this.state.etherWallet.methods.deposit().send({value: amount, from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  withdraw = (amount) => {
    this.setState({ loading: true })
    this.state.etherWallet.methods.withdraw(amount).send({from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  transfer = (address, amount) => {
    this.setState({ loading: true })
    this.state.etherWallet.methods.transfer(address, amount).send({from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  render() {

    let content
    
    if(this.state.loading){
      content = <p id="loader" className="text-center"> Loading... </p>
    } else {
      content = 
      <div className="content mr-auto ml-auto">
   
        <h1>My Ether Wallet</h1>
        <h4>Wallet owner: {this.state.owner}</h4>
        <h4>Balance: {this.state.balance} ETH</h4>

        <hr/>

        <Main deposit = {this.deposit}
              withdraw = {this.withdraw}
              transfer = {this.transfer}
        />


      </div>
    }

    return (
      <div>
        
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            My Ether Wallet
          </a>

          <div>
                <ul className="navbar-nav px-3">
                    <li className="nav-item flex-nowrap d-none d-sm-none d-sm-block">
                        <small className="navbar-text">
                            Your account: {this.state.account}
                        </small>
                    </li>
                </ul>

            </div>
        </nav>

        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                  {content}
              </div>
            </main>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
