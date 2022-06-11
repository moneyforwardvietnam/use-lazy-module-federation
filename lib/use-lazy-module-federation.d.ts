import { FunctionComponent } from "react";
export declare const useLazyModuleFederation: <T = any>({ url, scope, module }: {
    url?: string | undefined;
    scope?: string | undefined;
    module?: string | undefined;
}) => {
    errorLoading: boolean;
    Component: FunctionComponent<T>;
};
