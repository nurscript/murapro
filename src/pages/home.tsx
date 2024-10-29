import { SignInPage, type AuthProvider as ToolpadAuthProvider } from '@toolpad/core/SignInPage';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase'
import { useSnackbar, VariantType } from 'notistack';
import { Avatar, Box, Button, Card, Typography } from '@mui/material';
import { useAuthStore } from '../store/auth-store';


export const HomePage = () => {

  const { user, logout } = useAuthStore();
  
  const { enqueueSnackbar } = useSnackbar();

  function handleClickVariant(message: string, variant: VariantType) {
    // variant could be success, error, warning, info, or default
    enqueueSnackbar(message, { variant });
  };


  const providers: ToolpadAuthProvider[] = [
    { id: 'github', name: 'GitHub' },
    { id: 'google', name: 'Google' },
    { id: 'facebook', name: 'Facebook' },
    { id: 'twitter', name: 'Twitter' },
  ];

  const signIn: (provider: ToolpadAuthProvider) => void = async (provider_toolpad) => {
    if (provider_toolpad.id == 'google') {
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log(`Logged in with ${user.displayName}`)
        handleClickVariant(`Welcome back ${user.displayName}.`, 'success');
      } catch (error) {
        console.log(error);
        handleClickVariant(`Error logging in: ${error}.`, 'error');
      }
    }


  };

  return (
    <Box sx={{display:'flex', flexDirection:'column' ,alignItems:'center', justifyContent:'center', minHeight:'70vh'}}>
      <h1 >Home Page</h1>
      {user ? (
        <Card sx={{margin:'1rem', padding:'0.5rem'}}>
          <p>Welcome, {user.displayName}!</p>
          <p>uid: {user.uid}!</p>
          <p>email: {user.email}!</p>
          <p>verified: {user.emailVerified? <Typography color='success'> YEs</Typography> : <Typography color='warning'>No</Typography>}</p>
          {user?.photoURL && (<Avatar src={user?.photoURL}> </Avatar>)}
          {user.phoneNumber && (<p>Phone: {user.phoneNumber}</p>)}

          <Button onClick={logout}> Logout </Button>
        </Card>
      ) : (
        <SignInPage signIn={signIn} providers={providers} />
      )}
    </Box>
  )
}
