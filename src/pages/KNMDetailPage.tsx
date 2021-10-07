import React, { useEffect, useState } from 'react';
// import customize components
import { KnowledgeGraph, InfoPanel, DataTable } from '../components/common';
// import MD
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import AssignmentIcon from '@material-ui/icons/Assignment';
import MoreIcon from '@material-ui/icons/MoreVert';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import SaveIcon from '@material-ui/icons/Save';

import Autocomplete from '@material-ui/lab/Autocomplete';
import Chip from '@material-ui/core/Chip';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// import redux
import { useSelector } from '../redux/hooks';
// import mock data
import { nodeData, linkData, relations } from '../settings/mocks/DefaultGraph';
import { rows } from '../settings/mocks/DefaultNotebooks';
import { mockTags } from '../settings/mocks/DefaultTags';

const useStyles = makeStyles((theme: Theme) => createStyles({
    toolBarPaper: {
        borderRadius: 0,
    },
    toolBar: {
        height: '47px',
    },
    paper: {
        display: 'flex',
        flexWrap: 'wrap',
        borderRadius: 0,
        height: '47px',
        lineHeight: '47px',
        boxShadow: 'none',
    },
    divider: {
        margin: theme.spacing(1, 0.5),
    },
    graphTitle: {
        paddingLeft: 20,
        fontSize: 18,
    },
    toolBarButtons: {
        "& > *": {
            color: theme.palette.type === 'light' ? theme.palette.grey[500] : theme.palette.grey[200],
            minWidth: 50,
        },
        " & > *:hover ": {
            borderRadius: 'none',
        }
    },
    openHiddenToolBar: {
        color: theme.palette.grey[600],
        minWidth: 40,
        width: 40,
        minHeight: 40,
        borderRadius: 20,
        // marginRight: 10,
    },
    hiddenToolBar: {
        zIndex: 10,
    },
    hiddenToolBarBtn: {
        marginTop: 4,
        zIndex: 20,
        "& > *": {
            color: theme.palette.grey[500],
            minWidth: 40,
            width: 40,
            minHeight: 40,
            borderRadius: 20,
            margin: '2px 0px',
        }
    },
    hide: {
        display: 'none',
    },
    infoPanel: {
        flex: 'flow',
        position: 'fixed',
        top: 97,
        right: 0,
        padding: 20,
        backgroundColor: theme.palette.type === "light" ? '#e3eded' : '#303030',
        width: 400,
        height: 'calc(100vh - 97px)',
        borderRadius: 0,
        boxShadow: 'none',
        overflow: 'auto',
        '&::-webkit-scrollbar': {
            width: 5,
            backgroundColor: theme.palette.type === 'light' ? '#e3eded' : '#424242',
        },
        '&::-webkit-scrollbar-thumb': {
            background: theme.palette.type === 'light' ? '#ffb74d' : '#707070b3',
            borderRadius: '8px',
        },
    },
    infoPanelTitle: {
        fontSize: '18px !important',
    },
    infoPanelCloseBtn: {
        marginTop: 3,
        "&:hover": {
            cursor: 'pointer',
            color: theme.palette.error.main,
        }
    },
    infoPanelForms: {
        // marginBottom: theme.spacing(2),
        '&>*': {
            marginBottom: theme.spacing(2),
            width: '100%',
        },
    },
    tableContainer: {
        overflow: 'auto',
        '&::-webkit-scrollbar': {
            height: 5,
            backgroundColor: theme.palette.type === 'light' ? '#ffffff' : '#424242',
        },
        '&::-webkit-scrollbar-thumb': {
            background: theme.palette.type === 'light' ? '#c2c2c2' : '#707070b3',
            borderRadius: '6px',
        },
    },
    table: {
        minWidth: 650,
    },
    tableHead: {
        backgroundColor: theme.palette.primary.dark,
        "& *": {
            color: theme.palette.common.white,
        }
    },
    tableBody: {
        "&>*:hover": {
            backgroundColor: theme.palette.action.hover,
        },
    },
}));

/**
 * * Node Info Edit Panel
 */
interface NodeInfoEditPanelState {
    nodeName: string;
};
const NodeInfoEditPanel: React.FC<NodeInfoEditPanelState> = ({
    nodeName
}) => {
    const classes = useStyles();

    return (
        <React.Fragment>
            <form className={classes.infoPanelForms} noValidate autoComplete="off">
                <TextField
                    id="knm-node-name"
                    label="知识节点名称"
                    // variant="outlined" 
                    size="small"
                    value={nodeName}
                />
                <Autocomplete
                    multiple
                    id="tags-filled"
                    options={mockTags.map((option) => option.title)}
                    defaultValue={[mockTags[0].title]}
                    freeSolo
                    renderTags={(value: string[], getTagProps) =>
                        value.map((option: string, index: number) => (
                            <Chip variant="outlined" label={option} size="small" color="primary" {...getTagProps({ index })} />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField {...params} label="知识节点标签" placeholder="选择或输入标签" />
                    )}
                />
                <TextField
                    id="knm-node-intro"
                    label="知识节点简介"
                    // variant="outlined"
                    size="small"
                    defaultValue="这是一段关于“函数的求导”节点的信息简介..."
                    multiline
                // rows={4}
                />
                <TextField
                    id="knm-node-style"
                    label="知识节点样式选择"
                    // variant="outlined" 
                    size="small"
                    defaultValue="默认样式"
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                >
                    保存节点信息
                </Button>
            </form>
            <Divider style={{ marginBottom: 10 }} />
            <Typography
                variant="h6" gutterBottom
                className={classes.infoPanelTitle}
            >知识节点 | 笔记列表</Typography>
            <DataTable
                header={["笔记标题", "引用", "笔记标签", "更新时间"]}
                rows={rows}
            />
        </React.Fragment>
    );
};

/**
 * * Graph Basic Info Edit Panel
 */
 interface GraphBasicInfoState {
    title: string;
    icon: any;
    intro: string;
};
const GraphBasicInfoEditPanel: React.FC = () => {
    const classes = useStyles();
    // redux
    const currentTag = useSelector(state => state.openPage.currentActivatedTab);
    // component state
    const [values, setValues] = useState<GraphBasicInfoState>({
        title: currentTag.title,
        icon: currentTag.icon,
        intro: '这是一段关于“学习科学知识地图”的简单描述，你可以在这里写下任何有关这一知识地图的相关信息...'
    });

    const handleChange = (prop: keyof GraphBasicInfoState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    return (
        <React.Fragment>
            <form className={classes.infoPanelForms} noValidate autoComplete="off">
                <div>
                    知识地图小图标: {values.icon}
                </div>
                <TextField
                    id="knm-node-name"
                    label="知识地图标题"
                    size="small"
                    value={values.title}
                    onChange={handleChange('title')}
                />
                <TextField
                    id="knm-node-intro"
                    label="知识节点简介"
                    size="small"
                    value={values.intro}
                    onChange={handleChange('intro')}
                    multiline
                />
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                >
                    保存基本信息
                </Button>
            </form>
        </React.Fragment>
    );
};

/**
 * * Add New Node Panel
 */
const AddNewNodePanel: React.FC = () => {
    return (
        <React.Fragment>
            新增知识节点
        </React.Fragment>
    );
};

/**
 * * Add New Link Panel
 */
 const AddNewLinkPanel: React.FC = () => {
    return (
        <React.Fragment>
            新增知识关联
        </React.Fragment>
    );
};

/**
 * * Modify Graph Theme Panel
 */
 const ModifyGraphThemePanel: React.FC = () => {
    return (
        <React.Fragment>
            修改主题样式
        </React.Fragment>
    );
};

/**
 * * Knowledge Network Map: Main Component Page
 */
export const KNMDetailPage: React.FC = () => {
    // component class style
    const classes = useStyles();
    // redux
    const currentTheme = useSelector(state => state.changeTheme.currentTheme);
    // media query
    const mediaWidth = useMediaQuery('(min-width:950px)');
    /**
     * * Components State
     */
    // graph edit tool bar
    const [openHiddenToolBar, setOpenHiddenToolBar] = useState(false);
    // node & link info panel: graph basic info + new node + new link + modify node or link info + ...
    const [openInfoPanel, setOpenInfoPanel] = useState({
        graphBasicInfoEditPanel: false,
        addNewNodePanel: false,
        addNewLinkPanel: false,
        modifyGraphThemePanel: false,
        nodeInfoEditPanel: false,
    });
    const [nodeName, setNodeName] = useState('');   // node name show in InfoPanel
    // Graph state
    const [graph, setGraph] = useState({
        node: nodeData,
        link: linkData,
        relations: relations,
    });

    // open hidden tool bar when media width less than 950px
    const handleToolBarOpen = () => {
        setOpenHiddenToolBar(!openHiddenToolBar);
    };

    // close all info panel
    const handleCloseInfoPanel = () => {
        setOpenInfoPanel({
            graphBasicInfoEditPanel: false,
            addNewNodePanel: false,
            addNewLinkPanel: false,
            modifyGraphThemePanel: false,
            nodeInfoEditPanel: false,
        });
    };

    // open Graph Basic Info Edit Panel
    const handleOpenGraphBasicInfoEditPanel = () => {
        setOpenInfoPanel({
            graphBasicInfoEditPanel: true,
            addNewNodePanel: false,
            addNewLinkPanel: false,
            modifyGraphThemePanel: false,
            nodeInfoEditPanel: false,
        });
    };

    // open Add New Node Panel
    const handleOpenAddNewNodePanel = () => {
        setOpenInfoPanel({
            graphBasicInfoEditPanel: false,
            addNewNodePanel: true,
            addNewLinkPanel: false,
            modifyGraphThemePanel: false,
            nodeInfoEditPanel: false,
        });
    };

    // open Add New Link Panel
    const handleOpenAddNewLinkPanel = () => {
        setOpenInfoPanel({
            graphBasicInfoEditPanel: false,
            addNewNodePanel: false,
            addNewLinkPanel: true,
            modifyGraphThemePanel: false,
            nodeInfoEditPanel: false,
        });
    };

    // open Modify Graph Theme Panel
    const handleOpenModifyGraphThemePanel = () => {
        setOpenInfoPanel({
            graphBasicInfoEditPanel: false,
            addNewNodePanel: false,
            addNewLinkPanel: true,
            modifyGraphThemePanel: true,
            nodeInfoEditPanel: false,
        });
    };


    // handle graph elements click
    const echartsClick = {
        'click': (e) => {
            if (e.name) {
                setNodeName(e.name);
                setOpenInfoPanel({
                    graphBasicInfoEditPanel: false,
                    addNewNodePanel: false,
                    addNewLinkPanel: false,
                    modifyGraphThemePanel: false,
                    nodeInfoEditPanel: true,
                });
            }
        }
    };

    // add graph node
    const addNode = () => {
        // 将原本的数组深拷贝到新的数组中, 防止useState无法检测数组内容的变化
        let nodes = graph.node.concat();
        let newNode = {
            name: "new Node!",
            draggable: true,
            symbolSize: [100, 100],
            itemStyle: {
                color: '#FF963F'
            },
        };
        nodes.push(newNode);
        setGraph({
            ...graph,
            node: nodes
        })
    };

    return (
        <React.Fragment>
            {/* tool bar button */}
            <Paper className={classes.toolBarPaper}>
                {
                    mediaWidth ? (
                        <Grid
                            className={classes.toolBar}
                            container
                            direction="row"
                            // justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <Paper className={classes.paper}>
                                    <Grid container spacing={2} className={classes.graphTitle}>
                                        <Grid item>🧩</Grid>
                                        <Grid item>学习科学知识地图</Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item style={{ marginLeft: 20 }}>
                                <Paper elevation={0} className={classes.paper}>
                                    <Divider flexItem orientation="vertical" className={classes.divider} />
                                    <ToggleButtonGroup
                                        size="small"
                                        exclusive
                                        aria-label="text alignment"
                                        className={classes.toolBarButtons}
                                    >
                                        <Tooltip title="修改基本信息" arrow>
                                            <Button value="center" aria-label="centered" onClick={handleOpenGraphBasicInfoEditPanel}>
                                                <AssignmentIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="添加知识节点" arrow>
                                            <Button value="center" aria-label="centered" onClick={handleOpenAddNewNodePanel}>
                                                <AddCircleOutlineIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="添加知识节点" arrow>
                                            <Button value="添加节点关联" aria-label="right aligned" onClick={handleOpenAddNewLinkPanel}>
                                                <AccountTreeIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="修改主题风格" arrow>
                                            <Button value="修改主题风格" aria-label="centered" onClick={handleOpenModifyGraphThemePanel}>
                                                <FormatColorFillIcon />
                                            </Button>
                                        </Tooltip>
                                    </ToggleButtonGroup>
                                    <Divider flexItem orientation="vertical" className={classes.divider} />
                                    <ToggleButtonGroup
                                        size="small"
                                        exclusive
                                        aria-label="text alignment"
                                        className={classes.toolBarButtons}
                                    >
                                        <Tooltip title="放大" arrow>
                                            <Button value="放大" aria-label="centered">
                                                <ZoomInIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="缩小" arrow>
                                            <Button value="缩小" aria-label="centered">
                                                <ZoomOutIcon />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="全屏" arrow>
                                            <Button value="全屏" aria-label="centered">
                                                <ZoomOutMapIcon />
                                            </Button>
                                        </Tooltip>
                                    </ToggleButtonGroup>
                                    <Divider flexItem orientation="vertical" className={classes.divider} />
                                </Paper>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid
                            className={classes.toolBar}
                            container
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Grid item>
                                <Paper className={classes.paper}>
                                    <Grid container spacing={2} className={classes.graphTitle}>
                                        <Grid item>🧩</Grid>
                                        <Grid item>学习科学知识地图</Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                            <Grid item style={{ marginRight: 20 }}>
                                <Paper elevation={0} className={classes.paper}>
                                    <div className={classes.hiddenToolBar}>
                                        <Button
                                            className={classes.openHiddenToolBar}
                                            value="center"
                                            aria-label="centered"
                                            onClick={handleToolBarOpen}
                                        >
                                            <MoreIcon />
                                        </Button>
                                        <Fade in={openHiddenToolBar}>
                                            <Grid container direction="column" className={classes.hiddenToolBarBtn}>
                                                <Tooltip title="修改基本信息" placement="left" arrow>
                                                    <Button value="center" aria-label="centered" onClick={handleOpenGraphBasicInfoEditPanel}>
                                                        <AssignmentIcon />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="添加知识节点" placement="left" arrow>
                                                    <Button value="center" aria-label="centered" onClick={handleOpenAddNewNodePanel}>
                                                        <AddCircleOutlineIcon />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="添加知识节点" placement="left" arrow>
                                                    <Button value="添加节点关联" aria-label="right aligned" onClick={handleOpenAddNewLinkPanel}>
                                                        <AccountTreeIcon />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="修改主题风格" placement="left" arrow>
                                                    <Button value="修改主题风格" aria-label="centered" onClick={handleOpenModifyGraphThemePanel}>
                                                        <FormatColorFillIcon />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="放大" placement="left" arrow>
                                                    <Button value="放大" aria-label="centered">
                                                        <ZoomInIcon />
                                                    </Button>
                                                </Tooltip>

                                                <Tooltip title="缩小" placement="left" arrow>
                                                    <Button value="缩小" aria-label="centered">
                                                        <ZoomOutIcon />
                                                    </Button>
                                                </Tooltip>
                                                <Tooltip title="全屏" placement="left" arrow>
                                                    <Button value="全屏" aria-label="centered">
                                                        <ZoomOutMapIcon />
                                                    </Button>
                                                </Tooltip>
                                            </Grid>
                                        </Fade>
                                    </div>
                                </Paper>
                            </Grid>
                        </Grid>
                    )
                }
            </Paper>
            {/* graph */}
            <KnowledgeGraph
                nodeData={graph.node}
                linkData={graph.link}
                relations={graph.relations}
                themeMode={currentTheme === 'light' ? 'white' : 'black'}
                echartsClick={echartsClick}
            />
            {/* node info edit panel */}
            {
                openInfoPanel.nodeInfoEditPanel &&
                <InfoPanel
                    title={'知识节点 | 信息编辑'}
                    handleClosePanel={handleCloseInfoPanel}
                    contain={
                        <NodeInfoEditPanel
                            nodeName={nodeName}
                        />
                    }
                />
            }
            {/* graph info edit panel */}
            {
                openInfoPanel.graphBasicInfoEditPanel &&
                <InfoPanel
                    title={'知识笔记 | 基础信息'}
                    handleClosePanel={handleCloseInfoPanel}
                    contain={
                        <GraphBasicInfoEditPanel />
                    }
                />
            }
            {/* add new node panel */}
            {
                openInfoPanel.addNewNodePanel &&
                <InfoPanel
                    title={'知识笔记 | 新增知识节点'}
                    handleClosePanel={handleCloseInfoPanel}
                    contain={
                        <AddNewNodePanel />
                    }
                />
            }
            {/* add new link panel */}
            {
                openInfoPanel.addNewLinkPanel &&
                <InfoPanel
                    title={'知识笔记 | 新增知识关联'}
                    handleClosePanel={handleCloseInfoPanel}
                    contain={
                        <AddNewLinkPanel />
                    }
                />
            }
            {/* modefy graph theme panel */}
            {
                openInfoPanel.modifyGraphThemePanel &&
                <InfoPanel
                    title={'知识笔记 | 修改主题样式'}
                    handleClosePanel={handleCloseInfoPanel}
                    contain={
                        <ModifyGraphThemePanel />
                    }
                />
            }
        </React.Fragment>
    )
}
