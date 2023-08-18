import React, { useState, useEffect } from 'react';

function Notification(props: any) {

    return (
        <div className={'w-100 text-center alert-' + props.type} style={{fontSize: '1.2rem', height: '2.5rem', paddingTop: '.4rem', transition: 'ease-in'}}>
            <span className=''>{props.message}</span>
        </div>
    )

}

export default Notification;