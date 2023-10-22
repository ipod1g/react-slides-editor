import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  // ContextMenuShortcut,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useSlidesActions } from '@/components/slideEditor/store';

export function ThumbnailContextMenuWrapper({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const { deleteSlide } = useSlidesActions();

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64" alignOffset={-100}>
        <ContextMenuLabel className="ml-4">Edit Slide</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem inset onClick={() => deleteSlide(index)}>
          Delete Slide
          {/* <ContextMenuShortcut>Del</ContextMenuShortcut> */}
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

export default ThumbnailContextMenuWrapper;
