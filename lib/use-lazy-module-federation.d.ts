import { FunctionComponent } from 'react';
export declare type RemoteModuleProps = {
    url: string;
    scope: string;
    module: string;
};
export declare const useLazyModuleFederation: <T = any>({ url, scope, module, }: RemoteModuleProps) => {
    errorLoading: boolean;
    Component: FunctionComponent<T>;
};
