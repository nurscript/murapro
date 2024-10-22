import { Outlet, useNavigate } from "react-router-dom";

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeSwitch } from "./ThemeSwitch";
import { AppBar, IconButton, Toolbar, Box, Button, Badge } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import usePaymentStore from './store/payment-store'
const Layout = () => {
    const theme = createTheme({
        colorSchemes: {
            dark: true,
            light: true,
        },
    });
    const {total} = usePaymentStore();
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
                            <IconButton onClick={()=> navigate('/payment')} aria-label={notificationsLabel(total)}>
                                <Badge badgeContent={total} color="secondary" >
                                    <MailIcon color="action" />
                                </Badge>
                            </IconButton>

                            <Button color="inherit" onClick={() => navigate('/')}>Cash out</Button>
                            <Button color="inherit" onClick={() => navigate('/cash')}>Settings</Button>
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