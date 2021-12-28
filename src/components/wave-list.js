import React from "react";
import PropTypes from 'prop-types'
import Wave from './wave'

function WaveList({ waves }) {
  if (waves) {
    return (
      <>
        {waves.map((wave, index) => (
          <Wave key={wave.address} wave={wave} />
        ))}
      </>
    )
  }

  return null
}

WaveList.propTypes = {
  waves: PropTypes.arrayOf(
    PropTypes.shape({
      adress: PropTypes.string,
      message: PropTypes.string,
      timestamp: PropTypes.instanceOf(Date),
    })
  ).isRequired
}

export default WaveList
