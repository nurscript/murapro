import { ChangeEvent, useEffect, useState } from 'react'

import { Avatar, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, List, ListItemButton, ListItemIcon, ListItemText, Pagination, Paper } from "@mui/material";

import { collection, deleteDoc, doc, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '../firebase'
import usePaymentStore from '../store/payment-store'

interface DataItem {
    id: string;
    name: string;
    photo: string;
    time: Timestamp | undefined;
    bank: string;
    price: string;
    approved: boolean;
}


export const PaymentPage = () => {

    const [list, setList] = useState<DataItem[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 6; // Number of items per page

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const currentItems = list.slice(indexOfFirstItem, indexOfLastItem);
    const {setTotal} = usePaymentStore();
    const totalPages = Math.ceil(list.length / itemsPerPage);
    

    const deleteItem = async (id: string) => {
        await deleteDoc(doc(db, 'payment', id)); // Deleting from Firebase
        setList(list.filter(item => item.id !== id)); // Updating state
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

    const declineDelete = (dataDec: string | undefined): void => {
        console.log(`Deletes selected item ${dataDec}`)
    }

    const approve = (dataDec: string| undefined): void => {
        console.log(`Appoved selected item ${dataDec} `)
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
                                    <ListItemText primary={item.name} secondary={item.bank} />
                                    <ListItemText primary={"Цена: " + item.price + " сом"} secondary={item.id} color='textSecondary' />
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
                    <Button autoFocus onClick={closeModal}> Cancel</Button>
                    <Button color='success' onClick={()=>approve(selectedData?.id)}> Принять </Button>
                    <Button color='error' onClick={()=> declineDelete(selectedData?.id)} > Отказать и удалить </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}