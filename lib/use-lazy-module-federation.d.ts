export declare type useLazyModuleFederationProps<T = any> = (params: {
    url?: string;
    scope?: string;
    module?: string;
}) => ({
    errorLoading: boolean;
    Component: T;
});
export declare const useLazyModuleFederation: useLazyModuleFederationProps;
