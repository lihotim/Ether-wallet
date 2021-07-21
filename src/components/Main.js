import { Tabs, Tab } from 'react-bootstrap'
import React, { Component } from 'react'
import deposit from '../deposit.jpg'
import withdraw from '../withdraw.jpg'
import transfer from '../transfer.jpg'

class Main extends Component {

  render() {

    return (

        <div>

          <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
            {/* Tab 1 */}
            <Tab eventKey="deposit" title="Deposit">
            <div id="depositCard" className="card mx-auto my-2" style={{width: 400}}>
                <img className="card-img-top" src={deposit} alt="Card 1"/>
                <div className="card-body">
                  <h5 className="card-title">Deposit Ether</h5>
                  <p className="card-text">Enter the amount of Ether you want to deposit.</p>
                  
                  <form onSubmit={(event) => {
                      console.log(this.depositAmt.value)
                      event.preventDefault()
                      let input
                      input = this.depositAmt.value
                      input = input * 10**18
                      console.log(input)

                      // Note: I don't know why it has to be passed as string into the function
                      input = input.toString()
                      console.log(input)
                      this.props.deposit(input)
                    }}>

                      <input id="depositCard"
                          type="number" 
                          step="0.01"
                          placeholder="Min: 0.01"
                          ref={(input) => { this.depositAmt = input }}
                      />
                      <br/>
                    <input type="submit" value="Deposit" className="btn btn-primary my-3" />
                  </form>
                </div>
              </div>
            </Tab>

            {/* Tab 2 */}
            <Tab eventKey="withdraw" title="Withdraw">
            <div id="withdrawCard" className="card mx-auto my-2" style={{width: 400}}>
                <img className="card-img-top" src={withdraw} alt="Card 2"/>
                <div className="card-body">
                  <h5 className="card-title">Withdraw Ether</h5>
                  <p className="card-text">Enter the amount of Ether you want to withdraw.</p>
                  
                  <form onSubmit={(event) => {
                      event.preventDefault()
                      let input
                      input = this.withdrawAmt.value
                      input = input * 10**18
                      console.log(input)

                      // Note: I don't know why it has to be passed as string into the function
                      input = input.toString()
                      console.log(input)
                      this.props.withdraw(input)
                    }}>

                      <input id="withdraw"
                          type="number" 
                          step="0.01"
                          placeholder="Min: 0.01"
                          ref={(input) => { this.withdrawAmt = input }}
                      />
                      <br/>
                    <input type="submit" value="Withdraw" className="btn btn-primary my-3" />
                  </form>
                </div>
              </div>
            </Tab>

            {/* Tab 3 */}
            <Tab eventKey="transfer" title="Transfer">
            <div id="transferCard" className="card mx-auto my-2" style={{width: 400}}>
                <img className="card-img-top" src={transfer} alt="Card 3"/>
                <div className="card-body">
                  <h5 className="card-title">Transfer Ether</h5>
                  <p className="card-text">Enter the recipient's address and the amount of Ether you want to transfer.</p>
                  
                  <form onSubmit={(event) => {
                      event.preventDefault()
                      let address, amount
                      address = this.address.value
                      amount = this.transferAmt.value

                      amount = amount * 1000000000000000000
                      console.log(amount)

                      // Note: I don't know why it has to be passed as string into the function
                      amount = amount.toString()
                      console.log(amount)
                      console.log(address)
                      this.props.transfer(address, amount)
                    }}>
                      <input id="recipientAddress" className="my-2"
                          type="string"
                          placeholder="Recipient's address"
                          ref={(input) => { this.address = input }}
                      />
                      <br/>
                      <input id="transferAmount"
                          type="number" 
                          step="0.01"
                          placeholder="Min: 0.01"
                          ref={(input) => { this.transferAmt = input }}
                      />
                      <br/>
                    <input type="submit" value="Transfer" className="btn btn-primary my-3" />
                  </form>
                </div>
              </div>
            </Tab>
          </Tabs>

        </div>

    );
  }
}

export default Main;
