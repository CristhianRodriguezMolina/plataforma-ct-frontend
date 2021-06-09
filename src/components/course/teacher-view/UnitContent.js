import React, { useState } from 'react';

import './UnitContent.scss';

import DynamicInput from '../../common/DynamicInput';

import TaskCard from '../task/TaskCard';

import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const UnitContent = props => {

    const [unitName, setUnitName] = useState("Unidad 1");
    const [unitDes, setUnitDes] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. In lacus nulla, lobortis a interdum et, fringilla eu nunc. Praesent imperdiet orci malesuada nunc egestas, vel hendrerit ante ultricies. In hac habitasse platea dictumst. Nulla consectetur purus ut neque ultrices, id dignissim quam fringilla. Duis elementum ultricies velit sit amet ultrices. ");
    const [visible, setVisible] = useState(false);

    const updateName = (value) => {
        setUnitName(value);
    };

    const updateDes = (value) => {
        setUnitDes(value);
    };

    const nameInputStyle = {
        width: "100%",
        fontSize: "1.7em",
        margin: "0",
        padding: "0.4em",
        lineHeight: "1.2em",
        fontWeight: "600"
    };

    const desInputStyle = {
        width: "100%",
        fontSize: "0.8em",
        margin: "0",
        padding: "0.7em",
        overflow: "hidden",
        lineHeight: "1.2em",
        fontWeight: "500",
        minHeight: "2.5em"
    };

    const handleChange = () => {
        setVisible(!visible);
       console.log('Switched!');
    };

    return (
        <div className="unit-content-container">
            <div className="logic-sequence-info">
                <DynamicInput dynamicInputValue={unitName} dynamicInputStyle={nameInputStyle} sendValue={updateName}></DynamicInput>
                <DynamicInput dynamicInputValue={unitDes} dynamicInputStyle={desInputStyle} sendValue={updateDes}></DynamicInput>
            </div>
            <div className="buttons-container">
                <button type="submit" className="btn btn-info m-2">Guardar cambios</button>
                <FormControlLabel className="switcher" label="Visible" control= {
                    <Switch
                        checked={visible}
                        onChange={handleChange}
                        name="checkedB"
                        color="primary"
                    />
                }/>
            </div>
            <TaskCard/>
            <TaskCard/>
            <TaskCard/>
            <TaskCard/>
            <TaskCard/>
            <TaskCard/>
        </div>
    )
};

export default UnitContent;