export const tableStyles = {
    root: 'w-full overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm',
    header: 'sticky top-0 z-10 bg-white border-b border-gray-200',
    headerRow: 'border-b border-gray-200',
    th: 'px-3 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-b border-gray-200',
    thSortable: 'px-3 py-3 text-left text-sm font-semibold text-gray-900 bg-gray-50 border-b border-gray-200 cursor-pointer hover:bg-gray-100 select-none transition-colors',
    td: 'px-3 py-3 text-sm text-gray-900 border-b border-gray-100 last:border-b-0 bg-white',
    row: 'bg-white hover:bg-gray-50 data-[selected=true]:bg-blue-50 transition-colors duration-150',
    rowExpanded: 'bg-blue-25 hover:bg-blue-50 data-[selected=true]:bg-blue-100 transition-colors duration-150',
    rowChild: 'bg-gray-25 hover:bg-gray-50 data-[selected=true]:bg-blue-75',
    checkbox: 'size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2 focus:ring-offset-0 bg-white',
    sortIcon: 'w-4 h-4 text-gray-400 ml-1 transition-colors',
    expandIcon: 'w-4 h-4 text-gray-500 cursor-pointer hover:text-gray-700',
    indentLevel1: 'pl-8',
    indentLevel2: 'pl-12',
    indentLevel3: 'pl-16'
} as const;

export const toolbarStyles = {
    root: 'flex flex-col xl:flex-row xl:items-center gap-4 p-4 border-b border-gray-200 bg-white',
    searchContainer: 'flex-1 min-w-0 max-w-lg xl:max-w-md xl:flex-shrink-0',
    searchInput: 'block w-full rounded-lg border-0 bg-gray-50 px-3 py-2.5 text-sm placeholder-gray-500 transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500',
    filtersContainer: 'flex flex-wrap items-center gap-2',
    filterSelect: 'rounded-lg border-0 bg-gray-50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500',
    filterChip: 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800',
    filterChipRemove: 'w-3 h-3 text-blue-600 hover:text-blue-800 cursor-pointer',
    actionsContainer: 'flex items-center gap-3 xl:ml-auto xl:flex-shrink-0',
    button: 'inline-flex items-center gap-2 px-3 py-2.5 border-0 text-sm font-medium rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap',
    buttonPrimary: 'inline-flex items-center gap-2 px-3 py-2.5 border-0 text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap',
    buttonDanger: 'inline-flex items-center gap-2 px-3 py-2.5 border-0 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap',
    toggleButton: 'inline-flex items-center gap-2 px-3 py-2.5 border-0 text-sm font-medium rounded-lg text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[active=true]:bg-yellow-50 data-[active=true]:text-yellow-700 transition-colors whitespace-nowrap'
} as const;

export const badgeStyles = {
    base: 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
    status: {
        Active: 'bg-green-100 text-green-800',
        Inactive: 'bg-gray-100 text-gray-800'
    },
    type: {
        Natural: 'bg-emerald-100 text-emerald-800',
        Synthetic: 'bg-blue-100 text-blue-800'
    },
    stockLevel: {
        High: 'bg-green-100 text-green-800',
        Medium: 'bg-yellow-100 text-yellow-800',
        Low: 'bg-orange-100 text-orange-800',
        OutOfStock: 'bg-red-100 text-red-800'
    }
} as const;

export const statsStyles = {
    container: 'grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-white border-b border-gray-200',
    stat: 'text-center',
    statValue: 'block text-2xl font-bold text-gray-900',
    statLabel: 'block text-sm text-gray-600 mt-1'
} as const;

export const modalStyles = {
    overlay: 'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    content: 'fixed left-[50%] top-[50%] z-50 flex flex-col w-full max-w-2xl max-h-[90vh] translate-x-[-50%] translate-y-[-50%] border border-gray-200 bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full',
    header: 'flex flex-col space-y-1.5 text-center sm:text-left flex-shrink-0',
    title: 'text-lg font-semibold leading-none tracking-tight text-gray-900',
    description: 'text-sm text-gray-600',
    body: 'flex-1 overflow-auto min-h-0 py-4',
    footer: 'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 flex-shrink-0 pt-4 border-t border-gray-200',
    closeButton: 'absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100'
} as const;

export const dropdownStyles = {
    trigger: 'inline-flex items-center justify-between gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 border-0 bg-gray-50 hover:bg-gray-100 px-3 py-2.5 min-w-[120px]',
    content: 'z-50 min-w-[8rem] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
    item: 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100',
    itemDestructive: 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-red-100 focus:text-red-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 text-red-600 hover:bg-red-100 hover:text-red-900',
    separator: 'my-1 h-px bg-gray-200'
} as const;

export const paginationStyles = {
    container: 'flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200',
    info: 'text-sm text-gray-700',
    controls: 'flex items-center gap-2',
    select: 'rounded border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500',
    button: 'relative inline-flex items-center px-2 py-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed',
    buttonActive: 'relative inline-flex items-center px-2 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-300 rounded hover:bg-blue-100 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
} as const;

export const emptyStateStyles = {
    container: 'flex flex-col items-center justify-center py-12 px-4',
    icon: 'w-12 h-12 text-gray-400 mb-4',
    title: 'text-lg font-medium text-gray-900 mb-2',
    description: 'text-gray-600 text-center max-w-md'
} as const;

export const loadingStyles = {
    container: 'flex items-center justify-center py-12',
    spinner: 'animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'
} as const;

export const errorStyles = {
    container: 'flex flex-col items-center justify-center py-12 px-4',
    icon: 'w-12 h-12 text-red-400 mb-4',
    title: 'text-lg font-medium text-gray-900 mb-2',
    description: 'text-gray-600 text-center max-w-md mb-4',
    button: 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
} as const;

export const focusStyles = {
    ring: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    ringWhite: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-white',
    ringInset: 'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500'
} as const;

export const mobileStyles = {
    drawer: {
        overlay: 'fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 md:hidden',
        content: 'fixed bottom-0 left-0 right-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border border-gray-200 bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom md:hidden',
        header: 'flex items-center justify-between p-4 border-b border-gray-200',
        title: 'text-lg font-semibold text-gray-900',
        body: 'flex-1 overflow-auto p-4'
    },
    hiddenOnDesktop: 'md:hidden',
    hiddenOnMobile: 'hidden md:block'
} as const;

export const filterChipStyles = {
    container: 'flex flex-wrap items-center gap-2',
    chip: 'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200',
    chipRemove: 'w-3 h-3 text-blue-600 hover:text-blue-800 cursor-pointer ml-1 rounded-full hover:bg-blue-200 transition-colors',
    chipText: 'max-w-[120px] truncate'
} as const;

export const multiselectStyles = {
    trigger: 'inline-flex items-center justify-between gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 border-0 bg-gray-50 hover:bg-gray-100 px-3 py-2.5 min-w-[120px]',
    content: 'z-50 min-w-[200px] max-w-[300px] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    searchContainer: 'p-2 border-b border-gray-200',
    searchInput: 'w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    optionsList: 'max-h-60 overflow-y-auto',
    option: 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100',
    optionCheckbox: 'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500',
    summary: 'p-2 border-t border-gray-200 text-xs text-gray-500'
} as const;

export const groupHeaderStyles = {
    container: 'sticky top-0 z-10 bg-gray-100 border-b border-gray-200',
    row: 'bg-gray-100 hover:bg-gray-200 transition-colors',
    cell: 'px-3 py-2 text-sm font-semibold text-gray-900 bg-gray-100',
    expandButton: 'inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 font-medium',
    expandIcon: 'w-4 h-4 transition-transform',
    badge: 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-700 ml-2',
    aggregates: 'flex items-center gap-3 text-xs text-gray-600'
} as const;

export const columnManagerStyles = {
    dragHandle: 'w-6 text-center text-gray-400 cursor-move',
    dragHandleFixed: 'w-6 text-center text-gray-300',
    columnItem: 'flex items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors',
    columnItemDragging: 'opacity-50',
    columnItemDragOver: 'bg-blue-50 border-blue-300',
    columnName: 'flex-1 min-w-0 text-sm font-medium text-gray-900',
    columnFixed: 'ml-2 text-xs text-gray-500',
    widthInput: 'w-16 px-2 py-1 text-xs border border-gray-300 rounded focus:border-blue-500 focus:ring-blue-500',
    widthLabel: 'text-xs text-gray-500',
    preview: 'p-4 bg-gray-50 border border-gray-200 rounded-lg',
    previewTitle: 'text-sm font-medium text-gray-900 mb-2',
    previewColumns: 'flex gap-1 overflow-x-auto',
    previewColumn: 'flex-shrink-0 bg-white border border-gray-300 rounded px-2 py-1 text-xs'
} as const;

export const savedViewStyles = {
    trigger: 'inline-flex items-center justify-between gap-2 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 border-0 bg-gray-50 hover:bg-gray-100 px-3 py-2.5 min-w-[140px]',
    content: 'z-50 min-w-[220px] overflow-hidden rounded-md border border-gray-200 bg-white p-1 text-gray-950 shadow-md',
    sectionHeader: 'px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wide',
    viewItem: 'relative flex cursor-default select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100',
    viewItemActive: 'bg-blue-50 text-blue-900',
    viewItemDefault: 'font-medium',
    viewSubmenu: 'inline-flex items-center justify-between w-full',
    actionItem: 'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 hover:bg-gray-100',
    destructiveItem: 'text-red-600 focus:bg-red-100 focus:text-red-900 hover:bg-red-100 hover:text-red-900'
} as const;

// Type exports for better IDE support
export type TableStyles = typeof tableStyles;
export type ToolbarStyles = typeof toolbarStyles;
export type BadgeStyles = typeof badgeStyles;
export type StatsStyles = typeof statsStyles;
export type ModalStyles = typeof modalStyles;
export type DropdownStyles = typeof dropdownStyles;
export type PaginationStyles = typeof paginationStyles;
export type EmptyStateStyles = typeof emptyStateStyles;
export type LoadingStyles = typeof loadingStyles;
export type ErrorStyles = typeof errorStyles;
export type FocusStyles = typeof focusStyles;
export type MobileStyles = typeof mobileStyles;
