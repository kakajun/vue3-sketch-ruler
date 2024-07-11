import { DefineComponent, PropType, Ref, ComponentOptionsMixin, PublicProps, ExtractPropTypes } from 'vue';
import { PaletteType, ShadowType, lineType } from '../index-types';
declare const _default: __VLS_WithTemplateSlots< DefineComponent<{
    eyeIcon: {
        type: StringConstructor;
    };
    closeEyeIcon: {
        type: StringConstructor;
    };
    scale: {
        type: NumberConstructor;
        default: number;
    };
    ratio: {
        type: NumberConstructor;
    };
    thick: {
        type: NumberConstructor;
        default: number;
    };
    palette: PropType<PaletteType>;
    startX: {
        type: NumberConstructor;
    };
    startY: {
        type: NumberConstructor;
        default: number;
    };
    width: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
    shadow: {
        type: PropType<ShadowType>;
        default: () => {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
    lines: {
        type: PropType<lineType>;
        default: () => {
            h: never[];
            v: never[];
        };
    };
    isShowReferLine: {
        type: BooleanConstructor;
        default: boolean;
    };
    endNumX: {
        type: NumberConstructor;
        default: number;
    };
    endNumY: {
        type: NumberConstructor;
        default: number;
    };
    panzoomOption: ObjectConstructor;
}, {
    initPanzoom: () => void;
    panzoomInstance: Ref<any>;
    reset: () => void;
    zoomIn: () => void;
    zoomOut: () => void;
}, unknown, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {
    onCornerClick: (...args: any[]) => void;
    "update:scale": (...args: any[]) => void;
}, string, PublicProps, Readonly< ExtractPropTypes<{
    eyeIcon: {
        type: StringConstructor;
    };
    closeEyeIcon: {
        type: StringConstructor;
    };
    scale: {
        type: NumberConstructor;
        default: number;
    };
    ratio: {
        type: NumberConstructor;
    };
    thick: {
        type: NumberConstructor;
        default: number;
    };
    palette: PropType<PaletteType>;
    startX: {
        type: NumberConstructor;
    };
    startY: {
        type: NumberConstructor;
        default: number;
    };
    width: {
        type: NumberConstructor;
        default: number;
    };
    height: {
        type: NumberConstructor;
        default: number;
    };
    shadow: {
        type: PropType<ShadowType>;
        default: () => {
            x: number;
            y: number;
            width: number;
            height: number;
        };
    };
    lines: {
        type: PropType<lineType>;
        default: () => {
            h: never[];
            v: never[];
        };
    };
    isShowReferLine: {
        type: BooleanConstructor;
        default: boolean;
    };
    endNumX: {
        type: NumberConstructor;
        default: number;
    };
    endNumY: {
        type: NumberConstructor;
        default: number;
    };
    panzoomOption: ObjectConstructor;
}>> & {
    onOnCornerClick?: ((...args: any[]) => any) | undefined;
    "onUpdate:scale"?: ((...args: any[]) => any) | undefined;
}, {
    scale: number;
    width: number;
    height: number;
    endNumX: number;
    endNumY: number;
    thick: number;
    isShowReferLine: boolean;
    lines: lineType;
    startY: number;
    shadow: ShadowType;
}, {}>, {
    btn?(_: {
        reset: () => void;
        zoomIn: () => void;
        zoomOut: () => void;
    }): any;
    default?(_: {}): any;
}>;
export default _default;
type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
