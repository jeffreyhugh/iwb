import { Rnd } from "react-rnd"

export const ToolBarWrapper = ({ default: d, enableResizing, lockAspectRatio, minWidth, minHeight, maxWidth, maxHeight, className, id, children }) => (
    <Rnd
        id={id}
        default={d}
        enableResizing={enableResizing}
        lockAspectRatio={lockAspectRatio}
        resizeGrid={[32, 32]}
        minHeight={minHeight}
        minWidth={minWidth}
        maxHeight={maxHeight}
        maxWidth={maxWidth}
        cancel=".cancel"
        className={`absolute backdrop-blur-sm ring-1 ring-gray-500 rounded overflow-hidden h-auto w-auto ${className}`}
    >
        {children}
    </Rnd>
)

export const ToolBar = ({ children, className }) => (
    <div className={`flex flex-wrap text-black dark:text-white ${className}`}>
        {children}
    </div>
)

export const Tool = ({ className, style, onClick, icon, title, selected }) => (
    <div className={`w-8 h-8 rounded flex justify-center items-center ring-gray-500 ring-inset ${selected ? 'ring-1' : 'ring-0'} ${className}`} title={title}>
        <button className={"cancel"} onClick={onClick}>
            <i className={`fa fa-fw fa-${icon} cursor-pointer`} style={style} />
        </button>
    </div>
)

export const Color = ({ className, style, onClick, color, selected }) => (
    <div className={`w-8 h-8 rounded flex justify-center items-center ring-gray-500 ring-inset ${selected ? 'ring-1' : 'ring-0'} ${className}`}>
        <button className={"cancel"} onClick={onClick}>
            <i className={`fa fa-fw fa-circle cursor-pointer`} onClick={onClick} style={{ ...style, color }} />
        </button>
    </div>
)
