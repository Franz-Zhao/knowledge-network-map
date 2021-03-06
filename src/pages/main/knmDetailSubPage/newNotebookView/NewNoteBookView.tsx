import React, { useState, useEffect } from 'react';
// import customize components
import { TinyMCE, DialogBox } from '../../../../components/common';
// import MD
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SaveIcon from '@material-ui/icons/Save';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import PaymentIcon from '@material-ui/icons/Payment';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import ExtensionIcon from '@material-ui/icons/Extension';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Chip from '@material-ui/core/Chip';
import { InputLabel, Tooltip, Typography } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
// import mock data
import { mockTags } from '../../../../settings/mocks/DefaultTags';
import { relations, nodeData } from '../../../../settings/mocks/DefaultGraph';
// redux
import { useDispatch } from 'react-redux';
import { useSelector } from '../../../../redux/hooks';
import { findAllMapNodes } from '../../../../redux/knm/nodeSlice';
import { findAllMapLinks } from '../../../../redux/knm/linkSlice';
import { createMapNotebook, deleteNotebook } from '../../../../redux/knm/notebookSlice';
import { updateNotebookDetail } from '../../../../redux/knm/notebookSlice';

const useStyles = makeStyles((theme: Theme) => createStyles({
    infoPanelTitle: {
        fontSize: '18px !important',
    },
    infoPanelForms: {
        // marginBottom: theme.spacing(2),
        '&>*': {
            marginBottom: theme.spacing(2),
            width: '100%',
        },
    },
    emojiStyle: {
        "& > span": {
            left: 10,
            top: 5,
        }
    },
    selfDefineInputStyle: {
        "& .MuiInput-underline:after": {
            borderBottom: 'none',
        },
        "& .MuiInput-underline:before": {
            borderBottom: 'none',
        },
        "& .MuiInput-underline:hover:(not)(.Mui-disabled):before": {
            borderBottom: 'none',
        },
        "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
            borderBottom: 'none',
        }
    },
    notebookTitle: {
        width: '100%',
        flex: 1,
        "& input": {
            fontSize: 30,
            fontWeight: 'bold',
        },
    },
    notebookProperty: {
        display: 'flex',
        marginTop: 5,
        marginBottom: 15,
        "& > *": {
            padding: '5px 3px',
        }
    },
    notebookPropertyLeft: {
        width: 180,
        marginRight: 10,
        fontSize: 16,
        display: 'flex',
        "& > *": {
            marginTop: 'auto',
            marginBottom: 'auto',
        },
        "& svg": {
            marginRight: 15,
            marginLeft: 5,
        },
        "&:hover": {
            backgroundColor: '#4e4e4e4d',
            cursor: 'pointer',
            borderRadius: '8px',
        }
    },
    searchSubTitle: {
        marginLeft: 15,
        lineHeight: '20px',
        color: theme.palette.grey[500],
        display: 'block',
        marginTop: 5,
    },
}));

interface NotebookState {
    title: string;
    relationType: 'node' | 'link';
    relationId: string;
    tags: any[];
    quote: string;
    intro: string;
    selfDefineTitle: any[];
    selfDefineContain: any[];
    text: string;
}

interface NewNotebookViewState {
    handleSwitchViews: (newView: string)=>void;
}
export const NewNoteBookView:React.FC<NewNotebookViewState> = ({
    handleSwitchViews
}) => {
    const classes = useStyles();
    // notebook value
    const [values, setValues] = useState<NotebookState>({
        title: '',
        relationType: 'node',
        relationId: '',
        tags: [],
        quote: '',
        intro: '',
        selfDefineTitle: [],
        selfDefineContain: [],
        text: '',
    });
    // all node & link
    const [nodes, setNodes] = useState<any[]>([]);
    const [links, setLinks] = useState<any[]>([]);
    // whether new notebook or update notebook
    const [isNew, setIsNew] = useState(true);
    // open delete notebook dialog
    const [openDialog, setOpenDialog] = useState(false);
    // redux
    const dispatch = useDispatch();
    const jwt = useSelector(state => state.user.token);
    const currentOpenGraphInfo = useSelector(state => state.graph.currentOpenGraphInfo);
    const currentNotebookDetail = useSelector(state => state.notebook.currentNotebookDetail);
    const createSpecificNotebookRelationType = useSelector(state => state.notebook.createSpecificNotebookRelationType);
    const createSpecificNotebookRelationId = useSelector(state => state.notebook.createSpecificNotebookRelationId);
    const notebookLoading = useSelector(state => state.notebook.loading);

    useEffect(() => {
        if (Object.keys(currentNotebookDetail).length === 0) {
            // * open a new notebook page
            setIsNew(true);
            if (createSpecificNotebookRelationId) {
                // console.log(createSpecificNotebookRelationType);
                // console.log(createSpecificNotebookRelationId);
                // create a new notebook with specific node / link
                setValues({
                    title: '',
                    relationType: createSpecificNotebookRelationType,
                    relationId: createSpecificNotebookRelationId,
                    tags: [],
                    quote: '',
                    intro: '',
                    selfDefineTitle: [],
                    selfDefineContain: [],
                    text: '',
                });
            } else {
                setValues({
                    title: '',
                    relationType: 'node',
                    relationId: '0',
                    tags: [],
                    quote: '',
                    intro: '',
                    selfDefineTitle: [],
                    selfDefineContain: [],
                    text: '',
                });
            }
        } else {
            // * open specific notebook
            setIsNew(false);
            let target;
            let targetId;
            if (currentNotebookDetail['relationNode']) {
                target = 'node';
                targetId = currentNotebookDetail['relationNode'];
            }
            if (currentNotebookDetail['relationLink']) {
                target = 'link';
                targetId = currentNotebookDetail['relationLink'];
            }
            setValues({
                title: currentNotebookDetail['title'],
                relationType: target,
                relationId: targetId,
                tags: currentNotebookDetail['tags'],
                quote: currentNotebookDetail['quotes'],
                intro: currentNotebookDetail['introduction'],
                selfDefineTitle: currentNotebookDetail['addPropertyName'],
                selfDefineContain: currentNotebookDetail['addPropertyContent'],
                text: currentNotebookDetail['text'],
            });
        }
    }, [currentNotebookDetail]);

    // get all nodes
    const handleFindMapNodes = async () => {
        const res = await dispatch(findAllMapNodes({
            jwt: jwt, graphId: currentOpenGraphInfo['_id']
        }));
        return res['payload'];
    }

    // get all links
    const handleFindMapLinks = async () => {
        const res = await dispatch(findAllMapLinks({
            jwt: jwt, graphId: currentOpenGraphInfo['_id']
        }));
        return res['payload'];
    }

    // get all notebook from current map
    useEffect(() => {
        handleFindMapNodes().then(res => {
            let allNodes: any[] = [];
            res['currentNodesList'].map(node => {
                allNodes.push({
                    id: node['_id'],
                    name: node['name'],
                });
            });
            // console.log(allNodes);
            setNodes(allNodes);
        });
        handleFindMapLinks().then(res => {
            let allLinks: any[] = [];
            res['currentLinksList'].map(link => {
                allLinks.push({
                    id: link['_id'],
                    name: link['name'],
                });
            });
            // console.log(allLinks);
            setLinks(allLinks);
        });
    }, [currentOpenGraphInfo]);

    // change notebook values
    const handleChangeText = (prop: keyof NotebookState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [prop]: event.target.value,
        });
    };

    // change notebook relation
    const handleChangeRelation = (event: React.ChangeEvent<{ value: unknown }>) => {
        // const relationType 
        const relationId = event.target.value as string;
        let relationType: 'node' | 'link' = 'node';
        links.map(link => {
            if (link.id === relationId) {
                relationType = 'link';
            }
        });
        // console.log(relationType);
        setValues({
            ...values,
            relationType: relationType,
            relationId: relationId,
        });
    }

    // change self defined title
    const handleChangeSelfDefinedTitle = (index) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let newTitles = values.selfDefineTitle;
        const targetValue = event.target.value;
        newTitles[index] = targetValue;
        setValues({
            ...values,
            selfDefineTitle: newTitles,
        })
    };

    // change self defined contain
    const handleChangeSelfDefinedContain = (index) => (event: React.ChangeEvent<HTMLInputElement>) => {
        let newContains = values.selfDefineContain;
        const targetValue = event.target.value;
        newContains[index] = targetValue;
        setValues({
            ...values,
            selfDefineContain: newContains,
        })
    };

    // add new property
    const handleAddNewProperty = () => {
        let newTitles = [...values.selfDefineTitle];
        let newContains = [...values.selfDefineContain];
        newTitles.push('');
        newContains.push('');
        setValues({
            ...values,
            selfDefineTitle: newTitles,
            selfDefineContain: newContains,
        });
    };

    // delete self defined property
    const handleDeleteSelfDefinedProperty = (index) => {
        let newTitle = [...values.selfDefineTitle];
        let newContain = [...values.selfDefineContain];
        newTitle.splice(index, 1);
        newContain.splice(index, 1);
        setValues({
            ...values,
            selfDefineTitle: newTitle,
            selfDefineContain: newContain,
        });
    }

    // handle change editor text
    const handleChangeTinyText = (text) => {
        setValues({
            ...values,
            text: text,
        });
    }

    const handleSaveNotebook = async () => {
        // is new? then create map
        if (isNew) {
            // console.log('create!');
            await dispatch(createMapNotebook({
                jwt: jwt, graphId: currentOpenGraphInfo['_id'],
                target: values.relationType, targetId: values.relationId,
                notebookValues: values
            }));
            setIsNew(false);
        } else {
            // console.log('update!');
            // not new? then update map
            dispatch(updateNotebookDetail({
                jwt: jwt, graphId: currentOpenGraphInfo['_id'],
                target: values.relationType, targetId: values.relationId, notebookId: currentNotebookDetail['_id'],
                notebookValues: values
            }));
        }
    };

    // delete notebook 
    const handleDeleteNotebook = () => {
        // 1. send delete action to redux
        dispatch(deleteNotebook({
            jwt: jwt, graphId: currentOpenGraphInfo['_id'],
                target: values.relationType, targetId: values.relationId, notebookId: currentNotebookDetail['_id'],
        }));
        // 2. back to notebook list view
        setOpenDialog(false);
        handleSwitchViews('graphView');
    };

    interface DeleteNoteDialogState {
        openDialog: boolean;
        handleCloseDialog: ()=>void;
    }
    const DeleteNoteDialog:React.FC<DeleteNoteDialogState> = ({
        openDialog, handleCloseDialog
    }) => {
        return (
            <DialogBox 
                open={openDialog} 
                title={'??????????????????'} 
                contain={
                    <div>????????????????????????????????????????????????<b style={{color: 'orange'}}>????????????????????????</b></div>
                }
                actions={
                    <>
                        <Button size="small" variant="outlined" color="secondary" onClick={handleCloseDialog}>??????</Button>
                        <Button size="small" variant="text" color="primary" onClick={handleDeleteNotebook}>??????</Button>
                    </>
                } 
            />
        );
    };

    return (
        <React.Fragment>
            <div className={classes.notebookProperty}>
                <TextField
                    id="knm-node-name"
                    size="small"
                    placeholder="??????????????????"
                    value={values.title}
                    onChange={handleChangeText('title')}
                    className={clsx(classes.selfDefineInputStyle, classes.notebookTitle)}
                    autoComplete="off"
                />
                <div>
                    <Button
                        variant="text"
                        color="secondary"
                        startIcon={<DeleteIcon />}
                        style={{marginRight: 10}}
                        onClick={()=>setOpenDialog(true)}
                    >????????????</Button>
                    {/* delete notebook dialog */}
                    <DeleteNoteDialog
                        openDialog={openDialog}
                        handleCloseDialog={()=>setOpenDialog(false)}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={
                            notebookLoading ? (
                                <CircularProgress style={{ width: 20, height: 20, color: 'white' }} />
                            ) : (
                                <SaveIcon />
                            )
                        }
                        onClick={handleSaveNotebook}
                    >????????????</Button>
                </div>
            </div>
            <div className={classes.notebookProperty}>
                <div
                    className={classes.notebookPropertyLeft}
                >
                    <AccountTreeIcon fontSize="small" />
                    <p>????????????</p>
                </div>
                <FormControl style={{ width: '100%', flex: 1, }}>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={values.relationId}
                        onChange={handleChangeRelation}
                    >
                        <MenuItem value='0' disabled>
                            ????????????????????????????????????????????????/????????????
                        </MenuItem>
                        <Typography variant="overline" className={classes.searchSubTitle}>????????????</Typography>
                        {
                            nodes.map((node, index) => {
                                return (
                                    <MenuItem value={node.id} key={node.id}>{node.name}</MenuItem>
                                );
                            })
                        }
                        <Typography variant="overline" className={classes.searchSubTitle}>????????????</Typography>
                        {
                            links.map((link, index) => {
                                return (
                                    <MenuItem value={link.id} key={link.id}>{link.name}</MenuItem>
                                );
                            })
                        }
                    </Select>
                </FormControl>
            </div>
            <div className={classes.notebookProperty}>
                <div
                    className={classes.notebookPropertyLeft}
                >
                    <LocalOfferIcon fontSize="small" />
                    <p>????????????</p>
                </div>
                <Autocomplete
                    style={{ width: '100%', flex: 1, marginTop: -3 }}
                    multiple
                    id="tags-filled"
                    options={mockTags.map((option) => option.title)}
                    value={values.tags}
                    freeSolo
                    onChange={(event, newValue) => {
                        setValues({
                            ...values,
                            tags: newValue
                        });
                    }}
                    renderTags={(value: string[], getTagProps) => (
                        value.map((option: string, index: number) => (
                            (<Chip variant="default" label={option} size="small" color="primary" {...getTagProps({ index })} />)
                        ))
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="????????????????????????"
                        />
                    )}
                />
            </div>
            <div className={classes.notebookProperty}>
                <div
                    className={classes.notebookPropertyLeft}
                >
                    <FormatQuoteIcon fontSize="small" />
                    <p>????????????</p>
                </div>
                <TextField
                    id="knm-node-name"
                    size="small"
                    autoComplete="off"
                    placeholder="????????????????????????(??????????????????????????????, e.g. Flavell, 1978)"
                    value={values.quote}
                    onChange={handleChangeText('quote')}
                    style={{ width: '100%', flex: 1 }}  // setting flex:1 to control width unchangeable in flex display
                />
            </div>
            <div className={classes.notebookProperty}>
                <div
                    className={classes.notebookPropertyLeft}
                >
                    <PaymentIcon fontSize="small" />
                    <p>????????????</p>
                </div>
                <TextField
                    id="knm-node-name"
                    size="small"
                    autoComplete="off"
                    placeholder="????????????????????????????????????????????????????????????"
                    value={values.intro}
                    onChange={handleChangeText('intro')}
                    style={{ width: '100%', flex: 1 }}  // setting flex:1 to control width unchangeable in flex display
                />
            </div>
            {
                values.selfDefineTitle.length > 0 &&
                values.selfDefineTitle.map((title, index) => (
                    <div className={classes.notebookProperty} key={`selfDefined-${index}`}>
                        <div
                            key={`selfDefined-left-${index}`}
                            className={classes.notebookPropertyLeft}
                        >
                            <Tooltip title="????????????" arrow>
                                <RemoveCircleOutlineIcon
                                    fontSize="small"
                                    onClick={() => handleDeleteSelfDefinedProperty(index)}
                                />
                            </Tooltip>
                            <TextField
                                size="small"
                                autoComplete="off"
                                placeholder="??????????????????"
                                value={title}
                                onChange={handleChangeSelfDefinedTitle(index)}
                            />
                        </div>
                        <TextField
                            id={`selfDefined-text-${index}`}
                            size="small"
                            autoComplete="off"
                            placeholder="??????????????????????????????"
                            value={values.selfDefineContain[index]}
                            style={{ width: '100%', flex: 1 }}  // setting flex:1 to control width unchangeable in flex display
                            onChange={handleChangeSelfDefinedContain(index)}
                        />
                    </div>
                ))
            }
            <div className={classes.notebookProperty} style={{ height: 39 }}>
                <div
                    className={classes.notebookPropertyLeft}
                    style={{ color: 'grey' }}
                    onClick={handleAddNewProperty}
                >
                    <ControlPointIcon fontSize="small" />
                    <p>???????????????</p>
                </div>
            </div>

            <TinyMCE
                type="inline"
                text={values.text}
                handleChangeTinyText={handleChangeTinyText}
            />
        </React.Fragment>
    )
}
