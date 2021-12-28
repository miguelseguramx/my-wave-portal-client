import React from "react"
import PropTypes from 'prop-types'

function ConnectWallet({ setCurrentAccount }) {
    /**
  * Implement your connectWallet method here
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <button className="waveButton" onClick={connectWallet}>
      Connect Wallet
    </button>
  )
}

ConnectWallet.propTypes = {
  setCurrentAccount: PropTypes.func.isRequired
}

export default ConnectWallet
