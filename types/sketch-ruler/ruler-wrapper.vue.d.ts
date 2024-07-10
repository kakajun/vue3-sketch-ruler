import { DefineComponent, PropType, ComponentOptionsMixin, PublicProps, ExtractPropTypes } from 'vue';
declare const _default: DefineComponent<{
    scale: NumberConstructor;
    ratio: NumberConstructor;
    thick: NumberConstructor;
    startNumX: NumberConstructor;
    endNumX: NumberConstructor;
    startNumY: NumberConstructor;
    endNumY: NumberConstructor;
    palette: ObjectConstructor;
    vertical: {
        type: BooleanConstructor;
        default: boolean;
    };
    width: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
    start: {
        type: NumberConstructor;
        default: number;
    };
    lines: {
        type: PropType<number[]>;
        default: () => never[];
    };
    selectStart: {
        type: NumberConstructor;
    };
    selectLength: {
        type: NumberConstructor;
    };
    isShowReferLine: {
        type: BooleanConstructor;
    };
}, {}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    "update:lines": (...args: any[]) => void;
    "on-remove-line": (...args: any[]) => void;
}, string, PublicProps, Readonly< ExtractPropTypes<{
    scale: NumberConstructor;
    ratio: NumberConstructor;
    thick: NumberConstructor;
    startNumX: NumberConstructor;
    endNumX: NumberConstructor;
    startNumY: NumberConstructor;
    endNumY: NumberConstructor;
    palette: ObjectConstructor;
    vertical: {
        type: BooleanConstructor;
        default: boolean;
    };
    width: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
    start: {
        type: NumberConstructor;
        default: number;
    };
    lines: {
        type: PropType<number[]>;
        default: () => never[];
    };
    selectStart: {
        type: NumberConstructor;
    };
    selectLength: {
        type: NumberConstructor;
    };
    isShowReferLine: {
        type: BooleanConstructor;
    };
}>> & {
    "onUpdate:lines"?: ((...args: any[]) => any) | undefined;
    "onOn-remove-line"?: ((...args: any[]) => any) | undefined;
}, {
    width: number;
    height: number;
    vertical: boolean;
    start: number;
    isShowReferLine: boolean;
    lines: number[];
}, {}>;
export default _default;
