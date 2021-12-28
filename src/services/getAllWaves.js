import configWaveContract from "../utils/config-wave-contract";

async function getAllWavesService() {
  try {
    const wavePortalContract = configWaveContract()

    // From Smart Contract
    const waves = await wavePortalContract.getAllWaves();
    console.log(waves)

    const wavesCleaned = [];
    waves.forEach(wave => {
      wavesCleaned.push({
        address: wave.waver,
        timestamp: new Date(wave.timestamp * 1000),
        message: wave.message
      });
    });

    return wavesCleaned
  } catch (error) {
    console.log(error);
  }
}

export default getAllWavesService
