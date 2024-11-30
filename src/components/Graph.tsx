import React from 'react'

interface GraphProps {
  title: string;
}

export const Graph : React.FC<GraphProps> = ({ title }) => {
  return (
    <div>{title}</div>
  )
}
