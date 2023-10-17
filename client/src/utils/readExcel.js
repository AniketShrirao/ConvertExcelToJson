import * as XLSX from "xlsx";
import axios from 'axios';
import { countries, redundantFactors } from "./dictionary";
import { pillarIndicatorDefinition, measureLevelCode, rankTableRank, rankTableScore, regionWise } from "../data/Constants";

// eslint-disable-next-line no-extend-native
Array.prototype.unique = function () {
    this.shift();
    return this;
}

//  sort Normalize Sheet Data into a array of map
const getSortedNormalizeData = (data) => {
    let sortable = [];
    for (let nPillars of data.Normalize) {
        sortable = Object.entries(nPillars)
            .filter((d) => {
                if (typeof d[1] === "number") {
                    d[1] = d[1].toFixed(2);
                    // eslint-disable-next-line no-lone-blocks
                } {
                    return (
                        d[0] !== "CODE" &&
                        d[0] !== "DESCRIPTION" &&
                        d[0] !== "Final Scaling" &&
                        d[0] !== "IQR" &&
                        d[0] !== "LVL" &&
                        d[0] !== "Normalization factor" &&
                        d[0] !== "SUB-INDICATORS" &&
                        d[0] !== "lower reference value" &&
                        d[0] !== "lower reference value rule" &&
                        d[0] !== "max" &&
                        d[0] !== "min" &&
                        d[0] !== "normalization factor" &&
                        d[0] !== "upper reference value" &&
                        d[0] !== "upper refference value" &&
                        d[0] !== "upper refference value rule" &&
                        d[0] !== "Skewness" &&
                        d[0] !== "Remove?" &&
                        d[0] !== "weight" &&
                        d[0] !== "Q1" &&
                        d[0] !== "Q3" &&
                        d[0] !== "Data gaps per indicator"
                    );
                }
            })
            .sort(([, a], [, b]) => {
                return b - a;
            });
    }
    return sortable;
}

// ----------------------- init functions start -------------------- //

// Read excel sheets and return Json Data of sheets
export const readExcel = async (file) => {
    const promise = new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        fileReader.onload = (e) => {
            const Data = {};
            const bufferArray = e.target.result;

            const wb = XLSX.read(bufferArray, { type: "buffer" });
            const listofeconomysheet = wb.SheetNames[10];
            const listofeconomy = wb.Sheets[listofeconomysheet];
            Data.LOE = XLSX.utils.sheet_to_json(listofeconomy, {
                blankrows: false,
                range: 4,
            });

            const normalizationsheet = wb.SheetNames[3];
            const normalization = wb.Sheets[normalizationsheet];
            Data.Normalize = XLSX.utils.sheet_to_json(normalization, {
                range: 3,
            });
            resolve(Data);
        }
    });

    try {
        return await promise;
    } catch (error) {
        console.error(error);
    }
};

// Send Json data to convert into File to server 
export const sendFile = async (data) => {
    try {
        const response = await axios.post('//localhost:8000/upload', data).catch((error) => error);
        return typeof response === 'object' ? response?.data : response.toString();
    } catch (error) {
        return error;
    }
}

// ----------------------- init functions end -------------------- //

// ----------------------- common utility functions start -------------------- //

//  Sort Scores of Table Data Json
const getSortedScores = (arr1, arr2) => {
    if (
        arr1[0] !== 'LVL' &&
        arr2[0] !== 'LVL' &&
        arr1[0] !== 'DATA MEASURES' &&
        arr2[0] !== 'DATA MEASURES' &&
        arr1[0] !== 'CODE' &&
        arr2[0] !== 'CODE' &&
        arr1[0] !== 'DESCRIPTION' &&
        arr2[0] !== 'DESCRIPTION'
    ) {
        return (arr2[1] - arr1[1]);
    } else {
        return null;
    }
}

// make equal ranks stay as it is and increment next rank by repeating count
const equalizeRank = (array) => {
    let rank = 1;
    for (let i = 0; i < array.length; i++) {
        if (i > 0 && parseFloat(array[i].score) < parseFloat(array[i - 1].score)) {
            rank++;
        }
        array[i].rank = rank;
    }
    return array;
};

//  get Data filtered by levels of normalize sheet
const getFilteredNormalizedData = (toFilterData, levels) => {
    const redundantWords = new Set(redundantFactors);
    const [levelZero, levelOne, levelTwo, levelThree, levelFour] = levels;

    const levelMap = [];
    toFilterData.Normalize.forEach((normalizedData) => {
        const newNormalizedData = Object.entries(normalizedData).filter((measure) => (!redundantWords.has(measure[0])) && measure);
        const mapData = new Map(newNormalizedData);
        const levelData = (
            (levelZero !== null && mapData.get('LVL') === 0) ||
                ((levelOne) && mapData.get('LVL') === 1) ||
                ((levelTwo) && mapData.get('LVL') === 2) ||
                ((levelThree) && mapData.get('LVL') === 3) ||
                ((levelFour) && mapData.get('LVL') === 4)
                ? mapData : null);
        if (levelData) {
            const sortedScores = new Map([...levelData].sort(getSortedScores))
            levelMap.push(sortedScores);
        }
    });
    return levelMap;
}

// Convert Data into Json Format with fileName
export const convertToJson = (data, fileName) => {
    const json = {};
    json.data = data;
    json.fileName = fileName;
    return json;
}

// convert bytes into human readable form
export const niceBytes = (x) => {
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    let l = 0, n = parseInt(x, 10) || 0;
    while (n >= 1024 && ++l) {
        n = n / 1024;
    }
    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
}

// ----------------------- common utility functions end -------------------- //


// ----------------------- Rank And Score for Rank Table script functions start -------------------- //

//  Calculate Rank for Table Data Json
const getRankedCountries = (input) => {
    // Copy input array into newArray
    let newArray = input;
    let rank = 0;
    let previousVal = 0;
    let repeatCount = 0;

    /* calculate Rank[] in ascending order and 
     effectively increase it if repeating values present. */
    for (const [key, value] of newArray.entries()) {
        if (
            key !== 'LVL' &&
            key !== 'DATA MEASURES' &&
            key !== 'CODE' &&
            key !== 'DESCRIPTION'
        ) {
            if (value === previousVal) {
                repeatCount++;
            } else if (value !== previousVal && repeatCount > 0) {
                rank += repeatCount;
                repeatCount = 0;
            } else if (value !== previousVal) {
                repeatCount = 0;
                rank++;
            }
            newArray.set(key, rank);
            previousVal = value;
        }
    }
    return newArray;
}

// Get Rank Table Data Json
export const getTableData = (data, dataName) => {
    let scoreData = {};
    let rankData = {};
    let definitionData = {};
    let dataContainer = [];
    let definitionContainer = new Map();

    data.forEach((levelData) => {
        countries.forEach((country) => {
            if (levelData) {
                switch (dataName) {
                    case rankTableScore:
                        scoreData = {
                            country: country,
                            [levelData.get('DATA MEASURES')]: levelData.get(country)
                        }
                        dataContainer.push(scoreData);
                        break;
                    case rankTableRank:
                        const sortedScores = new Map([...levelData].sort(getSortedScores));
                        const rankedCountries = getRankedCountries(sortedScores);
                        rankData = {
                            country: country,
                            [rankedCountries.get('DATA MEASURES')]: rankedCountries.get(country)
                        }
                        dataContainer.push(rankData);
                        break;
                    case pillarIndicatorDefinition:
                        definitionData = {
                            name: levelData.get('DATA MEASURES'),
                            desc: levelData.get('DESCRIPTION'),
                            code: levelData.get('CODE'),
                        };
                        definitionContainer.set(definitionData.name, { ...definitionData });
                        break;
                    default:
                        break;
                }
            }
        })
    })
    return (definitionContainer.size > 0) ? definitionContainer : dataContainer;
}

// Format Rank Table Data Json
const formatRankTableData = (rankTableData) => {
    let tableData = {};
    rankTableData.forEach((redData) => {
        const [countryName, dataMeasure] = Object.keys(redData);
        if (!tableData[redData.country]) {
            tableData[redData.country] = {
                [dataMeasure]: Math.round(redData[dataMeasure]),
                country: redData[countryName]
            }
        } else {
            tableData[redData.country] = {
                ...tableData[redData.country],
                [dataMeasure]: Math.round(redData[dataMeasure]),
                country: redData[countryName]
            }
        }
    })
    return Object.values(tableData);
}

// Get Rank Table Rank Data Json
export const getRankTableRankData = (data) => {
    const filteredNormalize = getFilteredNormalizedData(data, [0, 1, 2]);
    const tableRankData = getTableData(filteredNormalize, rankTableRank);
    return formatRankTableData(tableRankData);
}

// Get Rank Table Score Data Json
export const getRankTableScoreData = (data) => {
    const filteredNormalize = getFilteredNormalizedData(data, [0, 1, 2]);
    const tableScoreData = getTableData(filteredNormalize, rankTableScore);
    return formatRankTableData(tableScoreData);
}

// ----------------------- Rank And Score for Rank Table script functions end -------------------- //

// ----------------------- pillar indicator definition script functions start -------------------- //

// Get Rank Table Pillar Definition Data Json
export const getPillarIndicatorDefinitionData = (data) => {
    const filteredNormalize = getFilteredNormalizedData(data, [null, 1, 2]);
    const pillarDefinitionData = getTableData(filteredNormalize, pillarIndicatorDefinition);
    return [...pillarDefinitionData].map((pillarDef) => pillarDef[1]);
}

// ----------------------- pillar indicator definition script functions end -------------------- //


// ----------------------------------- parent child data functions start ---------------------- //

const getCountriesData = (countryData) => {
    const parentData = [];
    countryData.forEach((country, idx) => {
        country.delete('CODE')
        country.delete('DESCRIPTION')
        country.delete('LVL')
        countryData[idx] = [...country]
        const mappedParent = mappedParentData(countryData[idx]);
        mappedParent.shift();
        equalizeRank(mappedParent);
        if (mappedParent) parentData.push(mappedParent);
    })
    return parentData;
}

const mappedParentData = (country) => {
    let dataMeasureValue, obj = {};
    return country.map((d, index) => {
        if (d[0] === "DATA MEASURES") {
            dataMeasureValue = d[1];
        } else {
            obj = {
                country: d[0],
                score: Math.round(d[1]),
                rank: index,
                dataMeasure: dataMeasureValue,
            };
        }
        return obj;
    });
}

const setParents = (PillarsCountryWise, Normalize) => {
    const pillars = getPillars(Normalize, 'pillar');
    const indexPillar = getPillars(Normalize, 'index');

    PillarsCountryWise.forEach(pillar => {
        if (pillar.level === 1) {
            pillar.parent = indexPillar.name;
        } else if (pillar.level === 2) {
            pillars.forEach((pilar) => {
                if (pillar.code.toString().startsWith(pilar.code.toString()[0])) {
                    pillar.parent = pilar.name;
                }
            })
        }
    });
}

const getPillars = (Normalize, category) => {
    let pillarArray = [], indexObj = {};
    for (let nPillars of Normalize) {
        if (nPillars) {
            if (nPillars.CODE === 0) {
                indexObj.name = nPillars["DATA MEASURES"];
                indexObj.level = nPillars.LVL;
                indexObj.code = nPillars.CODE;
            } else if (nPillars.LVL === 1) {
                pillarArray.push({
                    name: nPillars["DATA MEASURES"],
                    level: nPillars.LVL,
                    code: nPillars.CODE,
                })
            }
        }
    }
    if (category === 'index') return indexObj; else if (category === 'pillar') return pillarArray;
}

// Get Parent child Data Json
export const getParentChildMapData = (data) => {
    const filteredNormalize = getFilteredNormalizedData(data, [0, 1, 2]);
    const arrayData = getCountriesData(filteredNormalize);
    let countryWiseObject;
    let parentChildData = [];
    for (let i = 1; i < 219; i++) {
        let pillarsCountryWise = [];
        for (let nPillars of data.Normalize) {
            for (let pillarObj in nPillars) {
                if (data.LOE[i]["Economy"] === pillarObj) {
                    let pillar = nPillars["DATA MEASURES"];
                    let desc = nPillars["DESCRIPTION"];
                    let code = nPillars["CODE"];
                    let lvl = nPillars["LVL"];
                    let score = nPillars[data.LOE[i]["Economy"]];
                    if (typeof score === "number") {
                        score = score.toFixed(2);
                    }
                    if (lvl === 0 || lvl === 1 || lvl === 2) {
                        countryWiseObject = {
                            country: data.LOE[i]["Economy"],
                            score: Math.round(Number(score)),
                            name: pillar,
                            desc: desc,
                            code: code,
                            level: lvl,
                            rank: '',
                        }
                        pillarsCountryWise.push(countryWiseObject);
                    }
                }
            }
        }
        for (let ind of arrayData) {
            for (let rankCountry of ind) {
                if (data.LOE[i]["Economy"] === rankCountry.country) {
                    for (let j of pillarsCountryWise) {
                        if (j)
                            if (j.name === rankCountry.dataMeasure && j.score === rankCountry.score) {
                                j.rank = rankCountry.rank;
                            }
                    }
                }
            }
        }

        if (
            Array.isArray(pillarsCountryWise) &&
            pillarsCountryWise.length > 0
        ) {
            setParents(pillarsCountryWise, data.Normalize);
            parentChildData.push({
                name: data.LOE[i]["Economy"],
                "country-code": data.LOE[i]["Code"],
                region: data.LOE[i]["Region"],
                income_group: data.LOE[i]["Income group"],
                pillars: pillarsCountryWise,
            });
        }
    }
    return parentChildData;
}

// ----------------------------------- parent child data functions end ---------------------- //

// ----------------------- Temporary region wise and income wise functions start ---------------------- //

const getPillarsAverage = (countryNames) => {
    let map = new Map();
    countryNames.forEach((country) => {
        country.forEach((obj) => {
            if (map.has(obj.name)) {
                let countryName = map.get(obj.name);
                map.set(obj.name, [...countryName, obj.score]);
            } else {
                map.set(obj.name, [obj.score]);
            }
        });
    })

    let filterAverageWise = [];
    for (let [key, value] of map) {
        const average = list => list.reduce((prev, curr) => parseFloat(prev) + parseFloat(curr)) / list.length;
        filterAverageWise.push({
            name: key,
            averageScore: value ? Math.round(average(value)) : null,
        });
    }
    return filterAverageWise;
}

const filterWiseScores = (countryNames, filter) => {
    let map = new Map();
    let categoriesAverages;
    countryNames.forEach((obj) => {
        if (map.has(obj[filter])) {
            let countryName = map.get(obj[filter]);
            map.set(obj[filter], [...countryName, obj.pillars]);
        } else {
            map.set(obj[filter], [obj.pillars]);
        }
    });

    let scoreValues = [];

    for (let [key, value] of map) {
        categoriesAverages = getPillarsAverage(value);
        scoreValues.push({
            name: key,
            categories: categoriesAverages,
        });
    }
    return scoreValues;
}

export const getPolarChartData = (data, filter) => {
    let sortedRanked = [];
    const country_names = [];
    let dataMeasureValue, obj;
    const sortedNormalize = getSortedNormalizeData(data);
    for (let nPillars of data.Normalize) {
        sortedNormalize
            .map((d, index) => {
                if (d[0] == "DATA MEASURES") {
                    dataMeasureValue = d[1];
                } else {
                    obj = {
                        country: d[0],
                        score: d[1],
                        rank: index,
                        dataMeasure: dataMeasureValue,
                    };
                }
                return obj;
            })
            .filter(function (element) {
                return element !== undefined;
            });

        let sorted = sortedNormalize.unique();
        sortedRanked.push(equalizeRank(sorted));
    }

    for (let i = 1; i < 219; i++) {
        let pillarsCountryWise = [];
        for (let nPillars of data.Normalize) {
            for (let pillarObj in nPillars) {
                if (data.LOE[i]["Economy"] === pillarObj) {
                    let pillar = nPillars["DATA MEASURES"];
                    let desc = nPillars["DESCRIPTION"];
                    let code = nPillars["CODE"];
                    let lvl = nPillars["LVL"];
                    let score = nPillars[data.LOE[i]["Economy"]];
                    if (typeof score === "number") {
                        score = score.toFixed(2);
                    }
                    if (lvl === 1) {
                        pillarsCountryWise.push({
                            country: data.LOE[i]["Economy"],
                            score: score,
                            name: pillar,
                            desc: desc,
                            code: code,
                            level: lvl,
                            rank: '',
                        });
                    }
                }
            }
        }
        for (let ind of sortedRanked) {
            for (let rankCountry of ind) {
                if (data.LOE[i]["Economy"] === rankCountry.country) {
                    for (let j of pillarsCountryWise) {
                        if (j)
                            if (j.name === rankCountry.dataMeasure && j.score === rankCountry.score) {
                                j.rank = rankCountry.rank;
                            }
                    }
                }
            }
        }

        if (
            Array.isArray(pillarsCountryWise) &&
            pillarsCountryWise.length > 0
        ) {
            country_names.push({
                name: data.LOE[i]["Economy"],
                "country-code": data.LOE[i]["Code"],
                region: data.LOE[i]["Region"],
                income_group: data.LOE[i]["Income group"],
                pillars: pillarsCountryWise,
            });
        }
    }
    return filterWiseScores(country_names, filter);
}

// ----------------------- Temporary region wise and income wise functions end ---------------------- //


// ----------------------------------- main init function start ---------------------- //

export const getData = (methodName, data) => {
    let result;
    switch (methodName) {
        case 'getRankTableScoreData':
            result = getRankTableScoreData(data);
            break;
        case 'getRankTableRankData':
            result = getRankTableRankData(data);
            break;
        case 'getPillarIndicatorDefinitionData':
            result = getPillarIndicatorDefinitionData(data);
            break;
        case 'getRegionWiseData':
            result = getPolarChartData(data, 'region');
            break;
        case 'getIncomeWiseData':
            result = getPolarChartData(data, 'income_group');
            break;
        case 'getMeasureLevelCodeData':
            result = getMeasureLevelCodeData(data);
            break;
        case 'getParentChildMapData':
            result = getParentChildMapData(data);
            break;
        default:
            break;
    }
    return result;
}

// ----------------------------------- main init function end ---------------------- //

// get Rank And Score Data  ============>>>> making optimized version due to high priority it's pending function
export const getMeasureLevelCodeData = (data) => {
    const filteredNormalize = getFilteredNormalizedData(data, [0, 1, 2]);
    return filteredNormalize.map((filtered) =>
        ({ "dataMeasure": filtered.get('DATA MEASURES'), "level": filtered.get('LVL'), "code": filtered.get('CODE') })
    );
}

// ----------------------- region wise and income wise script functions start -------------------- //

const getFilteredData = (toFilterData, filter) => {// ============>>>> making optimized version due to high priority it's pending function
    // "income_group": obj['Income group']
    return toFilterData.LOE.filter((object) => {
        return countries.some((country) => {
            return country === object.Economy;
        });
    }).map(obj => ({ "country": obj.Economy, "region": obj[filter], "code": obj.Code }));
}


// get Region Wise Data Json
export const getRegionWiseData = (data) => {  // =================>>>> making optimized version due to high priority it's pending function
    const filteredNormalize = getFilteredNormalizedData(data, [null, 1]);
    const filteredRegionWiseData = getFilteredData(data, 'Region');
    console.log(filteredNormalize, filteredRegionWiseData)
    return data;
}

// get Income Group Wise Data Json
export const getIncomeWiseData = (data) => { // =================>>>> making optimized version due to high priority it's pending function
    console.log(data);
    return data;
}

// ------------------------ region wise and income wise script functions end ----------------------//