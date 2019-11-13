import React from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    Slide,
    TextField
} from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';

const addIcon = () => <FontAwesomeIcon icon={faPlus} />;
const deleteIcon = () => <FontAwesomeIcon icon={faTrashAlt} />;

const useStyles = makeStyles(theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap'
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 400
    },
    errorMessage: {
        color: red[500]
    }
}));

const Transition = React.forwardRef((props, ref) => (
    <Slide direction='up' ref={ref} {...props} />
));

const RulesTable = () => {
    const classes = useStyles();
    const tableRef = React.createRef();
    const [data, setData] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [showErrorMessage, setShowErrorMessage] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [name, setName] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [type, setType] = React.useState('');
    const [language, setLanguage] = React.useState('');
    const [template, setTemplate] = React.useState('');

    const handleClose = () => {
        setOpen(false);
        setShowErrorMessage(false);
        setName('');
        setDescription('');
    };

    const handleOpen = () => {
        setName('');
        setDescription('');
        setShowErrorMessage(false);
        setOpen(true);
    };

    const handleTextFieldChange = e => {
        const { target: { name, value } } = e;

        if (name === 'name') {
            setName(value);
        } else if (name === 'description') {
            setDescription(value);
        } else if (name === 'type') {
            setType(value);
        } else if (name === 'template') {
            setTemplate(value);
        } else if (name === 'language') {
            setLanguage(value);
        }
    };

    const handleDialogSubmit = (
        name, description, type, template, language
    ) => {
        const createData = async (
            name, description, type, template, language
        ) => {
            const result = await axios.post(
                'http://localhost:3001/api/rules',
                { name, description, type, template, language }
            );
            if (result.status >= 200 && result.status < 300) {
                const newData = data.concat(result.data);
                setData(newData);
                handleClose();
            } else {
                setShowErrorMessage(true);
                setErrorMessage(JSON.stringify(result.data));
            }
        };
        createData(name, description, type, template, language);
    };

    React.useEffect(() => {
        const fetchData = async () => {
            const result = await axios('http://localhost:3001/api/rules');
            setData(result.data);
        };
        fetchData();
    }, []);

    return (
        <div>
            <MaterialTable
                tableRef={tableRef}
                title='Rules Administration'
                columns={[
                    { title: 'Name', field: 'name', type: 'string' },
                    { title: 'Description', field: 'description', type: 'string' },
                    { title: 'Type', field: 'type', type: 'string' },
                    { title: 'Template', field: 'template', type: 'string' },
                    { title: 'Language', field: 'language', type: 'string' },
                    { title: 'Program Id', field: 'programId', type: 'numeric' },
                    { title: 'Dynamic Date?', field: 'includeDynamicDate', type: 'boolean' }
                ]}
                data={data}
                actions={[
                    {
                        icon: addIcon,
                        tooltip: 'Add Rule',
                        isFreeAction: true,
                        onClick: (event, rows) => {
                            console.log('Add rule button clicked.');
                            handleOpen();
                        }
                    },
                    {
                        icon: deleteIcon,
                        tooltip: 'Delete Selected Rules',
                        isFreeAction: true,
                        onClick: (event, rows) => {
                            console.log('Delete rules button clicked.');
                        }
                    }
                ]}
                options={{
                    actionsColumnIndex: -1,
                    search: false,
                    selection: true,
                    showTextRowsSelected: true,
                    toolbarButtonAlignment: 'right'
                }}
            />
            <Dialog
                onClose={handleClose}
                aria-labelledby='rule-dialog-title'
                open={open}
                TransitionComponent={Transition}
            >
                <DialogTitle id='rule-dialog-title'>
                    Create Rule
                </DialogTitle>
                <DialogContent>
                    {showErrorMessage && (
                        <DialogContentText
                            key='rule-dialog-content-text'
                            className={classes.errorMessage}
                        >
                            An error occurred while attempting to create
                            content.
                            <br />
                            Error Message: {errorMessage}
                        </DialogContentText>
                    )}

                    <form action='/' method='POST'>
                        <List>
                            <ListItem key='name-list-item'>
                                <TextField
                                    required
                                    id='name'
                                    name='name'
                                    label='Name'
                                    className={classes.textField}
                                    margin='normal'
                                    onChange={handleTextFieldChange}
                                />
                            </ListItem>
                            <ListItem key='description-list-item'>
                                <TextField
                                    id='description'
                                    name='description'
                                    label='Description'
                                    className={classes.textField}
                                    margin='normal'
                                    onChange={handleTextFieldChange}
                                />
                            </ListItem>
                            <ListItem key='type-list-item'>
                                <TextField
                                    id='type'
                                    name='type'
                                    label='Type'
                                    className={classes.textField}
                                    margin='normal'
                                    onChange={handleTextFieldChange}
                                />
                            </ListItem>
                            <ListItem key='template-list-item'>
                                <TextField
                                    id='template'
                                    name='template'
                                    label='Template'
                                    className={classes.textField}
                                    margin='normal'
                                    onChange={handleTextFieldChange}
                                />
                            </ListItem>
                            <ListItem key='language-list-item'>
                                <TextField
                                    id='language'
                                    name='language'
                                    label='Language'
                                    className={classes.textField}
                                    margin='normal'
                                    onChange={handleTextFieldChange}
                                />
                            </ListItem>
                        </List>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='primary'>
                        Cancel
                    </Button>
                    <Button
                        color='primary'
                        onClick={e => {
                            e.preventDefault();
                            handleDialogSubmit(
                                name, description, type, template, language
                            );
                        }}
                    >
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default RulesTable;
