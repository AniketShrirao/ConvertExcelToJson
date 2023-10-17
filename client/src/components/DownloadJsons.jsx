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
        const promises = [];
        const rankTableScoreSent = new Promise((res, rej) => res(sendFile(rankTableScoreJson) || rej(measureLevelCodeJson)));
        promises.push(rankTableScoreSent);
        const rankTableRankSent = new Promise((res, rej) => res(sendFile(rankTableRankJson) || rej(rankTableRankJson)));
        promises.push(rankTableRankSent);
        const pillarIndicatorDefinitionSent = new Promise((res, rej) => res(sendFile(pillarIndicatorDefinitionJson) || rej(pillarIndicatorDefinitionJson)));
        promises.push(pillarIndicatorDefinitionSent);
        const regionWiseJsonSent = new Promise((res, rej) => res(sendFile(regionWiseJson) || rej(regionWiseJson)));
        promises.push(regionWiseJsonSent);
        const incomeWiseSent = new Promise((res, rej) => res(sendFile(incomeWiseJson) || rej(incomeWiseJson)));
        promises.push(incomeWiseSent);
        const measureLevelCodeSent = new Promise((res, rej) => res(sendFile(measureLevelCodeJson) || rej(measureLevelCodeJson)));
        promises.push(measureLevelCodeSent);
        const parentChildMapSent = new Promise((res, rej) => res(sendFile(parentChildMapJson) || rej(parentChildMapJson)));
        promises.push(parentChildMapSent);

        Promise.allSettled(promises).then((results) => {
            const statuses = [];
            results.forEach((result) => {
                statuses.push(result.value ? result.status : 'rejected');
            });
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
