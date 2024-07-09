import { DefineComponent, ComponentOptionsMixin, PublicProps, ExtractPropTypes, PropType } from 'vue';
interface Props {
    showIndicator: boolean;
    valueNum: number;
    scale: number;
    ratio: number;
    palette: Object;
    vertical: Boolean;
    start: number;
    width: number;
    height: number;
    selectStart: number;
    selectLength: number;
    startNumX: number;
    endNumX: number;
    startNumY: number;
    endNumY: number;
}
declare const _default: DefineComponent<__VLS_TypePropsToRuntimeProps<Props>, {}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    onAddLine: (...args: any[]) => void;
    "update:showIndicator": (...args: any[]) => void;
    "update:valueNum": (...args: any[]) => void;
}, string, PublicProps, Readonly< ExtractPropTypes<__VLS_TypePropsToRuntimeProps<Props>>> & {
    onOnAddLine?: ((...args: any[]) => any) | undefined;
    "onUpdate:showIndicator"?: ((...args: any[]) => any) | undefined;
    "onUpdate:valueNum"?: ((...args: any[]) => any) | undefined;
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
