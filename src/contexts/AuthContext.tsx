import { createContext, ReactNode, useEffect, useState } from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
    name: string;
    avatarUrl: string;
}

export interface AuthContextDataProps {
    user: UserProps;
    signIn: () => Promise<void>;
    isUserLoading: boolean;
}

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
    const [user,setUser] = useState<UserProps>({} as UserProps)
    const [isUserLoading, setIsUserLoading] = useState<boolean>(false);

    const [rquest, response, promptAsync] = Google.useAuthRequest({
        clientId: '' ,//PEGAR do notas
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ['profile', 'email']
    })

    async function signIn() {
        try {
            setIsUserLoading(true);
            await promptAsync();
        } catch (e) {
            console.log(e);
            throw e;
        } finally {
            setIsUserLoading(false);
        }
    }

    async function signInWithGoogle(accessToken: string){
        console.log('Tokem ===>',accessToken)
    }

    useEffect(() => {
        if(response?.type === 'success' && response.authentication?.accessToken) {
            signInWithGoogle(response.authentication.accessToken);
        }
    },[response])

    return (
        <AuthContext.Provider value={
            {
                signIn,
                user,
                isUserLoading
            }}>
            {children}
        </AuthContext.Provider>
    )
}
