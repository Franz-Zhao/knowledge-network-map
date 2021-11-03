import React, { useState, useEffect } from 'react';
// import customize components
import { TinyMCE, PaginationDataTable, DialogBox } from '../../components/common';
// import MD
import clsx from 'clsx';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import { Paper, TextField, useMediaQuery } from '@material-ui/core';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import CameraAltIcon from '@material-ui/icons/CameraAlt';
import LanguageIcon from '@material-ui/icons/Language';
import BubbleChartIcon from '@material-ui/icons/BubbleChart';
import BookIcon from '@material-ui/icons/Book';
import SettingsIcon from '@material-ui/icons/Settings';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import FilterDramaIcon from '@material-ui/icons/FilterDrama';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';
import AllInboxIcon from '@material-ui/icons/AllInbox';
import EventNoteIcon from '@material-ui/icons/EventNote';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import CameraIcon from '@material-ui/icons/Camera';
import ControlPointIcon from '@material-ui/icons/ControlPoint';
import Autocomplete from '@material-ui/lab/Autocomplete';
import FormatQuoteIcon from '@material-ui/icons/FormatQuote';
import PaymentIcon from '@material-ui/icons/Payment';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import Chip from '@material-ui/core/Chip';
import SaveIcon from '@material-ui/icons/Save';
// import img
import userImg from '../../assets/image/users/Franz.png';
import userHeaderBgImg from '../../assets/image/loginBackground-1.jpg';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
// echarts
import ReactECharts from 'echarts-for-react';
import { HeatmapChart, } from 'echarts/charts';
// import { LegendComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';
// get mock data
import { DefaultDiary } from '../../settings/mocks/DefaultDiary';
import { mockDiaryTags } from '../../settings/mocks/DefaultTags';
// import jwt-decode
import jwt_decode, { JwtPayload as DefaultJwtPayload } from "jwt-decode";
// import redux
import { useSelector } from '../../redux/hooks';
// import dropzone
import { Dropzone, FileItem, FullScreenPreview } from "@dropzone-ui/react";

echarts.use(
    [HeatmapChart, SVGRenderer]
);

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        padding: theme.spacing(3),
    },
    userInfoHeader: {
        width: '100%',
        height: 150,
        background: `url(${userHeaderBgImg})`,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        // backgroundColor: 'steelblue',
        display: 'flex',
    },
    userAvatarBox: {
        margin: 'auto',
        marginTop: 90,
    },
    userImg: {
        width: theme.spacing(12),
        height: theme.spacing(12),
        // borderRadius: `2px solid white`,
    },
    userInfoBottom: {
        width: '100%',
        height: 100,
        boxShadow: theme.palette.type === 'light' ? '0px 2px 1px #dcdbdb' : '0px 2px 1px #232323',
        backgroundColor: theme.palette.background.paper,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    userInfoBottomWhenSmall: {
        width: '100%',
        // height: 100,
        backgroundColor: theme.palette.background.paper,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    userInfoDetail: {
        padding: '0 40px',
    },
    pageBtn: {
        minWidth: 40,
        width: 40,
        boxShadow: 'none',
        backgroundColor: theme.palette.primary.dark,
    },
    userSpaceContain: {
        marginTop: theme.spacing(3),
        borderRadius: 20,
        width: '100%',
        height: '100%',
        padding: `${theme.spacing(1)}px ${theme.spacing(3)}px`,
        paddingBottom: theme.spacing(3),
        // letterSpacing: 8,
    },
    forms: {
        // marginBottom: theme.spacing(2),
        '&>*': {
            marginBottom: theme.spacing(2),
            width: '100%',
        },
    },
    notebookPropertyLeft: {
        width: 180,
        marginRight: 10,
        fontSize: 16,
        display: 'flex',
        height: 35,
        paddingLeft: 10,
        marginBottom: 10,
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
    }
}));

const SmallAvatar = withStyles((theme: Theme) =>
    createStyles({
        root: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            backgroundColor: theme.palette.success.light,
            // border: `2px solid ${theme.palette.background.paper}`,
            "&:hover": {
                cursor: 'pointer',
            }
        },
    }),
)(Avatar);

// 自定义jwt的类型
interface JwtPayload extends DefaultJwtPayload {
    username: string
}

interface PageState {
    knowledgeStatic: boolean;
    diarySpace: boolean;
    userInfoSetting: boolean;
}

export const UserSpacePage: React.FC = () => {
    const classes = useStyles();
    const match = useMediaQuery('(min-width:980px)');
    const [openPages, setOpenPages] = useState<PageState>({
        knowledgeStatic: true,
        diarySpace: false,
        userInfoSetting: false,
    });
    // redux
    const jwt = useSelector(state => state.user.token);
    // show username
    const [username, setUsername] = useState("");
    // upload user avatar
    const [openUploadDialog, setOpenUploadDialog] = useState(false);

    // get username
    useEffect(() => {
        // jwt发生编码且存在, 对jwt进行解码
        if (jwt) {
            const token = jwt_decode<JwtPayload>(jwt);
            setUsername(token.username);
        }
    }, [jwt]);

    const handleOpenUploadDialog = () => {
        setOpenUploadDialog(!openUploadDialog);
    }

    const handleOpenPage = (prop: keyof PageState) => {
        if (prop === 'diarySpace') {
            setOpenPages({
                diarySpace: true,
                knowledgeStatic: false,
                userInfoSetting: false,
            });
        } else if (prop === 'knowledgeStatic') {
            setOpenPages({
                diarySpace: false,
                knowledgeStatic: true,
                userInfoSetting: false,
            });
        } else {
            setOpenPages({
                diarySpace: false,
                knowledgeStatic: false,
                userInfoSetting: true,
            });
        }
    }

    return (
        <div className={classes.root}>
            <div className={classes.userInfoHeader}>
                <Badge
                    className={classes.userAvatarBox}
                    overlap="circular"
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    badgeContent={
                        // <SmallAvatar alt="Remy Sharp" src={userImg} />
                        <Tooltip title="更换头像" arrow>
                            <SmallAvatar onClick={handleOpenUploadDialog}>
                                <CameraAltIcon fontSize="small" style={{ fontSize: 16, color: 'darkgreen' }} />
                            </SmallAvatar>
                        </Tooltip>
                    }
                >
                    <Avatar alt="Travis Howard" src={userImg} className={classes.userImg} />
                </Badge>
                {/* upload user avatar dialog */}
                <UploadUserAvatar
                    openDialog={openUploadDialog}
                    handleOpenUploadDialog={handleOpenUploadDialog}
                />
            </div>
            <div className={clsx({
                [classes.userInfoBottom]: match,
                [classes.userInfoBottomWhenSmall]: !match,
            })}>
                <div className={classes.userInfoDetail}>
                    {
                        match ? (
                            // normal screen
                            <Grid
                                container
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                            // style={{width: '100%'}}
                            >
                                <Grid item>
                                    <Grid container spacing={4}>
                                        <Grid item>
                                            <Grid
                                                container
                                                direction="column"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Grid item ><LanguageIcon /></Grid>
                                                <Grid item >知识地图</Grid>
                                                <Grid item >54</Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item >
                                            <Grid
                                                container
                                                direction="column"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Grid item ><BubbleChartIcon /></Grid>
                                                <Grid item>知识节点</Grid>
                                                <Grid item>134</Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item >
                                            <Grid
                                                container
                                                direction="column"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Grid item ><BookIcon /></Grid>
                                                <Grid item >知识笔记</Grid>
                                                <Grid item >341</Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item style={{ textAlign: 'center' }}><h2 style={{ paddingTop: 30 }}>{username}</h2></Grid>
                                <Grid item>
                                    <Grid container spacing={7}>
                                        <Grid item >
                                            <Tooltip title="知识统计" arrow>
                                                <Button
                                                    className={classes.pageBtn}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => { handleOpenPage('knowledgeStatic') }}
                                                ><EqualizerIcon /></Button>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item >
                                            <Tooltip title="日志空间" arrow>
                                                <Button
                                                    className={classes.pageBtn}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => { handleOpenPage('diarySpace') }}
                                                ><FilterDramaIcon /></Button>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item >
                                            <Tooltip title="信息设置" arrow>
                                                <Button
                                                    className={classes.pageBtn}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => { handleOpenPage('userInfoSetting') }}
                                                ><SettingsIcon /></Button>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>

                                </Grid>

                            </Grid>
                        ) : (
                            // small screen
                            <div style={{ display: 'flex', width: '100%' }}>
                                <div style={{ margin: 'auto', textAlign: 'center', marginTop: 30, marginBottom: 10 }}>
                                    <h2>Franz Zhao</h2>
                                    <Grid container spacing={4}>
                                        <Grid item xs={4}>
                                            <Grid
                                                container
                                                direction="column"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Grid item ><LanguageIcon /></Grid>
                                                <Grid item >知识地图</Grid>
                                                <Grid item >54</Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Grid
                                                container
                                                direction="column"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Grid item ><BubbleChartIcon /></Grid>
                                                <Grid item>知识节点</Grid>
                                                <Grid item>134</Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Grid
                                                container
                                                direction="column"
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                <Grid item ><BookIcon /></Grid>
                                                <Grid item >知识笔记</Grid>
                                                <Grid item >341</Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                    <Grid
                                        container
                                        spacing={7}
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                    >
                                        <Grid item xs={4}>
                                            <Tooltip title="知识统计" arrow>
                                                <Button
                                                    className={classes.pageBtn}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => { handleOpenPage('knowledgeStatic') }}
                                                ><EqualizerIcon /></Button>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Tooltip title="日志空间" arrow>
                                                <Button
                                                    className={classes.pageBtn}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => { handleOpenPage('diarySpace') }}
                                                ><FilterDramaIcon /></Button>
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Tooltip title="信息设置" arrow>
                                                <Button
                                                    className={classes.pageBtn}
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => { handleOpenPage('userInfoSetting') }}
                                                ><SettingsIcon /></Button>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        )
                    }

                </div>
            </div>
            <Paper className={classes.userSpaceContain}>
                {
                    openPages.diarySpace && <DiarySpace />
                }
                {
                    openPages.knowledgeStatic && <KnowledgeStatic />
                }
                {
                    openPages.userInfoSetting && <UserInfoSetting />
                }
            </Paper>
        </div>
    )
}

// Dialog Bos Component
interface UploadUserAvatarState {
    openDialog: boolean;
    handleOpenUploadDialog: () => void;
}
const UploadUserAvatar: React.FC<UploadUserAvatarState> = ({
    openDialog, handleOpenUploadDialog
}) => {
    // dropzone
    const [files, setFiles] = useState([]);
    const [imageSrc, setImageSrc] = useState(undefined);
    const updateFiles = (incommingFiles) => {
        console.log("incomming files", incommingFiles);
        setFiles(incommingFiles);
    };
    const onDelete = (id) => {
        setFiles(files.filter((x) => x['id'] !== id));
    };
    const handleSee = (imageSource) => {
        setImageSrc(imageSource);
    };

    return (
        <DialogBox
            open={openDialog}
            boxSize="lg"
            title={'上传头像'}
            contain={
                <Dropzone
                    style={{ minWidth: "550px" }}
                    //view={"list"}
                    onChange={updateFiles}
                    value={files}
                    maxFiles={1}
                    //header={false}
                    // footer={false}
                    maxFileSize={2998000}
                    //label="Drag'n drop files here or click to browse"
                    //label="Suleta tus archivos aquí"
                    accept=".png,image/*"
                    // uploadingMessage={"Uploading..."}
                    url="http://ec2-99-99-9-9.compute-1.amazonaws.com:2800/upload-my-file"
                    //of course this url doens´t work, is only to make upload button visible
                    //uploadOnDrop
                    //clickable={false}
                    fakeUploading
                //localization={"FR-fr"}
                >
                    {files.map((file) => (
                        <FileItem
                            {...file}
                            key={file['id']}
                            onDelete={onDelete}
                            onSee={handleSee}
                            //localization={"FR-fr"}
                            //localization={"ES-es"}
                            preview
                            info
                            hd
                        />
                    ))}
                    <FullScreenPreview
                        imgSource={imageSrc}
                        openImage={imageSrc}
                        onClose={(e) => handleSee(undefined)}
                    />
                </Dropzone>
            }
            actions={
                <React.Fragment>
                    <Button variant='text' color="primary" onClick={handleOpenUploadDialog}>取消</Button>
                    <Button variant='text' color="secondary" onClick={handleOpenUploadDialog}>确认</Button>
                </React.Fragment>
            }
        />
    );
}

const KnowledgeStatic = () => {
    const options = {
        grid: { top: 8, right: 8, bottom: 24, left: 36 },
        xAxis: {
            type: 'category',
            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                smooth: true,
            },
        ],
        tooltip: {
            trigger: 'axis',
        },
    };

    const optionBar = {
        // legend: {},
        // tooltip: {},
        dataset: {
            source: [
                ['product', '2012', '2013', '2014', '2015'],
                ['Matcha Latte', 41.1, 30.4, 65.1, 53.3],
                ['Milk Tea', 86.5, 92.1, 85.7, 83.1],
                ['Cheese Cocoa', 24.1, 67.2, 79.5, 86.4]
            ]
        },
        xAxis: [
            { type: 'category', gridIndex: 0 },
            { type: 'category', gridIndex: 1 }
        ],
        yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
        grid: [{ bottom: '55%' }, { top: '55%' }],
        series: [
            // These series are in the first grid.
            { type: 'bar', seriesLayoutBy: 'row' },
            { type: 'bar', seriesLayoutBy: 'row' },
            { type: 'bar', seriesLayoutBy: 'row' },
            // These series are in the second grid.
            { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
            { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
            { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 },
            { type: 'bar', xAxisIndex: 1, yAxisIndex: 1 }
        ]
    };


    return (
        <React.Fragment>
            <h2>知识统计</h2>
            {/* 
                知识标签统计: 柱状图
                时间统计: 类似github的日历热力图或时序折线图, 如记录登录次数? 在线时长? 操作次数? 
            */}
            <ReactECharts
                echarts={echarts}
                option={optionBar}
                style={{ height: 500 }}
            />
            <ReactECharts option={options} />
        </React.Fragment>
    )
}

const DiarySpace = () => {
    const classes = useStyles();
    const [openEditorView, setOpenEditorView] = useState(false);

    return (
        <React.Fragment>
            <div style={{ display: 'flex' }}>
                <div>
                    <h2>日志空间</h2>
                    <div className={classes.notebookPropertyLeft}>
                        <AllInboxIcon fontSize="small" />
                        <p>所有日志</p>
                    </div>
                    <div className={classes.notebookPropertyLeft}>
                        <EventNoteIcon fontSize="small" />
                        <p>学习计划</p>
                    </div>
                    <div className={classes.notebookPropertyLeft}>
                        <EmojiObjectsIcon fontSize="small" />
                        <p>学习收获</p>
                    </div>
                    <div className={classes.notebookPropertyLeft}>
                        <CameraIcon fontSize="small" />
                        <p>学习反思</p>
                    </div>
                    <div className={classes.notebookPropertyLeft} style={{ color: 'grey' }}>
                        <ControlPointIcon fontSize="small" />
                        <p>新建日志</p>
                    </div>
                </div>
                <div style={{ flex: 1, width: '100%', padding: '10px 0' }}>
                    {
                        openEditorView ? (
                            <DiarySpaceEditView
                                handleOpenListView={() => { setOpenEditorView(false) }}
                            />
                        ) : (
                            <DiarySpaceListView
                                handleOpenEditorView={() => { setOpenEditorView(true) }}
                            />
                        )
                    }
                </div>
            </div>
        </React.Fragment>
    );
};

const DiarySpaceListView = ({
    handleOpenEditorView
}) => {
    return (
        <PaginationDataTable
            header={["日志标题", "标签", "创建时间", "操作"]}
            rows={DefaultDiary}
            buttons={['查看']}
            actions={[handleOpenEditorView]}
        />
    );
};

const useEditStyles = makeStyles((theme: Theme) => createStyles({
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
    }
}));

interface DiaryState {
    title: string;
    tags: any[];
    text: string;
}

const DiarySpaceEditView = ({
    handleOpenListView
}) => {
    const classes = useEditStyles();
    const [values, setValues] = useState<DiaryState>({
        title: '',
        tags: [mockDiaryTags[1].title],
        text: '',
    });

    // change notebook values
    const handleChangeText = (prop: keyof DiaryState) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setValues({
            ...values,
            [prop]: event.target.value,
        });
    };

    // handle change editor text
    const handleChangeTinyText = (text) => {
        setValues({
            ...values,
            text: text,
        });
    }

    const handleOutput = () => {
        console.log(values);
        handleOpenListView();
    };

    return (
        <React.Fragment>
            <div className={classes.notebookProperty}>
                <TextField
                    id="knm-node-name"
                    size="small"
                    placeholder="输入日志标题"
                    value={values.title}
                    onChange={handleChangeText('title')}
                    className={clsx(classes.selfDefineInputStyle, classes.notebookTitle)}
                    autoComplete="off"
                />
                <div>
                    <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<SaveIcon />}
                        onClick={handleOutput}
                    >保存日志</Button>
                </div>
            </div>
            <div className={classes.notebookProperty}>
                <div
                    className={classes.notebookPropertyLeft}
                >
                    <LocalOfferIcon fontSize="small" />
                    <p>日志标签</p>
                </div>
                <Autocomplete
                    style={{ width: '100%', flex: 1, marginTop: -3 }}
                    multiple
                    id="tags-filled"
                    options={mockDiaryTags.map((option) => option.title)}
                    value={values.tags}
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
                            placeholder="选择或输入新标签"
                        />
                    )}
                />
            </div>

            <TinyMCE
                type="inline"
                text={values.text}
                handleChangeTinyText={handleChangeTinyText}
            />
        </React.Fragment>
    );
}

const UserInfoSetting = () => {
    return (
        <React.Fragment>
            <h2>信息设置</h2>
            <Grid container spacing={2}>
                <Grid item md={4} xs={12}>
                    <TextField
                        id="knm-node-intro"
                        label="用户名"
                        size="small"
                        value={'Franz Zhao'}
                        // onChange={handleChangeText('nodeIntro')}
                        multiline
                        style={{ width: '100%' }}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <TextField
                        id="knm-node-intro"
                        label="邮箱"
                        size="small"
                        value={'franzzhao97@gmail.com'}
                        // onChange={handleChangeText('nodeIntro')}
                        multiline
                        style={{ width: '100%' }}
                    />
                </Grid>
                <Grid item md={4} xs={12}>
                    <TextField
                        id="knm-node-intro"
                        label="重设密码"
                        size="small"
                        // defaultValue={values.nodeIntro}
                        // onChange={handleChangeText('nodeIntro')}
                        multiline
                        style={{ width: '100%' }}
                    />
                </Grid>
            </Grid>
            <Button variant="outlined" color="primary" style={{ marginTop: 30 }}>确认修改</Button>
        </React.Fragment>
    );
}