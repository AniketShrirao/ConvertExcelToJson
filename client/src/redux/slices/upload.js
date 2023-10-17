import { createSlice } from '@reduxjs/toolkit';
import { rankTableScore, rankTableRank, pillarIndicatorDefinition, regionWise, incomeWise, measureLevelCode, parentChildMap } from '../../data/Constants';

const initialState = {
    rankTableScore: null,
    rankTableRank: null,
    pillarIndicatorDefinition: null,
    regionWise: null,
    incomeWise: null,
    measureLevelCode: null,
    parentChildMap: null,
    uploaded: true,
    selected: false,
};

export const uploadSlice = createSlice({
    name: 'upload',
    initialState,
    reducers: {
        setJson: (state = initialState, action) => {
            let updatedState = {};
            switch (action.payload.value) {
                case rankTableScore:
                    updatedState = {
                        ...state,
                        [rankTableScore]: action.payload.data,
                    };
                    break;
                case rankTableRank:
                    updatedState = {
                        ...state,
                        [rankTableRank]: action.payload.data,
                    };
                    break;
                case pillarIndicatorDefinition:
                    updatedState = {
                        ...state,
                        [pillarIndicatorDefinition]: action.payload.data,
                    };
                    break;
                case regionWise:
                    updatedState = {
                        ...state,
                        [regionWise]: action.payload.data,
                    };
                    break;
                case incomeWise:
                    updatedState = {
                        ...state,
                        [incomeWise]: action.payload.data,
                    };
                    break;
                case measureLevelCode:
                    updatedState = {
                        ...state,
                        [measureLevelCode]: action.payload.data,
                    };
                    break;
                case parentChildMap:
                    updatedState = {
                        ...state,
                        [parentChildMap]: action.payload.data,
                    };
                    break;
                default:
                    updatedState = state;
                    break;
            }
            return updatedState;
        },
        setUploaded: (state = initialState, action) => {
            return {
                ...state,
                uploaded: action.payload,
            }
        },
        setSelected: (state = initialState, action) => {
            return {
                ...state,
                selected: action.payload,
            }
        }
    },
});

// Action creators are generated for each case reducer function
export const {
    setJson,
    setUploaded,
    setSelected,
} = uploadSlice.actions;

export default uploadSlice.reducer;
