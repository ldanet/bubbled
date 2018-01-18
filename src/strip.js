import React from 'react'

export const Strip = ({leds}) => {
    return(
        <div className="strip">
            {leds.map(color => <div className="strip__led" style={{backgroundColor: color}} />)}
        </div>
    )
}

export default Strip;