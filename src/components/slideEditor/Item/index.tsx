import React from 'react';
import { TextItem, ImageItem } from '../store';
import ContextMenuWrapper from '@/components/slideEditor/Item/ContextMenuWrapper';
import ItemControl from '@/components/slideEditor/Item/ItemControl';
import Resizeable from '@/components/slideEditor/Item/Resizeable';
import RichTextBox from '@/components/slideEditor/Item/RichTextBox';

const Item = React.memo(
  ({
    item,
    idx,
    setEditableActiveStatus,
    quillEditorContainer,
    selectedItem,
    isThumbnail,
  }: {
    item: TextItem | ImageItem;
    idx: number;
    setEditableActiveStatus: any;
    quillEditorContainer: any;
    selectedItem: any;
    isThumbnail?: boolean;
  }) => {
    return (
      <React.Fragment key={'item-' + item.id}>
        {item.type === 'text' ? (
          <Resizeable
            item={item}
            isThumbnail={isThumbnail}
            idx={idx}
            isActive={selectedItem?.id === item.id}
          >
            <ContextMenuWrapper>
              {item.permission !== 'view' && <ItemControl itemId={item.id} />}
              <RichTextBox
                isThumbnail={isThumbnail}
                editable={item}
                onChangeActive={setEditableActiveStatus}
                quillEditorContainer={quillEditorContainer}
                isActive={selectedItem?.id === item.id}
              />
            </ContextMenuWrapper>
          </Resizeable>
        ) : (
          <Resizeable
            item={item}
            isThumbnail={isThumbnail}
            idx={idx}
            // lockAspectRatio
          >
            <ContextMenuWrapper>
              {item.permission !== 'view' && <ItemControl itemId={item.id} />}
              <img
                id={item.id}
                src={item.url}
                alt={`image-${item.id}`}
                className="h-full w-full object-fill"
              />
            </ContextMenuWrapper>
          </Resizeable>
        )}
      </React.Fragment>
    );
  }
);

export default Item;
