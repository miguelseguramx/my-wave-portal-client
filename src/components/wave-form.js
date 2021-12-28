import React, { useState } from "react"
import PropTypes from 'prop-types'
import configWaveContract from '../utils/config-wave-contract'

function WaveForm({ setLoading, setError, setCount, disabled }) {
  const [message, setMessage] = useState('')

  const wave = async () => {
    if (disabled) return null
    if (!message) {
      setError('Remember to send me the link of your favorite song')
      return
    }
    try {
        const wavePortalContract = configWaveContract()
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        /*
        * Execute the actual wave from your smart contract
        */
        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        console.log("Mining...", waveTxn.hash);
        setLoading(true)

        await waveTxn.wait();
        setLoading(false)
        console.log("Mined -- ", waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        console.log("Actual total wave count...", count.toNumber());
        setCount(count.toNumber())
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (e) => {
    setError('')
    setMessage(e.target.value)
  }

  return (
    <>
      <input
        className="message-input"
        placeholder="Share with me your favorite song"
        type="text"
        value={message}
        onChange={handleInputChange}
        disabled={disabled}
      />
      <button disabled={disabled} className="waveButton" onClick={wave}>
        Wave at Me
      </button>
    </>
  )
}

WaveForm.propTypes = {
  setLoading: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  setCount: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
}

export default WaveForm
