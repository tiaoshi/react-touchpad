import React, { useEffect, useState } from 'react';

function Touch({
    x,
    y,
    isEnded = false,
    onExitAnimationEnd
}) {
    const initialClassName = isEnded ? 'touch' : 'touch touch-start';
    const [className, setClassName] = useState(initialClassName);
    const style = { top: y, left: x };

    useEffect(() => {
        let handle;
        if (className === 'touch touch-start') {
            handle = requestAnimationFrame(() => setClassName('touch'));
        } else if (className === 'touch' && isEnded) {
            handle = requestAnimationFrame(() => setClassName('touch touch-end'));
        }
        return () => cancelAnimationFrame(handle);
    });

    function onTransitionEnd(event) {
        if (className === 'touch touch-end') onExitAnimationEnd();
    }

    return (
        <div
            className={className}
            style={style}
            onTransitionEnd={onTransitionEnd}
        >
        </div>
    );
}

function TouchPad({ children }) {

    const [touches, setTouches] = useState([]);

    function onTouchStart({ changedTouches }) {
        const newTouches = [];
        for (let i = 0; i < changedTouches.length; i++) {
            const { identifier, pageX, pageY } = changedTouches[i];
            newTouches.push({
                id: identifier,
                x: pageX,
                y: pageY,
                isEnded: false,
            });
        }
        setTouches([...touches, ...newTouches]);
    }

    function onTouchEnd({ changedTouches }) {
        const endedTouchIds = [];
        for (let i = 0; i < changedTouches.length; i++) {
            const { identifier } = changedTouches[i];
            endedTouchIds.push(identifier);
        }
        setTouches(touches.map((touch) => {
            if (endedTouchIds.includes(touch.id)) {
                return ({
                    ...touch,
                    id: null,
                    isEnded: true,
                });
            }
            return touch;
        }));
    }

    function removeTouch(index) {
        setTouches(touches.filter((touch, i) => i !== index));
    }

    return (
        <div className={'ripple-container'} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {touches.map((touch, i) => <Touch {...touch} key={i} onExitAnimationEnd={() => removeTouch(i)} />)}
            {children}
        </div>
    );
}

export default TouchPad;
