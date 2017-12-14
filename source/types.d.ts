export default class Unity extends React.Component<UnityProps, UnityState> { }

export function SendMessage (
    gameObjectName: string, 
    methodName: string, 
    paramterValue?: any
): void;

export function RegisterExternalListener (
    functionName: string, 
    callback: (e: any) => void 
): void;

interface UnityProps {
    src: string;
    loader: string;
    onProgress?: (progression: number) => void;
    width?: number;
    height?: number;
    module?: Module;
}

interface UnityState {
    error?: string;
}

interface Module {
    [x: string]: any;
    preRun: any[];
    postRun: any[];
    print: (e: any) => void;
    printErr: (e: any) => void;
    Jobs: {
        [x: string]: any;
    };
    buildDownloadProgress: {
        [x: string]: any;
    };
    resolveBuildUrl: (e: any) => any;
}