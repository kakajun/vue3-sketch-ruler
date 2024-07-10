import { DefineComponent, ComponentOptionsMixin, PublicProps, ExtractPropTypes, PropType } from 'vue';
interface Props {
    scale: number;
    thick: number;
    palette: {
        lineColor?: string;
    };
    index: number;
    start: number;
    vertical: boolean;
    value: number;
    isShowReferLine: boolean;
}
declare const _default: DefineComponent<__VLS_TypePropsToRuntimeProps<Props>, {}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    onMouseDown: (...args: any[]) => void;
    onRelease: (...args: any[]) => void;
    onRemove: (...args: any[]) => void;
}, string, PublicProps, Readonly< ExtractPropTypes<__VLS_TypePropsToRuntimeProps<Props>>> & {
    onOnMouseDown?: ((...args: any[]) => any) | undefined;
    onOnRelease?: ((...args: any[]) => any) | undefined;
    onOnRemove?: ((...args: any[]) => any) | undefined;
}, {}, {}>;
export default _default;
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToRuntimeProps<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: PropType<T[K]>;
        required: true;
    };
};
