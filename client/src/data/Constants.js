export const rankTableScore = 'rankTableScore';
export const rankTableRank = 'rankTableRank';
export const pillarIndicatorDefinition = 'pillarIndicatorDefinition';
export const regionWise = 'regionWise';
export const incomeWise = 'incomeWise';
export const measureLevelCode = 'measureLevelCode';
export const parentChildMap = 'parentChildMap';

export const scriptNames = [
    {
        name: rankTableScore,
        id: 'rank-table-score',
        label: 'rank table score json',
        method: 'getRankTableScoreData',
    },
    {
        name: rankTableRank,
        id: 'rank-table-rank',
        label: 'rank table rank json',
        method: 'getRankTableRankData',
    },
    {
        name: pillarIndicatorDefinition,
        id: 'pillars-indicators-Definition',
        label: 'pillars indicators Definition json',
        method: 'getPillarIndicatorDefinitionData',
    },
    {
        name: regionWise,
        id: 'region-wise',
        label: 'region wise json',
        method: 'getRegionWiseData',
    },
    {
        name: incomeWise,
        id: 'income-wise',
        label: 'income wise json',
        method: 'getIncomeWiseData',
    },
    {
        name: measureLevelCode,
        id: 'measure-level-code',
        label: 'measure level code json',
        method: 'getMeasureLevelCodeData',
    },
    {
        name: parentChildMap,
        id: 'parent-child-map',
        label: 'parent child map json',
        method: 'getParentChildMapData',
    }
]