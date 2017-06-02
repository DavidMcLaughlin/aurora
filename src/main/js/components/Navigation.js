import React from 'react'
import { Link } from 'react-router-dom'

export default () => (
  <div>
    <ul>
      <li><Link to="/scheduler">Home</Link></li>
      <li><Link to="/scheduler/test">Test</Link></li>
    </ul>
  </div>
)
