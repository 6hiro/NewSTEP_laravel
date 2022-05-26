import React from 'react'

const AddStepButton: React.FC = () => {
  return (
    <div className='item  add_step_button'>
        <div className="add_step_button__text">
            <i className='bx bx-plus'></i>
            <div>Next Step</div>
        </div>
    </div>
  )
}

export default AddStepButton