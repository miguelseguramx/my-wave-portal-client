import { ethers } from "ethers";
import abi from "../utils/WavePortal.json";

function configWaveContract(params) {
  const contractAddress = process.env.REACT_APP_CONTRACT_ADRESS;
  const contractABI = abi.abi;

  const { ethereum } = window
  if (!ethereum) {
    console.error("Ethereum object doesn't exist!");
    return null
  }

  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

  return wavePortalContract
}

export default configWaveContract
