import React from "react";
import { formatDistance } from 'date-fns'
import PropTypes from 'prop-types'

function Wave({ wave }) {
  return (
    <div className="wave" key={wave.address}>
      <div className="wave-details">
        <p className="wave-adress">
          <b>From: </b>
          {wave.address}
        </p>
        <p className="wave-time">{formatDistance(wave.timestamp, new Date(), { addSuffix: true })}</p>
      </div>
      <p>{wave.message}</p>
    </div>
  )
}

Wave.propTypes = {
  wave: PropTypes.shape({
    adress: PropTypes.string,
    message: PropTypes.string,
    timestamp: PropTypes.instanceOf(Date),
  }).isRequired
}

export default Wave
