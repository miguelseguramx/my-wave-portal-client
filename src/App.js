import React, { useEffect, useState } from "react";
import getAllWavesService from './services/getAllWaves'
import WaveList from './components/wave-list'
import ConnectWallet from "./components/connect-wallet";
import Bio from "./components/bio";
import "./App.css";
import WaveForm from "./components/wave-form";
import configWaveContract from "./utils/config-wave-contract";

const App = () => {
  const [allWaves, setAllWaves] = useState([]);
  const [timeDiff, setTimeDiff] = useState(0);
  const [currentAccount, setCurrentAccount] = useState("");
  const [error, setError] = useState('')
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getAllWaves = async () => {
    const wavesCleaned = await getAllWavesService()
    const { timestamp: created_at } = wavesCleaned[0]
    const msec_diff = new Date() - created_at
    const minutes_diff = Math.floor(msec_diff / 1000 / 60)
    setTimeDiff(minutes_diff)
    setAllWaves(wavesCleaned);
  }

  const optimisticWave = (newWave) => {
    setAllWaves([newWave, ...allWaves])
    getAllWaves()
  }

  const setInitialWaveCount = async () => {
    try {
      const wavePortalContract = configWaveContract()

      const count = await wavePortalContract.getTotalWaves();
      console.log('Initial count:', count);
      setCount(count.toNumber())
    } catch (error) {
      console.error(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        setInitialWaveCount()
        getAllWaves()
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    // Listen in for emitter events!
    let wavePortalContract;
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      wavePortalContract = configWaveContract()
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, [])

  return (
    <div className="mainContainer">
      <div className="dataContainer">
        <Bio />
        <WaveForm
          setError={setError}
          setLoading={setLoading}
          setCount={setCount}
          optimisticWave={optimisticWave}
          disabled={timeDiff < 30}
        />
        {timeDiff !== 0 && timeDiff < 30 && (
          <p>Wait! You can send me a new wave in
            <b> {30 - timeDiff} minutes</b>
          </p>
        )}
        {error && (
          <p className="setMessage(e.target.value)">{error}</p>
        )}
        <div className="waves-counter">
          <p>
            <b>Total waves: </b>
            {count}
          </p>
          {loading && (
            <p>
              Loading...
            </p>
          )}
        </div>
        {!currentAccount && <ConnectWallet setCurrentAccount={setCurrentAccount} />}
        <WaveList waves={allWaves} />
      </div>
    </div>
  )
}

export default App
