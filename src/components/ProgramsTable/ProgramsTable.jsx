import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Dialog, Slide } from '@material-ui/core';
import axios from 'axios';
import MaterialTable from 'material-table';

import { ProgramsDialog } from './ProgramsDialog';

const addIcon = () => <FontAwesomeIcon icon={faPlus} />;
const deleteIcon = () => <FontAwesomeIcon icon={faTrashAlt} />;

const Transition = React.forwardRef((props, ref) => (
    <Slide direction='up' ref={ref} {...props} />
));

const ProgramsTable = () => {
    const tableRef = React.createRef();
    const [data, setData] = React.useState([]);
    const [open, setOpen] = React.useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    }

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
                    {
                        title: 'Description',
                        field: 'description',
                        type: 'string'
                    }
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
                            console.log('Delete rule button clicked.');
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
                fullScreen={true}
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <ProgramsDialog handleClose={handleClose} />
            </Dialog>
        </div>
    );
};

export default ProgramsTable;
