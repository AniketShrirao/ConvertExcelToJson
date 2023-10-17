import styled from "styled-components";

export const StyledDownloadButton = styled.div`

    display: flex;
    justify-content: center;
    font-family: cursive;
    
    & button {
        position: relative;
        width: 180px;
        height: 60px;
        margin: 20px;
        line-height: 60px;
        letter-spacing: 2px;
        text-decoration: none;
        text-transform: uppercase;
        text-align: center;
        color: #fff;
        background-color: transparent;
        cursor: pointer;
        transition: 0.5s;
        border: 3px solid #ec1840;
        pointer-events: none;

        &:hover {
            border: 1px solid transparent;
            background: #ec1840 url(https://i.postimg.cc/wBXGXbWN/pixel.png); // 360px x 1080px
            transition-delay: 0.8s;
            background-size: 180px;
            animation: animate 0.8s steps(8) forwards;
            color: #fff;
        }
    }

    .enabled {
        pointer-events: all;
    }

    @keyframes animate {
        0% {
            background-position-y: 0;
        }
        100% {
            background-position-y: -480px;
        }
    }

`;