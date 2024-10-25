import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';

export const HomePage = () => {
    const providers : AuthProvider[] = [
        { id: 'github', name: 'GitHub' },
        { id: 'google', name: 'Google' },
        { id: 'facebook', name: 'Facebook' },
        { id: 'twitter', name: 'Twitter' },
        { id: 'linkedin', name: 'LinkedIn' },
      ];

      const signIn: (provider: AuthProvider) => void = async (provider) => {
        const promise = new Promise<void>((resolve) => {
          setTimeout(() => {
            console.log(`Sign in with ${provider.id}`);
            resolve();
          }, 500);
        });
        return promise;
      };

    return (
    <div>
        <h1> 
            Home page
        </h1>
        <SignInPage signIn={signIn} providers={providers}  />
        
    </div>
)}
