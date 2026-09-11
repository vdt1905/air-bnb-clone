// Reference-counted scroll lock.
//
// The reference locks with `body { overflow:hidden; position:fixed }` and
// restores the EXACT prior offset on close (measured: 1501 -> 1501).
// Stacked modals must not each restore, hence the count lives in uiStore.
// Implemented in M15.
export function useScrollLock() {
  throw new Error('useScrollLock: not implemented (IMPLEMENTATION_PLAN M15)');
}
