import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { scriptNames } from '../data/Constants';
import { setJson, setSelected } from '../redux/slices/upload';
import { convertToJson, getData, getPolarChartData } from '../utils/readExcel';
import { StyledCheckBox } from './CheckScripts.styled';

const CheckScripts = ({ fileData }) => {

    const dispatch = useDispatch();
    const isUploaded = useSelector(state => state.upload.uploaded);

    const handleCheck = (e, data) => {
        if (e.target.checked === true) {
            dispatch(setSelected(true));
            scriptNames.forEach((script) => {
                if (script.id === e.target.id) {
                    const result = getData(script.method, data);
                    const jsonData = convertToJson(result, script.name);
                    console.log(jsonData);
                    dispatch(setJson({ value: script.name, data: jsonData }));
                }
            })
        }
    }

    useEffect(() => {
        if (fileData) {
            const polarData = getPolarChartData(fileData);
        }
    }, [fileData]);

    return scriptNames.map((script, index) => (
        <StyledCheckBox key={index}>
            <input type="checkbox" id={script.id} disabled={isUploaded} onChange={(e) => handleCheck(e, fileData)} />
            <label htmlFor={script.id}><span></span>{script.label}</label>
        </StyledCheckBox>
    ))
}

export default CheckScripts;
