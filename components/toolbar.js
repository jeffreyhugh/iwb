import { Rnd } from "react-rnd"

export const ToolBarWrapper = ({ default: d, enableResizing, lockAspectRatio, minWidth, minHeight, className, id, children }) => (
    <Rnd
        id={id}
        default={d}
        enableResizing={enableResizing}
        lockAspectRatio={lockAspectRatio}
        resizeGrid={[32, 32]}
        minHeight={minHeight}
        minWidth={minWidth}
        className={`absolute bg-slate-400 rounded overflow-hidden drop-shadow-2xl h-auto w-auto ${className}`}
    >
        {children}
    </Rnd>
)

export const ToolBar = ({ children, className }) => (
    <div className={`flex flex-wrap text-black ${className}`}>
        {children}
    </div>
)

export const Tool = ({ className, style, onClick, icon, title }) => (
    <div className={`w-8 h-8 rounded flex justify-center items-center ${className}`} title={title}>
        <i className={`fa fa-fw fa-${icon} cursor-pointer`} onClick={onClick} style={style} />
    </div>
)

export const Color = ({ className, style, onClick, color }) => (
    <div className={`w-8 h-8 rounded flex justify-center items-center ${className}`}>
        <i className={`fa fa-fw fa-circle cursor-pointer`} onClick={onClick} style={{ ...style, color }} />
    </div>
)
