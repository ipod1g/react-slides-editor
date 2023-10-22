import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';

import useSlidesStore, {
  useSlidesActions,
} from '@/components/slideEditor/store';

export function ContextMenuWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentSlide = useSlidesStore((state) => state.currentSlide);
  const selectedItem = useSlidesStore((state) => state.selectedItem);
  const { deleteItem, changeZIndex } = useSlidesActions();

  //TODO: add keyboard shortcuts

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel className="ml-4">Edit Item</ContextMenuLabel>
        <ContextMenuItem
          inset
          onClick={() => {
            if (!selectedItem) return;
            changeZIndex(currentSlide, selectedItem.id, 'bottom');
          }}
        >
          Move to Back
          <ContextMenuShortcut>&#91;</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onClick={() => {
            if (!selectedItem) return;
            changeZIndex(currentSlide, selectedItem.id, 'top');
          }}
        >
          Move to Front
          <ContextMenuShortcut>&#93;</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem inset onClick={() => deleteItem(currentSlide)}>
          Delete
          <ContextMenuShortcut>Del</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default ContextMenuWrapper;
