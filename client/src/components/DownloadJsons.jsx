import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { sendFile } from '../utils/readExcel';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StyledDownloadButton } from './DownloadJsons.styled';

const DownloadJsons = () => {

    const [status, setStatus] = useState([]);
    const rankTableScoreJson = useSelector(state => state.upload.rankTableScore);
    const rankTableRankJson = useSelector(state => state.upload.rankTableRank);
    const pillarIndicatorDefinitionJson = useSelector(state => state.upload.pillarIndicatorDefinition);
    const regionWiseJson = useSelector(state => state.upload.regionWise);
    const incomeWiseJson = useSelector(state => state.upload.incomeWise);
    const measureLevelCodeJson = useSelector(state => state.upload.measureLevelCode);
    const parentChildMapJson = useSelector(state => state.upload.parentChildMap);
    const isSelected = useSelector(state => state.upload.selected);

    const notify = () => toast.success('your json files have been converted and stored in server successfully !', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });

    const handleExcel = async () => {
        const filesToLoad = [
            rankTableScoreJson,
            rankTableRankJson,
            pillarIndicatorDefinitionJson,
            regionWiseJson,
            incomeWiseJson,
            measureLevelCodeJson,
            parentChildMapJson
        ];

        const promises = filesToLoad.map((file) => new Promise((res) => res(sendFile(file))));

        Promise.allSettled(promises).then((results) => {
            const statuses = results.map((result) => (result.status === "fulfilled" ? "fulfilled" : "rejected"));
            setStatus(statuses);
        });
    }

    return (
        <>
            <StyledDownloadButton >
                <button
                    type='button'
                    className={isSelected ? 'enabled' : ''}
                    disabled={((status.length > 0) && status.every((stat) => stat === 'fulfilled')) ? true : false}
                    onClick={(e) => {
                        handleExcel();
                        console.log(status);
                        (status.length === 0) && notify();
                    }}
                >
                    {
                        ((status.length > 0) && status.every((stat) => stat === 'fulfilled')) ? 'Converted' : 'Convert Now'
                    }
                </button>
            </StyledDownloadButton >
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}

export default DownloadJsons;
