import React, { useState } from 'react';
// import MD components & components
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import PaymentIcon from '@material-ui/icons/Payment';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import SearchIcon from '@material-ui/icons/Search';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

// customize component
import { PaginationDataTable } from '../../components/common/dataTable';
// get mock data
import { DefaultKNM } from '../../settings/mocks/DefaultKNM';
import { Button, Divider, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({

    searchForm: {
        display: 'flex',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    searchTextFiled: {
        marginTop: 3,
        marginRight: 10,
        flex: 1,
        width: '100%',
    },
    searchSelectedFiled: {
        width: 170,
    },
    searchBtn: {
        marginLeft: 10,
        width: 100,
    },
    searchBoolean: {
        width: 45,
        marginRight: 10,
    },
    searchSubTitle: {
        marginLeft: 15,
        lineHeight: '20px',
        color: theme.palette.grey[500],
        display: 'block',
        marginTop: 5,
    },
}));

interface SearchState {
    searchTexts: string[];
    searchPositions: string[];
    searchBooleans: string[];
}

export const SearchPage: React.FC = () => {
    const classes = useStyles();
    const [values, setValues] = useState<SearchState>({
        searchTexts: ['', ''],
        searchPositions: ['all', 'all'],
        searchBooleans: ['', 'and'],
    });

    const handleSearchTextChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newSearchText = event.target.value;
        let newSearchTexts = values.searchTexts;
        newSearchTexts[index] = newSearchText;
        setValues({
            ...values,
            searchTexts: newSearchTexts
        });
    };

    const handleSearchPositionSelect = (index: number) => (event: React.ChangeEvent<{ value: unknown }>) => {
        const newSearchPosition = event.target.value as string;
        let newSearchPositions = values.searchPositions;
        newSearchPositions[index] = newSearchPosition;
        setValues({
            ...values,
            searchPositions: newSearchPositions,
        });
    };

    const handleSearchBooleanSelect = (index: number) => (event: React.ChangeEvent<{ value: unknown }>) => {
        const newSearchBoolean = event.target.value as string;
        let newSearchBooleans = values.searchBooleans;
        newSearchBooleans[index] = newSearchBoolean;
        setValues({
            ...values,
            searchBooleans: newSearchBooleans,
        });
    };

    const handleSearch = () => {
        console.log(values);
    }

    const handleAddItem = () => {
        let newSearchTexts = values.searchTexts;
        newSearchTexts.push('');
        let newSearchPositions = values.searchPositions;
        newSearchPositions.push('all');
        let newSearchBooleans = values.searchBooleans;
        newSearchBooleans.push('and');
        setValues({
            searchTexts: newSearchTexts,
            searchPositions: newSearchPositions,
            searchBooleans: newSearchBooleans,
        });
    };

    const handleDeleteItem = (index: number) => {
        let newSearchTexts = values.searchTexts;
        newSearchTexts.splice(index, 1);
        let newSearchPositions = values.searchPositions;
        newSearchPositions.splice(index, 1);
        let newSearchBooleans = values.searchBooleans;
        newSearchBooleans.splice(index, 1);
        setValues({
            searchTexts: newSearchTexts,
            searchPositions: newSearchPositions,
            searchBooleans: newSearchBooleans,
        })
    };

    return (
        <div style={{ padding: '10px 30px' }}>
            <h1>??????????????????????????? - ????????????</h1>
            <Paper style={{ padding: '10px 30px', marginBottom: 20 }}>
                <h3 style={{ padding: 0, marginTop: 10, marginBottom: 5, }}>??????????????????</h3>
                {
                    values.searchTexts.map((text, index) => (
                        <form className={classes.searchForm} noValidate autoComplete="off" key={`${index}-form`}>
                            {
                                index > 0 &&
                                <FormControl className={classes.searchBoolean}>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={values.searchBooleans[index]}
                                        onChange={handleSearchBooleanSelect(index)}
                                    >
                                        <MenuItem value={'and'}>???</MenuItem>
                                        <MenuItem value={'or'}>???</MenuItem>
                                        <MenuItem value={'not'}>???</MenuItem>
                                    </Select>
                                </FormControl>
                            }
                            <FormControl className={classes.searchTextFiled}>
                                <TextField
                                    id="knm-node-intro"
                                    placeholder="?????????????????????"
                                    size="small"
                                    value={values.searchTexts[index]}
                                    onChange={handleSearchTextChange(index)}
                                />
                            </FormControl>
                            <FormControl className={classes.searchSelectedFiled}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={values.searchPositions[index]}
                                    onChange={handleSearchPositionSelect(index)}
                                >
                                    <MenuItem value={'all'}>????????????</MenuItem>
                                    <Divider />
                                    <Typography variant="overline" className={classes.searchSubTitle}>??????????????????</Typography>
                                    <MenuItem value={'map-title'}>??????????????????</MenuItem>
                                    <MenuItem value={'map-intro'}>??????????????????</MenuItem>
                                    <MenuItem value={'map-tags'}>??????????????????</MenuItem>
                                    <MenuItem value={'map-all'}>????????????????????????</MenuItem>
                                    <Divider />
                                    <Typography variant="overline" className={classes.searchSubTitle}>??????????????????</Typography>
                                    <MenuItem value={'notebook-title'}>??????????????????</MenuItem>
                                    <MenuItem value={'notebook-tags'}>??????????????????</MenuItem>
                                    <MenuItem value={'notebook-quote'}>??????????????????</MenuItem>
                                    <MenuItem value={'notebook-intro'}>??????????????????</MenuItem>
                                    <MenuItem value={'notebook-content'}>??????????????????</MenuItem>
                                    <MenuItem value={'notebook-all'}>????????????????????????</MenuItem>
                                    <Divider />
                                    <Typography variant="overline" className={classes.searchSubTitle}>??????????????????</Typography>
                                    <MenuItem value={'node-title'}>??????????????????</MenuItem>
                                    <MenuItem value={'node-tags'}>??????????????????</MenuItem>
                                    <MenuItem value={'node-intro'}>??????????????????</MenuItem>
                                    <MenuItem value={'node-all'}>????????????????????????</MenuItem>
                                    <Divider />
                                    <Typography variant="overline" className={classes.searchSubTitle}>??????????????????</Typography>
                                    <MenuItem value={'link-title'}>??????????????????</MenuItem>
                                    <MenuItem value={'link-tags'}>??????????????????</MenuItem>
                                    <MenuItem value={'link-intro'}>??????????????????</MenuItem>
                                    <MenuItem value={'link-start'}>????????????????????????</MenuItem>
                                    <MenuItem value={'link-end'}>????????????????????????</MenuItem>
                                    <MenuItem value={'link-all'}>????????????????????????</MenuItem>
                                </Select>
                            </FormControl>
                            {
                                index === 0 &&
                                <Button
                                    className={classes.searchBtn}
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    startIcon={<SearchIcon />}
                                    onClick={handleSearch}
                                >
                                    ??????
                                </Button>
                            }
                            {
                                index === 1 &&
                                <Button
                                    className={classes.searchBtn}
                                    variant="text"
                                    color="primary"
                                    size="small"
                                    startIcon={<AddCircleOutlineIcon />}
                                    onClick={handleAddItem}
                                >
                                    ?????????
                                </Button>
                            }
                            {
                                index > 1 &&
                                <Button
                                    className={classes.searchBtn}
                                    variant="text"
                                    color="primary"
                                    size="small"
                                    startIcon={<RemoveCircleOutlineIcon />}
                                    onClick={()=>handleDeleteItem(index)}
                                >
                                    ?????????
                                </Button>
                            }
                        </form>
                    ))
                }
            </Paper>
            <PaginationDataTable
                header={["??????????????????", "??????", "?????????", "????????????"]}
                rows={DefaultKNM}
            />
        </div>
    )
}
