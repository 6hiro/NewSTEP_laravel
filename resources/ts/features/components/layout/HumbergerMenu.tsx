import React from 'react'

const HumbergerMenu = () => {
    
    const openSidebar = () => {
        document.body.classList.add('sidebar-open')
    }

    return (
        <div className='humberger-menu'>
            <div className="sidebar-toggle" onClick={openSidebar}>
                <i className='bx bx-menu'></i>
            </div>
        </div>
    )
}

export default HumbergerMenu;