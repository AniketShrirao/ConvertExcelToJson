import styled from "styled-components";

export const StyledUpload = styled.div`
    border: 4px dashed #fff;
    position: relative;

    & p {
        width: 100%;
        height: 100%;
        text-align: center;
        line-height: 170px;
        color: #ffffff;
        font-family: monospace;

            & span {
                margin: 0 2%;
                font-size: 30px;
                font-family: inherit;

                @media only screen and (max-width: 540px) {
                    display: block;
                }
            }

        @media only screen and (max-width: 540px) {
            width: 80%;
            line-height: 70px;
            margin: 0 auto;
        }
    }

    & input {
        position: absolute;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        outline: none;
        opacity: 0;
    }
`;

export const StyledChecks = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-wrap: wrap;
    padding: 20px;  
`;

export const StyledHeading = styled.h2`
    padding: 20px 20px 0;
    font-size: 24px;
    text-transform: uppercase;
    color: aliceblue;
    text-align: center;
    font-family: fantasy;

    & span {
        font-family: monospace;
        font-size: 14px;
    }
`;