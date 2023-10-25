import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import style from '../style'
import Switch from '../component/Switch'
import axios from 'axios'
import EditModal from '../component/EditModal'
import { toast } from 'react-hot-toast'
import ShowDetailes from '../component/ShowDetailes'
import { useNavigate } from 'react-router-dom'

function ListingPage() {
    const [datas, setDatas] = useState([]);
    const [priorityDatas, setPriorityDatas]: any = useState([]);
    const [priority, setPrioritySort] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [editDatas, setEditDatas] = useState({});
    const [openDtModal, setOpenDtModal]: any = useState(false);
    const [detailes, setDetailes]: any = useState({})
    const [isEmpty, setIsEmpty] = useState(false)

    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5001/getAllDatas')
        .then((result) => {
            setDatas(result.data.tasks)
            if (result.data.tasks.length === 0) {
                setIsEmpty(true)
            } else {
                const low: any = [];
                const medium: any = [];
                const high: any = [];
                // eslint-disable-next-line array-callback-return
                datas.map((item: any) => {
                    if (item.priority === 'Low') {
                        low.push(item);
                    } else if (item.priority === 'Medium') {
                        medium.push(item)
                    } else {
                        high.push(item)
                    }
                })
            
                setPriorityDatas([...high, ...medium, ...low])
            }
        })
    }, [datas, priorityDatas])

    const formatDateAndTime = (originalDate: any) => {
        const date = new Date(originalDate);

        const options: any = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true,
        };

        const formattedDate = date.toLocaleString('en-US', options);

        return formattedDate;
    }

    const handlePrioritySort = () => {
        setPrioritySort(!priority)
    }

    const handleDelete = (heading: any) => {
        axios.post('http://localhost:5001/deleteTask', {heading})
        .then((response) => {
            if (response.data.status) {
                toast.success('Task deleted')
            } else {
                toast.error(response.data.message)
            }
        })
    }

    const handleDtModal = (datas: any) => {
        setDetailes(datas)
        setOpenDtModal(true)
    }

  return (
    <>
    {openEditModal && <EditModal editDatas={editDatas} callBack={setOpenEditModal}/>}
    {openDtModal && <ShowDetailes datas={detailes} callBack={setOpenDtModal} formatDateAndTime={formatDateAndTime}/>}
      <Grid sx={style.listingMainContainer} container>
        <Typography sx={{fontSize: '100px', color: 'white', mt: '0px', fontFamily: 'initial'}}>My Tasks</Typography>
        <Switch handleChange={handlePrioritySort}/>
        <Button onClick={() => {
                navigate('/addTask')
            }} color='success' variant='contained'>Add Task</Button>
        <Grid sx={style.listingContainer} item container>
            <Container sx={style.ListingTableHeader}>
                <Stack direction='row' spacing={0}>
                    <Typography sx={{fontSize: '20px'}}>Priority</Typography>
                    <Typography sx={{fontSize: '20px', ml: '68px'}}>Image</Typography>
                    <Typography sx={{fontSize: '20px', ml: '130px'}}>Heading</Typography>
                    <Typography sx={{fontSize: '20px', ml: '168px'}}>Date</Typography>
                    <Typography sx={{fontSize: '20px', ml: '200px'}}>Options</Typography>
                </Stack>
            </Container>
            <Stack sx={{width: '100%', height: '100% !important', overflow: 'auto'}} direction='column'>
                {
                    isEmpty ? <img style={{width: '300px', height: '260px', marginLeft: '300px'}} src="folder.png" alt="" /> :
                     (priority ? priorityDatas : datas).map((item: any) => (
                        
            <Container sx={{
                backgroundColor: '#ffe4c9',
                height: '100px',
                width: '100%',
                borderBottom: '1px solid #c7c7c7',
            }}>
                <Stack direction='row'>
                    <Box sx={{...style.ListPriorityBox, backgroundColor: 
                        item.priority === 'Low' ? '#008000' : item.priority === 'Medium' ? '#FFFF00' : '#FF0000'
                        }}>
                        <Typography>{item.priority}</Typography>
                    </Box>
                    <Container sx={style.itemImageContainer}>
                        <img className='taskImage' onClick={() => handleDtModal(item)} style={{width: '120px', height: '100%'}} src={`http://localhost:5001/getImage/${item.image}`} alt="" />
                    </Container>
                    <Container sx={style.itemHeadingContainer}>
                        <Typography sx={{
                            fontSize: '18px',
                            fontWeight: 'bold !important',
                            fontFamily: 'ui-monospace'
                        }}>{item.heading}</Typography>
                    </Container>
                    <Container sx={style.itemDateContainer}>
                        <Typography>{formatDateAndTime(item.dateAndTime)}</Typography>
                    </Container>
                    <Container sx={style.itemOptionsContainer}>
                        <Stack sx={{width: '100%', height: '100%'}} spacing={1}>
                        <Button onClick={() => {
                            setEditDatas(item);
                            setOpenEditModal(true)
                        }} variant='contained' color='primary'>Edit</Button>
                        <Button onClick={() => handleDelete(item.heading)} variant='contained' color='error'>Delete</Button>
                        </Stack>
                    </Container>
                </Stack>
            </Container>
                        
                    ))
                }
            </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default ListingPage
