import { useTheme } from 'next-themes'
import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import { SketchField, Tools } from '../react-sketch'
import { ToolBarWrapper, ToolBar, Tool, Color } from '../components/toolbar'
import tools from '../react-sketch/tools'
import { GlobalHotKeys } from 'react-hotkeys'
import { DateTime } from "luxon";

import { GA_TRACKING_ID } from '../lib/gtag'

const Index = () => {

    const SSR = typeof window === 'undefined'

    const nop = () => { }

    const BORDER = 16

    const { theme, setTheme } = useTheme()
    const [tool, setTool] = useState(Tools.Pencil)
    const [colors, setColors] = useState([
        '#000001', // black
        '#fe0000', // red
        '#00fe00', // green
        '#0000fe', // blue
        '#fffffe', // white
        // reds
        '#ff8585',
        '#ff4747',
        '#ff0000',
        '#cc0000',
        '#8f0000',
        // oranges
        '#ffd458',
        '#ffbf47',
        '#ffa500',
        '#cc8500',
        '#8f5d00',
        // yellows
        '#ffff85',
        '#ffff47',
        '#ffff00',
        '#cccc00',
        '#8f8f00',
        // greens
        '#85ff85',
        '#47ff47',
        '#00ff00',
        '#00cc00',
        '#008f00',
        // blues
        '#8585ff',
        '#4747ff',
        '#0000ff',
        '#0000cc',
        '#00008f',
        // purples
        '#ff85ff',
        '#ff47ff',
        '#ff0aff',
        '#cc00cc',
        '#800080',
    ])
    const [color, setColor] = useState(0)
    const [lineThickness, setLineThickness] = useState(2)

    const [zenMode, setZenMode] = useState(false)

    const sketchContainer = useRef(null)

    useEffect(() => {
        !SSR ? window.onbeforeunload = (e) => (
            "Are you sure you want to exit? Your work will be lost."
        ) : nop()
    })

    const exportImage = () => {
        const dataURL = sketchContainer.current.toDataURL()
        const url = dataURL.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
        var link = document.createElement('a');
        link.setAttribute("download", `iwb-${DateTime.now().toFormat("yyyy-LL-dd-HH-mm-ss")}.png`);
        link.setAttribute("href", url);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(document.body.lastChild);
    }

    const keyMap = {
        TOOL_BRUSH: 'b',
        TOOL_TEXT: 't',
        TOOL_PAN: 'v',
        TOOL_SELECT: 's',
        TOOL_REMOVE: 'r',
        TOOL_EXPORT: 'e',
        CLEAR: 'c',
        LINE_THIN: '1',
        LINE_REGULAR: '2',
        LINE_THICC: '3',
        LINE_CHONKY: '4',
        UNDO: ['ctrl+z', 'command+z'],
        REDO: ['ctrl+shift+z', 'command+shift+z', 'ctrl+y', 'command+y'],
        ZOOM_OUT: ['-', 'ctrl+-', 'command+-'],
        ZOOM_IN: ['=', 'ctrl+=', 'command+='],
        TOGGLE_DARK: ['d'],
        DELETE_SELECTION: ['del', 'backspace'],
        COLOR_RIGHT: ['right'],
        COLOR_LEFT: ['left'],
        COLOR_UP: ['up'],
        COLOR_DOWN: ['down'],
        TOGGLE_ZEN: ['z'],
        ZEN_OFF: ['esc'],
    }

    const handlers = {
        TOOL_BRUSH: () => setTool(tools.Pencil),
        TOOL_TEXT: () => setTool(tools.Text),
        TOOL_PAN: () => setTool(tools.Pan),
        TOOL_SELECT: () => setTool(tools.Select),
        TOOL_REMOVE: () => setTool(tools.Remove),
        TOOL_EXPORT: exportImage,
        CLEAR: () => { confirm("Are you sure you want to clear the whiteboard?") && sketchContainer.current?.clear();},
        LINE_THIN: () => setLineThickness(2),
        LINE_REGULAR: () => setLineThickness(4),
        LINE_THICC: () => setLineThickness(10),
        LINE_CHONKY: () => setLineThickness(20),
        UNDO: () => {
            const prevDrawingMode = sketchContainer.current._fc.isDrawingMode;
            sketchContainer.current._fc.isDrawingMode = false;
            sketchContainer.current.undo();
            sketchContainer.current._fc.renderAll();
            sketchContainer.current._fc.isDrawingMode = prevDrawingMode;
        },
        REDO: () => {
            const prevDrawingMode = sketchContainer.current._fc.isDrawingMode;
            sketchContainer.current._fc.isDrawingMode = false;
            sketchContainer.current.redo();
            sketchContainer.current._fc.renderAll();
            sketchContainer.current._fc.isDrawingMode = prevDrawingMode;
        },
        ZOOM_OUT: () => {
            const prevDrawingMode = sketchContainer.current._fc.isDrawingMode;
            sketchContainer.current._fc.isDrawingMode = false;
            sketchContainer.current.zoom(0.8);
            sketchContainer.current._fc.renderAll();
            sketchContainer.current._fc.isDrawingMode = prevDrawingMode;
        },
        ZOOM_IN: () => {
            const prevDrawingMode = sketchContainer.current._fc.isDrawingMode;
            sketchContainer.current._fc.isDrawingMode = false;
            sketchContainer.current.zoom(1.25);
            sketchContainer.current._fc.renderAll();
            sketchContainer.current._fc.isDrawingMode = prevDrawingMode;
        },
        TOGGLE_DARK: () => setTheme(theme => theme === 'dark' ? 'light' : 'dark'),
        DELETE_SELECTION: () => sketchContainer.current?.removeSelected(),
        COLOR_RIGHT: () => setColor(c => {
            setTool(tools.Pencil)
            const row = Math.floor(c / 5)
            const col = c % 5
            return (col + 1) % 5 + row * 5
        }),
        COLOR_LEFT: () => setColor(c => {
            setTool(tools.Pencil)
            const row = Math.floor(c / 5)
            const col = c % 5
            return col === 0 ? (row * 5) + 4 : (col - 1) + row * 5
        }),
        COLOR_UP: () => setColor(c => {
            setTool(tools.Pencil)
            const row = Math.floor(c / 5)
            const col = c % 5
            const totalRows = Math.floor(colors.length / 5)
            return row === 0 ? (totalRows - 1) * 5 + col : (row - 1) * 5 + col
        }),
        COLOR_DOWN: () => setColor(c => {
            setTool(tools.Pencil)
            const row = Math.floor(c / 5)
            const col = c % 5
            const totalRows = Math.floor(colors.length / 5)
            return ((row + 1) % totalRows) * 5 + col
        }),
        TOGGLE_ZEN: () => setZenMode(z => !z),
        ZEN_OFF: () => setZenMode(false),
    }

    return (
        <div>
            <Head>
                <title>iwb | infinite whiteboard</title>
                <meta name="og:title" content={"iwb.app"} />
                <meta name="og:description" content={"infinite whiteboard"} />
                <meta name="og:type" content={"website"} />
                <meta name="og:url" content={"https://iwb.app"} />
                <meta name="theme-color" content={"#475569"} />
                <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`} />
                <script dangerouslySetInnerHTML={{
                    __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', '${GA_TRACKING_ID}', {
                            page_path: window.location.pathname,

                            cookie_flags: 'SameSite=None;Secure',
                        });
                    `
                }}
                />
            </Head>
            <GlobalHotKeys keyMap={keyMap} handlers={handlers} />
            <div id="dark-mode-toggle" className={theme === 'dark' ? 'dark' : ''}>
                { /* WHITEBOARD */}
                <div className={"w-full h-screen -z-10 absolute"}>
                    {!SSR ?
                        <SketchField
                            ref={sketchContainer}
                            tool={tool}
                            lineColor={colors[color]}
                            lineWidth={lineThickness}
                            undoSteps={20}
                            height={window.innerHeight}
                            onSelectionCreated={nop}
                            onSelectionUpdated={nop}
                            backgroundColor={theme === 'dark' ? '#000001' : '#fffffe'}
                        /> : <></>
                    }
                </div>

                { /* CONTROLS */}
                {!SSR && !zenMode && sketchContainer.current !== null ?
                    <>
                        { /* dark and zen mode */}
                        <ToolBarWrapper
                            default={{
                                x: window.innerWidth - 32 - BORDER,
                                y: BORDER,
                                width: 32,
                                height: 'auto',
                            }}
                            lockAspectRatio={false}
                            minHeight={32}
                            minWidth={32}
                        >
                            <ToolBar>
                                <Tool
                                    icon="moon"
                                    onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
                                    title="Toggle dark mode (d)"
                                />
                                <Tool
                                    icon="cloud"
                                    onClick={() => setZenMode(z => !z)}
                                    title="Toggle zen mode (z)"
                                />
                            </ToolBar>
                        </ToolBarWrapper>

                        { /* main toolbar */}
                        <ToolBarWrapper
                            default={{
                                x: window.innerWidth - BORDER - 32,
                                y: BORDER + 32 + 32 + BORDER,
                                height: 'auto',
                                width: 32,
                            }}
                            lockAspectRatio={false}
                            minHeight={32}
                            minWidth={32}
                        >
                            <ToolBar>
                                <Tool
                                    icon="paint-brush"
                                    onClick={() => setTool(Tools.Pencil)}
                                    selected={tool === Tools.Pencil}
                                    title="Brush (b)"
                                />
                                <Tool
                                    icon="i-cursor"
                                    onClick={() => setTool(Tools.Text)}
                                    selected={tool === Tools.Text}
                                    title="Text (t)"
                                />
                                <Tool
                                    icon="arrows"
                                    onClick={() => setTool(Tools.Pan)}
                                    selected={tool === Tools.Pan}
                                    title="Move (v)"
                                />
                                <Tool
                                    icon="hand-pointer-o"
                                    onClick={() => setTool(Tools.Select)}
                                    selected={tool === Tools.Select}
                                    title="Select (s)"
                                />
                                <Tool
                                    icon="trash"
                                    onClick={() => setTool(Tools.Remove)}
                                    selected={tool === Tools.Remove}
                                    title="Remove (r)"
                                />
                                <Tool
                                    icon="image"
                                    onClick={exportImage}
                                    title="Export (e)"
                                />
                                <Tool
                                    icon="bomb"
                                    className={"text-red-600"}
                                    onClick={() => { confirm("Are you sure you want to clear the whiteboard?") && sketchContainer.current.clear() }}
                                    title="Clear (c)"
                                />
                                <Tool
                                    icon="circle"
                                    style={{ fontSize: '0.8rem' }}
                                    onClick={() => setLineThickness(2)}
                                    selected={lineThickness === 2}
                                    title="Thin (1)"
                                />
                                <Tool
                                    icon="circle"
                                    style={{ fontSize: '1.1rem' }}
                                    onClick={() => setLineThickness(4)}
                                    selected={lineThickness === 4}
                                    title="Regular (2)"
                                />
                                <Tool
                                    icon="circle"
                                    style={{ fontSize: '1.4rem' }}
                                    onClick={() => setLineThickness(10)}
                                    selected={lineThickness === 10}
                                    title="Thicc (3)"
                                />
                                <Tool
                                    icon="circle"
                                    style={{ fontSize: '1.75rem' }}
                                    onClick={() => setLineThickness(20)}
                                    selected={lineThickness === 20}
                                    title="Chonky (4)"
                                />
                            </ToolBar>
                        </ToolBarWrapper>

                        { /* colors */}
                        <ToolBarWrapper
                            default={{
                                x: window.innerWidth - BORDER - 32 - BORDER - 5 * 32,
                                y: BORDER,
                                height: 32,
                                width: 5 * 32,
                            }}
                            lockAspectRatio={false}
                            minHeight={32}
                            minWidth={32}
                            maxHeight={7 * 32}
                            enableResizing={{
                                // only allow resizing on the top and bottom
                                top: true,
                                bottom: true,
                                left: false,
                                right: false,
                                topLeft: false,
                                topRight: false,
                                bottomLeft: false,
                                bottomRight: false,
                            }}
                        >
                            <ToolBar>
                                {colors.map(c => (
                                    <Color
                                        key={c}
                                        color={c}
                                        onClick={() => {
                                            setColor(colors.indexOf(c))
                                            setTool(Tools.Pencil)
                                        }}
                                        selected={colors[color] === c}
                                    />
                                ))}
                            </ToolBar>
                        </ToolBarWrapper>

                        { /* undo, redo, zoom */}
                        <ToolBarWrapper
                            default={{
                                x: window.innerWidth - BORDER - 4 * 32,
                                y: window.innerHeight - BORDER - 32,
                                height: 32,
                                width: 4 * 32,
                            }}
                            lockAspectRatio={false}
                            minHeight={32}
                            minWidth={32}
                        >
                            <ToolBar>
                                <Tool
                                    icon="undo"
                                    onClick={() => {
                                        try { handlers.UNDO() }
                                        catch (e) { }
                                    }}
                                    title="Undo"
                                />
                                <Tool
                                    icon="undo fa-flip-horizontal"
                                    onClick={() => {
                                        try { handlers.REDO() }
                                        catch (e) { }
                                    }}
                                    title="Redo"
                                />
                                <Tool
                                    icon="search-plus"
                                    onClick={() => handlers.ZOOM_IN()}
                                    title="Zoom In"
                                />
                                <Tool
                                    icon="search-minus"
                                    onClick={() => handlers.ZOOM_OUT()}
                                    title="Zoom Out"
                                />
                            </ToolBar>
                        </ToolBarWrapper>

                        { /* info */}
                        <ToolBarWrapper
                            default={{
                                x: BORDER,
                                y: BORDER,
                                height: 'auto',
                                width: 8 * 32,
                            }}
                            lockAspectRatio={false}
                            minHeight={32}
                            minWidth={32}
                        >
                            <div className={"p-8 flex flex-col text-black dark:text-white"}>
                                <div className={"text-5xl self-center"}><span className={"font-semibold"}>iwb</span>.app</div>
                                <div className={"self-center"}>infinite whiteboard</div>
                                <div className={"p-4"} />
                                <div>Just start drawing! Tools are on the right, colors are on the top.</div>
                                <div className={"p-4"} />
                                <div>Every pane is draggable and most are resizable.</div>
                                <div className={"p-4"} />
                                <div><code>d</code> - toggle <span className={"font-bold"}>d</span>ark mode</div>
                                <div><code>z</code> - toggle <span className={"font-bold"}>z</span>en mode</div>
                                <div><code>b</code> - paint<span className={"font-bold"}>b</span>rush</div>
                                <div><code>t</code> - <span className={"font-bold"}>t</span>ext</div>
                                <div><code>v</code> - mo<span className={"font-bold"}>v</span>e</div>
                                <div><code>s</code> - <span className={"font-bold"}>s</span>elect</div>
                                <div><code>r</code> - <span className={"font-bold"}>r</span>emove</div>
                                <div><code>e</code> - <span className={"font-bold"}>e</span>xport</div>
                                <div><code>c</code> - <span className={"font-bold"}>c</span>lear</div>
                                <div><code>1-4</code> - line thickness</div>
                                <div>arrow keys - color</div>
                                <div className={"p-4"} />
                                <div>See it on <a href="https://github.com/qbxt/iwb" target="_blank" rel="noreferrer" className={"underline"}>GitHub</a>.</div>
                                {/* <div><code>ctrl+z</code> - undo</div>
                                <div><code>ctrl+y</code> - redo</div>
                                <div><code>-</code> - zoom out</div>
                                <div><code>=</code> - zoom in</div> */}

                            </div>
                        </ToolBarWrapper>

                    </> : null}

                {/* zen mode */}
                {!SSR && zenMode ?
                    <>
                        <ToolBarWrapper
                            default={{
                                x: window.innerWidth - BORDER - 3 * 32,
                                y: BORDER,
                                height: 'auto',
                                width: 3 * 32,
                            }}
                            lockAspectRatio={false}
                            minHeight={32}
                            minWidth={32}
                        >
                            <ToolBar>
                                <Tool
                                    icon="paint-brush"
                                    className={`${tool === Tools.Pencil ? '' : 'hidden'}`}
                                    title="Brush"
                                />
                                <Tool
                                    icon="i-cursor"
                                    className={`${tool === Tools.Text ? '' : 'hidden'}`}
                                    title="Text"
                                />
                                <Tool
                                    icon="arrows"
                                    className={`${tool === Tools.Pan ? '' : 'hidden'}`}
                                    title="Move"
                                />
                                <Tool
                                    icon="hand-pointer-o"
                                    className={`${tool === Tools.Select ? '' : 'hidden'}`}
                                    title="Select"
                                />
                                <Tool
                                    icon="trash"
                                    className={`${tool === Tools.Remove ? '' : 'hidden'}`}
                                    title="Remove"
                                />
                                {colors.map(c => (
                                    <Color
                                        key={c}
                                        color={c}
                                        className={`${colors[color] === c ? '' : 'hidden'}`}
                                    />
                                ))}
                                <Tool
                                    icon="cloud"
                                    onClick={() => setZenMode(z => !z)}
                                    title="Toggle zen mode (z)"
                                />
                            </ToolBar>
                        </ToolBarWrapper>
                    </> : <></>}
            </div>
        </div>
    )
}

export default Index
