import { ChangeEvent, useEffect, useState } from 'react'

import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, ListItemIcon, ListItemText, Pagination, Paper, Typography } from "@mui/material";

//import { collection, getDocs, Timestamp } from 'firebase/firestore'
import { collection, deleteDoc, doc, getDocs, Timestamp , updateDoc } from 'firebase/firestore'
import { getStorage, ref, deleteObject } from 'firebase/storage'

import { db } from '../firebase'
import usePaymentStore from '../store/payment-store'
import {  VariantType, useSnackbar } from 'notistack';

interface DataItem {
    id: string | undefined;
    name: string;
    photo: string;
    time: Timestamp | undefined;
    bank: string;
    price: string;
    approved: boolean;
}


export const PaymentPage = () => {

    const { enqueueSnackbar } = useSnackbar();

    const [list, setList] = useState<DataItem[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6; // Number of items per page

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
    const {setTotal, decrement} = usePaymentStore();
    const totalPages = Math.ceil(list.length / itemsPerPage);
    function handleClickVariant (message: string, variant: VariantType)  {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    const deleteItem = async (id: string | undefined) => {
        if (!id) {
            handleClickVariant('Can\'t delete this doc', 'error');
            return
        }
        await deleteDoc(doc(db, 'payment', id)); // Deleting from Firebase

        const item = list.find((obj) => obj.id === id);
        if (item?.photo) {
            deleteImageFromStorage(item?.photo);
        } 
        handleClickVariant(`Успешно удален  ${item?.name}`, 'success');
        setList(list.filter(item => item.id !== id)); // Updating state
        closeModal();
        decrement();
    };


    useEffect(() => {
        const fetchList = async () => {
            const querySnapshot = await getDocs(collection(db, 'payment'));
            const fetchedList: DataItem[] = querySnapshot.docs.map(doc => {
                const data = doc.data();
                // Make sure to structure the data according to DataItem interface
                return {
                    id: doc.id,
                    name: data.name,
                    photo: data.photo,
                    time: data.time,
                    bank: data.bank,
                    price: data.price,
                    approved: data.approved,
                } as DataItem;
            });
            setList(fetchedList);
            setTotal(fetchedList.length);
        };
        fetchList();

    }, []);
    const [selectedData, setSelectedImage] = useState<DataItem | undefined>(undefined);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const storage = getStorage();

    async function deleteImageFromStorage(imagePath: string): Promise<void> {
        // Create a reference to the file to delete
        const imageRef = ref(storage, imagePath);
        try {
          // Delete the file
          await deleteObject(imageRef);
          handleClickVariant(`Image at ${imagePath} deleted successfully.`, 'success');
        } catch (error) {
            handleClickVariant(`Error deleting image: ${error}.`, 'error');
          console.error("Error deleting image:", error);
        }
      }
      

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


    const approve = async (id: string| undefined) => {
        if (!id) {
            handleClickVariant('Can\'t update this doc', 'error');
            return
        }
        const docRef = doc(db, 'payment', id);

        try {
            await updateDoc(docRef, {
                approved: true
            })
            const item = list.find((obj) => obj.id === id);
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
            <h1>Заявки на пополнения</h1>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',

            }}>

                <Paper >
                    <List dense component="div" role="list" >

                        {
                            currentItems.map((item) => (
                                <ListItemButton key={item.id} role="listitem" onClick={() => openModal(item)}>
                                    <ListItemIcon>
                                        <Avatar src={item.photo} alt={item.name} sx={{ cursor: 'pointer' }} ></Avatar>
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} secondary={item.bank} sx={{marginInline: '2rem'}} />
                                    <ListItemText primary={"Цена: " + item.price + " сом"} secondary={ item?.approved ? (<Typography  color='success'> подтвержден </Typography>): (<Typography  color='warning'> не подтвержден</Typography>)   }  color='textSecondary' />
                                    
                                </ListItemButton>
                            ))
                        }
                        
                    </List>
                </Paper>

            </Box>
            <Pagination sx={{ display:'flex', justifyContent:'center', marginTop: '1rem' }} count={totalPages} onChange={handlePageChage} color='primary' size='large' />

            <Dialog open={isModalOpen} onClose={closeModal}>
                <DialogTitle>Image Preview</DialogTitle>
                <DialogContent>
                    {(
                        <img src={selectedData?.photo} alt="Large View" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    )}
                </DialogContent>
                <DialogActions >
                    <Button autoFocus onClick={closeModal}> Отмена </Button>
                    {!selectedData?.approved &&  <Button color='success' onClick={()=>approve(selectedData?.id)}> Принять </Button>}
                    {!selectedData?.approved && <Button color='error' onClick={()=> deleteItem(selectedData?.id)} > Отказать и удалить </Button>}
                </DialogActions>
            </Dialog>
        </>
    )
}