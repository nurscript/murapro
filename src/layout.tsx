import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeSwitch } from "./ThemeSwitch";
import { AppBar, IconButton, Toolbar, Box, Badge } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import MailOutlineOutlinedIcon from '@mui/icons-material/MailOutlineOutlined';

import PaymentIcon from '@mui/icons-material/Payment';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import usePaymentStore from './store/payment-store'
import { useEffect } from "react";
const Layout = () => {
    const theme = createTheme({
        colorSchemes: {
            dark: true,
        },
    });
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const {totalPayment, totalWithdraw} = usePaymentStore();
    const navigate = useNavigate();
    function notificationsLabel(count: number) {
        if (count === 0) {
            return 'no notifications';
        }
        if (count > 99) {
            return 'more than 99 notifications';
        }
        return `${count} notifications`;
    }
    
    return (
        <>
            <ThemeProvider theme={theme} >
                <CssBaseline />
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Box>
                            <IconButton
                             onClick={()=> navigate('/payment')} aria-label={notificationsLabel(totalPayment)}>
                                <Badge badgeContent={totalPayment} color="secondary" >
                                    <MailOutlineOutlinedIcon color={isActive('/payment') ? 'secondary' : 'action'} />
                                </Badge>
                            </IconButton>
                            <IconButton onClick={()=> navigate('/cash')} aria-label={notificationsLabel(totalWithdraw)}
                                >
                                <Badge badgeContent={totalWithdraw} color="secondary" >
                                    <PaymentIcon color={isActive('/cash') ? 'secondary' : 'action'}/>
                                </Badge>
                            </IconButton>
                            <IconButton onClick={()=> navigate('/')} aria-label={notificationsLabel(0)}
                                color={isActive('/') ? 'secondary' : 'inherit'} >
                                <Badge  color="secondary" >
                                    <HomeOutlinedIcon color={isActive('/') ? 'secondary' : 'action'}/>
                                </Badge>
                            </IconButton>

                            <ThemeSwitch />
                        </Box>
                    </Toolbar>

                </AppBar>
                <main>
                    <Outlet />
                </main>
            </ThemeProvider>
        </>

    )
}
export default Layout;