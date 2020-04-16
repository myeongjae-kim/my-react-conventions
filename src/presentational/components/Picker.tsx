import React from 'react'
import { Subreddit } from '../../domain/model/Subreddit'

interface Props {
  options: Subreddit[]
  value: Subreddit
  onChange(value: Subreddit): void
}

const Picker: React.FC<Props> = ({ value, onChange, options }) => (
  <span>
    <h1>{value}</h1>
    <select onChange={e => onChange(e.target.value as Subreddit)}
            value={value}>
      {options.map(option =>
        <option value={option} key={option}>
          {option}
        </option>)
      }
    </select>
  </span>
)

export default Picker
