import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';
import './global.css';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LaunchScreen from './src/screens/auth/LaunchScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import SignInScreen from './src/screens/auth/SignInScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import OtpVerificationScreen from './src/screens/auth/OtpVerificationScreen';
import CreateNewPasswordScreen from './src/screens/auth/CreateNewPasswordScreen';
import PasswordResetSuccessScreen from './src/screens/auth/PasswordResetSuccessScreen';
import CameraCaptureScreen from './src/screens/CameraCaptureScreen';
import WalkthroughIntroScreen from './src/screens/walkthrough/WalkthroughIntroScreen';
import WalkthroughStep1Screen from './src/screens/walkthrough/WalkthroughStep1Screen';
import WalkthroughStep1CameraScreen from './src/screens/walkthrough/WalkthroughStep1CameraScreen';
import WalkthroughStep2Screen from './src/screens/walkthrough/WalkthroughStep2Screen';
import WalkthroughStep3Screen from './src/screens/walkthrough/WalkthroughStep3Screen';
import WalkthroughAllDoneScreen from './src/screens/walkthrough/WalkthroughAllDoneScreen';
import NavTabs from './src/navigation/NavTabs';
import StackHeader from './src/navigation/StackHeader';
import { SnackbarProvider } from './src/components/common/SnackbarProvider';

//For testing ChallengeCaptureScreen in isolation without auth flow

import ChallengeCaptureScreen from './src/screens/challenge/ChallengeCaptureScreen';
import ChallengeComparingScreen from './src/screens/challenge/ChallengeComparingScreen';
import ChallengeResultScreen from './src/screens/challenge/ChallengeResultScreen';
import { getStoredObjectsWithImages, pickRandomObject } from './src/storage/objectStorage';
import { compareImages } from './src/utils/vision';


const Stack = createNativeStackNavigator();

function ChallengeCaptureOnly() {
    const [targetObject, setTargetObject] = React.useState(null);
    const [candidate, setCandidate] = React.useState(null);
    const [stage, setStage] = React.useState('capture');
    const [matched, setMatched] = React.useState(false);
    const target = targetObject?.imageUri || null;
    const targetName = targetObject?.objectName || 'Saved object';

    const loadTarget = React.useCallback(async () => {
        const objects = await getStoredObjectsWithImages();
        setTargetObject(pickRandomObject(objects));
    }, []);

    React.useEffect(() => {
        loadTarget();
    }, [loadTarget]);

    const handleCaptured = React.useCallback(async (photoUri) => {
        console.log('Challenge photo captured:', photoUri);
        setCandidate(photoUri);
        setStage('comparing');

        try {
            if (!target) throw new Error('No target photo selected');
            const result = await compareImages(target, photoUri);
            console.log('Challenge comparison result:', result);
            setMatched(result.match);
        } catch (e) {
            console.warn('Challenge comparison failed:', e);
            setMatched(false);
        } finally {
            setStage('result');
        }
    }, [target]);

    const handleTryAgain = React.useCallback(() => {
        setCandidate(null);
        setStage('capture');
    }, []);

    const handleClose = React.useCallback(() => {
        setCandidate(null);
        setStage('capture');
        loadTarget();
    }, [loadTarget]);

    if (stage === 'comparing') {
        return <ChallengeComparingScreen target={target} targetName={targetName} candidate={candidate} />;
    }

    if (stage === 'result') {
        return (
            <ChallengeResultScreen
                matched={matched}
                targetName={targetName}
                onClose={handleClose}
                onTryAgain={handleTryAgain}
                onEmergencyExit={handleClose}
            />
        );
    }

    return (
        <ChallengeCaptureScreen
            target={target}
            targetName={targetName}
            onCaptured={handleCaptured}
            onChangeTarget={loadTarget}
        />
    );
}

function RootNavigator() {
    const { user, loading } = useAuth();

    // Show spinner while checking for existing token on launch
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#1a1a1a" />
            </View>
        );
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <>
                    <Stack.Screen
                        name="Main"
                        component={NavTabs}
                        options={{ headerShown: true, header: () => <StackHeader /> }}
                    />
                    {/* Detail / full-screen pages go here.
                    Build the screen (content only), then add a line below with name + title.
                    Example:
                    {/* <Stack.Screen name="ChangeUserName" component={ChangeUserName} options={{ headerShown: true, title: 'Change User Name' }} /> */}
                    <Stack.Screen name="CameraCapture" component={CameraCaptureScreen} />
                    {/* Walkthrough flow — shown to first-time users after login */}
                    <Stack.Screen name="WalkthroughIntro" component={WalkthroughIntroScreen} />
                    <Stack.Screen name="WalkthroughStep1" component={WalkthroughStep1Screen} />
                    <Stack.Screen name="WalkthroughStep1Camera" component={WalkthroughStep1CameraScreen} />
                    <Stack.Screen name="WalkthroughStep2" component={WalkthroughStep2Screen} />
                    <Stack.Screen name="WalkthroughStep3" component={WalkthroughStep3Screen} />
                    <Stack.Screen name="WalkthroughAllDone" component={WalkthroughAllDoneScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="Launch" component={LaunchScreen} />
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
                    <Stack.Screen name="CreateNewPassword" component={CreateNewPasswordScreen} />
                    <Stack.Screen name="PasswordResetSuccess" component={PasswordResetSuccessScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

//Root component — wraps app with AuthContext and Navigation
export default function App() {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <NavigationContainer>
                    <SnackbarProvider>
                        <RootNavigator />
                    </SnackbarProvider>
                </NavigationContainer>
            </AuthProvider>
        </SafeAreaProvider>
    );
}



// For testing ChallengeCaptureScreen in isolation without auth flow
// comment out the above App component and uncomment the below to test ChallengeCaptureScreen without going through auth flow. Remember to switch back before final testing and submission.
// export default function App() {
//     return (
//         <NavigationContainer>
//             <Stack.Navigator screenOptions={{ headerShown: false }}>
//                 <Stack.Screen name="ChallengeCapture" component={ChallengeCaptureOnly} />
//             </Stack.Navigator>
//         </NavigationContainer>
//     );
// }
