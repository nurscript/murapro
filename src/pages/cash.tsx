import { ChangeEvent, useEffect, useState } from 'react'

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, ListItemText, Pagination, Paper, Typography } from "@mui/material";

//import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { collection, deleteDoc, doc, onSnapshot, Timestamp, updateDoc } from 'firebase/firestore'

import { db } from '../firebase'
import usePaymentStore from '../store/payment-store'
import { VariantType, useSnackbar } from 'notistack';

interface DataItem {
    id: string | undefined;
    name: string;
    photo: string;
    time: Timestamp | undefined;
    bank: string;
    price: string;
    xid: string;
    approved: boolean;
}


export const CashPage = () => {

    const { enqueueSnackbar } = useSnackbar();

    const [list, setList] = useState<DataItem[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6; // Number of items per page

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
    const { setWithdraw } = usePaymentStore();
    const totalPages = Math.ceil(list.length / itemsPerPage);
    function handleClickVariant(message: string, variant: VariantType) {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const parseTime = (time: Timestamp | undefined) => {
        if (!(time instanceof Timestamp)) {
            return 'invalid'
        }
        const date = time.toDate();
        // Format the date and time
        const formattedDate = date.toLocaleDateString(); // e.g., "12/31/2023"
        const formattedTime = date.toLocaleTimeString(); // e.g., "12:00:00 PM"
        return formattedDate + ' - ' + formattedTime;
    }


    const deleteItem = async (id: string | undefined) => {
        if (!id) {
            handleClickVariant('Can\'t delete this doc', 'error');
            return
        }
        await deleteDoc(doc(db, 'withdraw', id)); // Deleting from Firebase

        const item = list.find((obj) => obj.id === id);
        // delete image 
        handleClickVariant(`Успешно удален  ${item?.name}`, 'success');
        setList(list.filter(item => item.id !== id)); // Updating state
        closeModal();
        // decrement();
    };


    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'withdraw'), (querySnapshot) => {
            const fetchedList: DataItem[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: doc.id,
                    name: data.name,
                    photo: data.photo,
                    time: data.time,
                    bank: data.bank,
                    price: data.price,
                    xid: data.xid,
                    approved: data.approved,
                } as DataItem;
            });
            setList(fetchedList);
            setWithdraw(fetchedList.length);
        });

        // Cleanup subscription on component unmount
        return () => unsubscribe();
    }, []);

    const [selectedData, setSelectedImage] = useState<DataItem | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const handlePageChage = (_: ChangeEvent<unknown>, pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    const openModal = (imageSrc: DataItem): void => {
        setSelectedImage(imageSrc);
        setIsModalOpen(true);
    };

    const closeModal = (): void => {
        setSelectedImage(undefined);
        setIsModalOpen(false);
    };


    const approve = async (id: string | undefined) => {
        if (!id) {
            handleClickVariant('Can\'t update this doc', 'error');
            return
        }
        const docRef = doc(db, 'withdraw', id);

        try {
            await updateDoc(docRef, {
                approved: true
            })
            const item = list.find((obj) => obj.id === id);
            setList((prevList) => prevList.map((item) =>
                item.id === id ? { ...item, approved: true } : item));
            handleClickVariant(`Подтвердили  : ${item?.name}.`, 'success');

        } catch (error) {
            handleClickVariant(`Error updating  data : ${error}.`, 'error');
            console.error("Error updating data:", error);
        }

        console.log(`Appoved selected item ${id} `);
        closeModal();
    }

    return (
        <>
            <h1>Заявки на вывод</h1>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

            }}>

                <Paper sx={{ padding: '1rem' }} >
                    <List dense component="div" role="list" >
                        {
                            currentItems.length === 0 ? (<Typography>Пока ничего нет</Typography>) :
                                currentItems.map((item) => (
                                    <ListItemButton key={item.id} role="listitem" onClick={() => openModal(item)}>
                                        <ListItemText primary={item.name} secondary={item.bank} sx={{ marginInline: '2rem' }} />
                                        <ListItemText primary={"Цена: " + item.price + " сом"} secondary={item?.approved ? (<Typography color='success'> подтвержден </Typography>) : (<Typography color='warning'> не подтвержден</Typography>)} color='textSecondary' />
                                    </ListItemButton>
                                ))

                        }
                    </List>
                </Paper>

            </Box>
            <Pagination sx={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }} count={totalPages} onChange={handlePageChage} color='primary' size='large' />

            <Dialog open={isModalOpen} onClose={closeModal}>
                <DialogTitle>Details / Action</DialogTitle>
                <DialogContent>
                    <Typography color='success'> Счет - {selectedData?.xid} </Typography>
                    <Typography color='primary'> время {parseTime(selectedData?.time)} </Typography>
                </DialogContent>
                <DialogActions >
                    <Button autoFocus onClick={closeModal}> Отмена </Button>
                    {!selectedData?.approved && <Button color='success' onClick={() => approve(selectedData?.id)}> Принять </Button>}
                    {!selectedData?.approved && <Button color='error' onClick={() => deleteItem(selectedData?.id)} > Отказать и удалить </Button>}
                </DialogActions>
            </Dialog>
        </>
    )
}