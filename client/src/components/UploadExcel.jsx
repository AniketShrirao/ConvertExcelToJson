import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { setUploaded } from '../redux/slices/upload';
import { niceBytes, readExcel } from '../utils/readExcel';
import CheckScripts from './CheckScripts';
import { StyledChecks, StyledHeading, StyledUpload } from './UploadExcel.styled';

const UploadExcel = () => {
    const [fileData, setFileData] = useState(null);
    const [fileName, setFileName] = useState(null);
    const [fileSize, setFileSize] = useState(null);
    const dispatch = useDispatch();

    const handleFile = async (e) => {
        const data = await readExcel(e.target.files[0]);
        const size = niceBytes(e.target?.files[0]?.size);
        const name = e.target?.files[0]?.name;
        setFileName(name);
        setFileSize(size);
        setFileData(data);
        (data) && dispatch(setUploaded(false));
    }

    return (
        <>
            <StyledHeading>Select your Scripts <span>{`(convert excel to json)`}</span></StyledHeading>
            <StyledChecks>
                <CheckScripts fileData={fileData} />
            </StyledChecks>
            <StyledUpload>
                <input
                    type="file"
                    onChange={(e) => handleFile(e)}
                />
                {
                    (fileSize && fileName) ?
                        (
                            <p>{fileName}<span>{`(${fileSize})`}</span></p>
                        ) :
                        (
                            <p>drag your excel file here OR click in this area.</p>
                        )
                }
            </StyledUpload>
        </>
    )
}

export default UploadExcel;
