import { SignInPage, type AuthProvider as ToolpadAuthProvider } from '@toolpad/core/SignInPage';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase'
import { useSnackbar, VariantType } from 'notistack';
import { Button } from '@mui/material';
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
    <div>
      <h1>Home Page</h1>
      {user ? (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <Button onClick={logout}> Logout </Button>
        </div>
      ) : (
        <SignInPage signIn={signIn} providers={providers} />
      )}
    </div>
  )
}
